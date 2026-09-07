"use client";

import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  className?: string;
  color?: string;
  count?: number;
}

export function FloatingParticles({
  className,
  color = "#00c050",
  count = 9000,
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: any;
    let scene: any;
    let camera: any;
    let points: any;
    let animationId: number;
    let disposed = false;

    let handleResize: () => void = () => {};
    let handlePointerMove: (e: PointerEvent) => void = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // ---------- Scene setup ----------
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
      camera.position.set(0, 0, 34);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      // ---------- Seeded value noise (deterministic curl field) ----------
      const perm = new Uint8Array(512);
      const base = new Uint8Array(256);
      for (let i = 0; i < 256; i++) base[i] = i;
      let seed = 7919;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = base[i];
        base[i] = base[j];
        base[j] = tmp;
      }
      for (let i = 0; i < 512; i++) perm[i] = base[i & 255];

      const fade = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
      const lerp = (t: number, a: number, b: number) => a + t * (b - a);
      const grad = (hash: number, x: number, y: number, z: number) => {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
      };
      const noise3 = (x: number, y: number, z: number) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        const u = fade(x);
        const v = fade(y);
        const w = fade(z);
        const A = perm[X] + Y;
        const AA = perm[A] + Z;
        const AB = perm[A + 1] + Z;
        const B = perm[X + 1] + Y;
        const BA = perm[B] + Z;
        const BB = perm[B + 1] + Z;
        return lerp(
          w,
          lerp(
            v,
            lerp(u, grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z)),
            lerp(u, grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z))
          ),
          lerp(
            v,
            lerp(u, grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1)),
            lerp(u, grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1))
          )
        );
      };

      const EPS = 0.6;
      const curl = (x: number, y: number, z: number, t: number, out: any) => {
        const n1 = noise3(x, y + EPS, z + t);
        const n2 = noise3(x, y - EPS, z + t);
        const a = (n1 - n2) / (2 * EPS);

        const n3 = noise3(x, y, z + EPS + t);
        const n4 = noise3(x, y, z - EPS + t);
        const b = (n3 - n4) / (2 * EPS);

        const n5 = noise3(x + EPS, y, z + t);
        const n6 = noise3(x - EPS, y, z + t);
        const c = (n5 - n6) / (2 * EPS);

        const n7 = noise3(x, y + EPS, z + t + 5.2);
        const n8 = noise3(x, y - EPS, z + t + 5.2);
        const d = (n7 - n8) / (2 * EPS);

        const n9 = noise3(x + EPS, y, z + t + 9.1);
        const n10 = noise3(x - EPS, y, z + t + 9.1);
        const e = (n9 - n10) / (2 * EPS);

        const n11 = noise3(x, y, z + EPS + t + 3.7);
        const n12 = noise3(x, y, z - EPS + t + 3.7);
        const f = (n11 - n12) / (2 * EPS);

        out.x = a - f;
        out.y = b - c;
        out.z = d - e;
        return out;
      };

      // ---------- Particles ----------
      const RADIUS = 15;
      const positions = new Float32Array(count * 3);
      const origins = new Float32Array(count * 3);
      const speeds = new Float32Array(count);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const r = RADIUS * Math.pow(Math.random(), 0.5);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        origins[i * 3] = x;
        origins[i * 3 + 1] = y;
        origins[i * 3 + 2] = z;
        speeds[i] = 0.3 + Math.random() * 0.9;
        sizes[i] = 0.5 + Math.random() * 1.4;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

      const baseColor = new THREE.Color(color);

      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uColor: { value: baseColor },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
          attribute float aSize;
          varying float vDist;
          uniform float uPixelRatio;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vDist = -mvPosition.z;
            gl_PointSize = aSize * uPixelRatio * (90.0 / max(vDist, 1.0));
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vDist;
          uniform vec3 uColor;
          void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            float d = length(c);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d);
            float depthFade = clamp(1.0 - (vDist - 18.0) / 40.0, 0.35, 1.0);
            gl_FragColor = vec4(uColor, alpha * 0.55 * depthFade);
          }
        `,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      // ---------- Interaction: gentle parallax on pointer ----------
      let targetRotX = 0;
      let targetRotY = 0;
      let rotX = 0;
      let rotY = 0;

      handlePointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = nx * 0.35;
        targetRotX = ny * 0.2;
      };
      window.addEventListener("pointermove", handlePointerMove);

      // ---------- Resize ----------
      handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // ---------- Animate ----------
      const clock = new THREE.Clock();
      const flow = { x: 0, y: 0, z: 0 };

      const animate = () => {
        if (disposed) return;
        animationId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        rotX += (targetRotX - rotX) * 0.04;
        rotY += (targetRotY - rotY) * 0.04;
        points.rotation.x = rotX;
        points.rotation.y = rotY + t * 0.015;

        const posAttr = geometry.attributes.position;
        const arr = posAttr.array as Float32Array;
        const noiseScale = 0.055;
        const timeScale = 0.05;

        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const iy = ix + 1;
          const iz = ix + 2;
          const x = arr[ix];
          const y = arr[iy];
          const z = arr[iz];

          curl(x * noiseScale, y * noiseScale, z * noiseScale, t * timeScale, flow);
          const spd = speeds[i];

          arr[ix] += flow.x * spd * dt * 4.5;
          arr[iy] += flow.y * spd * dt * 4.5;
          arr[iz] += flow.z * spd * dt * 4.5;

          arr[ix] += (origins[ix] - arr[ix]) * 0.006;
          arr[iy] += (origins[iy] - arr[iy]) * 0.006;
          arr[iz] += (origins[iz] - arr[iz]) * 0.006;
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
      };
      animate();
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
      if (points) {
        points.geometry.dispose();
        (points.material as any).dispose();
      }
    };
  }, [color, count]);

  return <div ref={containerRef} className={className} />;
}