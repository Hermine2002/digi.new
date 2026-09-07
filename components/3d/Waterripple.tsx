"use client";

import { useEffect, useRef } from "react";

interface WaterRippleProps {
  className?: string;
}

/**
 * Interactive water-ripple shader, inspired by the WebGL2 caustics/ripple
 * technique from https://codepen.io/TaminoMartinius/pen/PwWBZYM, recolored
 * to the site's #00c050 green. Simulates a height field on a ping-pong
 * float texture (wave equation + damping), then renders it with refraction
 * caustics, a noise "floor", fresnel and a specular highlight.
 */
export function WaterRipple({ className }: WaterRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      depth: false,
      powerPreference: "high-performance",
    }) as WebGL2RenderingContext | null;

    if (!gl) {
      container.removeChild(canvas);
      return;
    }
    if (
      !gl.getExtension("EXT_color_buffer_float") &&
      !gl.getExtension("EXT_color_buffer_half_float")
    ) {
      container.removeChild(canvas);
      return;
    }
    gl.getExtension("OES_texture_half_float_linear");

    // ---------- shaders ----------
    const VERT = `#version 300 es
      out vec2 vUv;
      void main() {
        vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
        vUv = p;
        gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
      }
    `;

    const MAX_DROPS = 10;

    const UPDATE = `#version 300 es
      precision highp float;
      uniform sampler2D uState;
      uniform vec2 uTexel;
      uniform float uAspect;
      uniform int uDropCount;
      uniform vec4 uDrops[${MAX_DROPS}];
      uniform float uPropagation;
      uniform float uDamping;
      uniform float uEdgeWidth;
      uniform float uEdgeDamp;
      uniform float uClampH;
      in vec2 vUv;
      out vec4 o;
      void main() {
        vec2 uv = vUv;
        float c = texture(uState, uv).r;
        float p = texture(uState, uv).g;
        float l = texture(uState, uv - vec2(uTexel.x, 0.0)).r;
        float r = texture(uState, uv + vec2(uTexel.x, 0.0)).r;
        float u = texture(uState, uv + vec2(0.0, uTexel.y)).r;
        float d = texture(uState, uv - vec2(0.0, uTexel.y)).r;
        float nv = (2.0 * c - p) + (l + r + u + d - 4.0 * c) * uPropagation;
        nv *= uDamping;
        for (int i = 0; i < ${MAX_DROPS}; i++) {
          if (i >= uDropCount) break;
          vec2 dp = uv - uDrops[i].xy;
          dp.x *= uAspect;
          float rr = uDrops[i].w;
          nv += uDrops[i].z * exp(-dot(dp, dp) / (rr * rr));
        }
        vec2 e = min(uv, 1.0 - uv);
        nv *= mix(uEdgeDamp, 1.0, smoothstep(0.0, uEdgeWidth, min(e.x, e.y)));
        o = vec4(clamp(nv, -uClampH, uClampH), c, 0.0, 1.0);
      }
    `;

    const RENDER = `#version 300 es
      precision highp float;
      uniform sampler2D uState;
      uniform vec2 uTexel;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uAspect;

      uniform float uCausticA;
      uniform float uDetFloor;
      uniform float uClamp1;
      uniform float uContrast;
      uniform float uClamp2;
      uniform float uFloorBase;
      uniform float uCausticGain;
      uniform vec3 uVeinColor;
      uniform float uVeinThresh;
      uniform float uVeinGain;

      uniform float uParallax;
      uniform float uNScale;

      uniform vec3 uFloorHi;
      uniform vec3 uFloorLo;
      uniform vec3 uDeepColor;
      uniform vec3 uAbsorb;
      uniform float uAbsorbScale;
      uniform float uBaseDepth;
      uniform float uDepthScale;
      uniform float uDeepGain;

      uniform vec3 uSkyColor;
      uniform float uFresnelPow;
      uniform float uFresnelGain;

      uniform vec3 uGlintColor;
      uniform float uGlintGain;

      uniform float uExposure;
      uniform float uGamma;
      uniform float uGrain;

      in vec2 vUv;
      out vec4 frag;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i), b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p) {
        float s = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.02; a *= 0.5; }
        return s;
      }
      vec3 floorColor(vec2 uv) {
        vec2 p = uv * vec2(uAspect, 1.0);
        float rip = fbm(p * 6.0 + fbm(p * 2.5) * 0.6);
        vec3 b = mix(uFloorHi, uFloorLo, rip);
        return b + (vnoise(p * 200.0) - 0.5) * 0.03;
      }

      void main() {
        vec2 uv = vUv, t = uTexel;
        float hc = texture(uState, uv).r;
        float hl = texture(uState, uv - vec2(t.x, 0.0)).r;
        float hr = texture(uState, uv + vec2(t.x, 0.0)).r;
        float hu = texture(uState, uv + vec2(0.0, t.y)).r;
        float hd = texture(uState, uv - vec2(0.0, t.y)).r;
        float hpp = texture(uState, uv + t).r;
        float hmm = texture(uState, uv - t).r;
        float hpm = texture(uState, uv + vec2(t.x, -t.y)).r;
        float hmp = texture(uState, uv + vec2(-t.x, t.y)).r;

        float hx = (hr - hl) * 0.5, hy = (hu - hd) * 0.5;
        float hxx = hr - 2.0 * hc + hl, hyy = hu - 2.0 * hc + hd;
        float hxy = (hpp - hpm - hmp + hmm) * 0.25;

        float jxx = 1.0 - uCausticA * hxx;
        float jyy = 1.0 - uCausticA * hyy;
        float jxy = -uCausticA * hxy;
        float det = jxx * jyy - jxy * jxy;
        float ca = clamp(1.0 / max(abs(det), uDetFloor), 0.0, uClamp1);
        ca = clamp(pow(ca, uContrast), 0.0, uClamp2);

        vec2 land = uv + vec2(hx, hy) * uParallax;
        vec3 col = floorColor(land) * (uFloorBase + ca * uCausticGain);
        col += uVeinColor * max(ca - uVeinThresh, 0.0) * uVeinGain;

        float depth = clamp(uBaseDepth - hc * uDepthScale, 0.2, 3.0);
        col *= exp(-uAbsorb * depth * uAbsorbScale);
        col += uDeepColor * depth * uDeepGain;

        vec3 N = normalize(vec3(-hx * uNScale, -hy * uNScale, 1.0));
        vec3 V = vec3(0.0, 0.0, 1.0);
        vec3 sun = normalize(vec3(0.35, 0.5, 0.8));
        float sp = pow(max(dot(N, normalize(sun + V)), 0.0), 140.0);
        col += sp * uGlintColor * uGlintGain;

        col = mix(col, uSkyColor, pow(1.0 - N.z, uFresnelPow) * uFresnelGain);

        vec2 c2 = (uv - 0.5) * vec2(uAspect, 1.0);
        col *= mix(0.6, 1.05, smoothstep(1.28, 0.32, length(c2)));

        col = vec3(1.0) - exp(-col * uExposure);
        col += (hash(uv * uResolution + fract(uTime)) - 0.5) * uGrain;

        // On a light page background, only paint where the surface is
        // actually disturbed (ripples/caustics) -- calm areas stay fully
        // transparent so the white shows through underneath.
        float activity = clamp(abs(hc) * 9.0 + ca * 0.4 + sp * 1.2, 0.0, 1.0);
        float alpha = mix(0.0, 1.0, pow(activity, 0.55));

        frag = vec4(pow(max(col, vec3(0.0)), vec3(uGamma)), alpha);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        const log = gl!.getShaderInfoLog(s);
        gl!.deleteShader(s);
        throw new Error(log || "shader compile error");
      }
      return s;
    }
    function link(vs: string, fs: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, compile(gl!.VERTEX_SHADER, vs));
      gl!.attachShader(p, compile(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(p);
      if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
        throw new Error(gl!.getProgramInfoLog(p) || "program link error");
      }
      return p;
    }

    let updateP: WebGLProgram, renderP: WebGLProgram;
    try {
      updateP = link(VERT, UPDATE);
      renderP = link(VERT, RENDER);
    } catch {
      container.removeChild(canvas);
      return;
    }

    const uL = {
      uState: gl.getUniformLocation(updateP, "uState"),
      uTexel: gl.getUniformLocation(updateP, "uTexel"),
      uAspect: gl.getUniformLocation(updateP, "uAspect"),
      uDropCount: gl.getUniformLocation(updateP, "uDropCount"),
      uDrops: gl.getUniformLocation(updateP, "uDrops"),
      uPropagation: gl.getUniformLocation(updateP, "uPropagation"),
      uDamping: gl.getUniformLocation(updateP, "uDamping"),
      uEdgeWidth: gl.getUniformLocation(updateP, "uEdgeWidth"),
      uEdgeDamp: gl.getUniformLocation(updateP, "uEdgeDamp"),
      uClampH: gl.getUniformLocation(updateP, "uClampH"),
    };
    const rL: Record<string, WebGLUniformLocation | null> = {};
    [
      "uState", "uTexel", "uResolution", "uTime", "uAspect",
      "uCausticA", "uDetFloor", "uClamp1", "uContrast", "uClamp2",
      "uFloorBase", "uCausticGain", "uVeinColor", "uVeinThresh", "uVeinGain",
      "uParallax", "uNScale", "uFloorHi", "uFloorLo", "uDeepColor",
      "uAbsorb", "uAbsorbScale", "uBaseDepth", "uDepthScale", "uDeepGain",
      "uSkyColor", "uFresnelPow", "uFresnelGain", "uGlintColor", "uGlintGain",
      "uExposure", "uGamma", "uGrain",
    ].forEach((name) => { rL[name] = gl!.getUniformLocation(renderP, name); });

    // ---------- green palette (derived from #00c050) ----------
    const c = (r: number, g: number, b: number) => [r / 255, g / 255, b / 255] as const;
    const PARAMS = {
      propagation: 0.248, damping: 0.997, edgeWidth: 0.045, edgeDamp: 0.9, clampH: 2.4,
      causticA: 12, detFloor: 0.05, clamp1: 8, contrast: 1.3, clamp2: 10,
      floorBase: 0.6, causticGain: 0.6,
      veinColor: c(190, 255, 210), veinThresh: 0.7, veinGain: 0.28,
      parallax: 2.6, nScale: 10,
      floorHi: c(0, 192, 80), floorLo: c(0, 120, 50),
      deepColor: c(0, 140, 60), deepGain: 0.3,
      absorb: c(8, 18, 12), absorbScale: 0.7,
      baseDepth: 0.7, depthScale: 0.9,
      skyColor: c(220, 250, 235), fresnelPow: 5, fresnelGain: 0.12,
      glintColor: c(255, 255, 255), glintGain: 0.6,
      exposure: 1.3, gamma: 0.55, grain: 0.012,
    };

    // ---------- ping-pong float targets ----------
    const SIM = 256;
    type Tgt = { tex: WebGLTexture; fbo: WebGLFramebuffer };
    function makeTarget(): Tgt {
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA16F, SIM, SIM, 0, gl!.RGBA, gl!.HALF_FLOAT, null);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    }
    let targets = [makeTarget(), makeTarget()];
    let read = 0;
    function clearTargets() {
      for (const t of targets) {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, t.fbo);
        gl!.viewport(0, 0, SIM, SIM);
        gl!.clearColor(0, 0, 0, 1);
        gl!.clear(gl!.COLOR_BUFFER_BIT);
      }
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    }
    clearTargets();
    const vao = gl.createVertexArray();

    // ---------- sizing ----------
    let vw = 1, vh = 1;
    function resize() {
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = container.clientWidth || 1;
      vh = container.clientHeight || 1;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    // ---------- drops ----------
    const dropData = new Float32Array(MAX_DROPS * 4);
    let pending: number[][] = [];
    const queueDrop = (x: number, y: number, s: number, r: number) => {
      if (pending.length < MAX_DROPS) pending.push([x, y, s, r]);
    };
    function uploadDrops() {
      const n = Math.min(pending.length, MAX_DROPS);
      for (let k = 0; k < n; k++) dropData.set(pending[k], k * 4);
      pending = [];
      return n;
    }

    let px = 0.5, py = 0.5, hasPointer = false;
    const toUv = (x: number, y: number): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      return [
        Math.min(Math.max((x - rect.left) / rect.width, 0), 1),
        Math.min(Math.max(1 - (y - rect.top) / rect.height, 0), 1),
      ];
    };
    const onPointerMove = (e: PointerEvent) => {
      const [x, y] = toUv(e.clientX, e.clientY);
      if (hasPointer) {
        const dist = Math.hypot(x - px, y - py);
        queueDrop(x, y, Math.min(0.03 + dist * 1.4, 0.16), 0.038);
      }
      px = x; py = y; hasPointer = true;
    };
    const onPointerDown = (e: PointerEvent) => {
      const [x, y] = toUv(e.clientX, e.clientY);
      queueDrop(x, y, 0.35, 0.06);
      px = x; py = y; hasPointer = true;
    };
    const onPointerLeave = () => { hasPointer = false; };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onPointerLeave);

    // gentle ambient ripples so the surface is never fully still
    let nextAmbient = 1;

    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;

    let raf = 0;
    let last = performance.now();
    let accum = 0;
    const step = 1 / 60;

    function simStep() {
      const t = now();
      nextAmbient -= step;
      if (nextAmbient <= 0) {
        nextAmbient = 0.4 + Math.random() * 0.8;
        queueDrop(
          0.15 + Math.random() * 0.7,
          0.15 + Math.random() * 0.7,
          0.03 + Math.random() * 0.03,
          0.04 + Math.random() * 0.03
        );
      }
      const cnt = uploadDrops();
      const src = targets[read], dst = targets[read ^ 1];
      gl!.useProgram(updateP);
      gl!.bindVertexArray(vao);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, dst.fbo);
      gl!.viewport(0, 0, SIM, SIM);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, src.tex);
      gl!.uniform1i(uL.uState, 0);
      gl!.uniform2f(uL.uTexel, 1 / SIM, 1 / SIM);
      gl!.uniform1f(uL.uAspect, vw / vh);
      gl!.uniform1i(uL.uDropCount, cnt);
      gl!.uniform4fv(uL.uDrops, dropData);
      gl!.uniform1f(uL.uPropagation, PARAMS.propagation);
      gl!.uniform1f(uL.uDamping, PARAMS.damping);
      gl!.uniform1f(uL.uEdgeWidth, PARAMS.edgeWidth);
      gl!.uniform1f(uL.uEdgeDamp, PARAMS.edgeDamp);
      gl!.uniform1f(uL.uClampH, PARAMS.clampH);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      read ^= 1;
      void t;
    }

    function render() {
      gl!.useProgram(renderP);
      gl!.bindVertexArray(vao);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, targets[read].tex);
      gl!.uniform1i(rL.uState, 0);
      gl!.uniform2f(rL.uTexel, 1 / SIM, 1 / SIM);
      gl!.uniform2f(rL.uResolution, canvas.width, canvas.height);
      gl!.uniform1f(rL.uTime, now());
      gl!.uniform1f(rL.uAspect, vw / vh);

      gl!.uniform1f(rL.uCausticA, PARAMS.causticA);
      gl!.uniform1f(rL.uDetFloor, PARAMS.detFloor);
      gl!.uniform1f(rL.uClamp1, PARAMS.clamp1);
      gl!.uniform1f(rL.uContrast, PARAMS.contrast);
      gl!.uniform1f(rL.uClamp2, PARAMS.clamp2);
      gl!.uniform1f(rL.uFloorBase, PARAMS.floorBase);
      gl!.uniform1f(rL.uCausticGain, PARAMS.causticGain);
      gl!.uniform3f(rL.uVeinColor, ...PARAMS.veinColor);
      gl!.uniform1f(rL.uVeinThresh, PARAMS.veinThresh);
      gl!.uniform1f(rL.uVeinGain, PARAMS.veinGain);

      gl!.uniform1f(rL.uParallax, PARAMS.parallax);
      gl!.uniform1f(rL.uNScale, PARAMS.nScale);

      gl!.uniform3f(rL.uFloorHi, ...PARAMS.floorHi);
      gl!.uniform3f(rL.uFloorLo, ...PARAMS.floorLo);
      gl!.uniform3f(rL.uDeepColor, ...PARAMS.deepColor);
      gl!.uniform3f(rL.uAbsorb, ...PARAMS.absorb);
      gl!.uniform1f(rL.uAbsorbScale, PARAMS.absorbScale);
      gl!.uniform1f(rL.uBaseDepth, PARAMS.baseDepth);
      gl!.uniform1f(rL.uDepthScale, PARAMS.depthScale);
      gl!.uniform1f(rL.uDeepGain, PARAMS.deepGain);

      gl!.uniform3f(rL.uSkyColor, ...PARAMS.skyColor);
      gl!.uniform1f(rL.uFresnelPow, PARAMS.fresnelPow);
      gl!.uniform1f(rL.uFresnelGain, PARAMS.fresnelGain);

      gl!.uniform3f(rL.uGlintColor, ...PARAMS.glintColor);
      gl!.uniform1f(rL.uGlintGain, PARAMS.glintGain);

      gl!.uniform1f(rL.uExposure, PARAMS.exposure);
      gl!.uniform1f(rL.uGamma, PARAMS.gamma);
      gl!.uniform1f(rL.uGrain, PARAMS.grain);

      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      let dt = (t - last) / 1000;
      if (dt > 0.25) dt = 0.25;
      last = t;
      accum += dt;
      let n = 0;
      while (accum >= step && n < 4) { simStep(); accum -= step; n++; }
      if (n === 0) simStep();
      render();
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      for (const tgt of targets) {
        gl!.deleteFramebuffer(tgt.fbo);
        gl!.deleteTexture(tgt.tex);
      }
      gl!.deleteProgram(updateP);
      gl!.deleteProgram(renderP);
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}