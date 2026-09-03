"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

interface FloatingParticlesProps {
  className?: string;
}

export function FloatingParticles({ className }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let particles: THREE.Points;
    let animationFrameId: number;

    const PARTICLE_SIZE_BASE = 24;
    const PARTICLE_SIZE_GROW = 32;

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isMoving: false };
    let lastMouseTime = Date.now();

    // --- INIT ---
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      10000
    );
    camera.position.z = 250;

    // --- ՊԱՐՏԻԿՆԵՐՈՎ ՀԱՎԱՔՎԱԾ ՄՈԴԵԼ ---
    const boxGeo = new THREE.BoxGeometry(100, 100, 100, 14, 14, 14);
    boxGeo.deleteAttribute("normal");
    boxGeo.deleteAttribute("uv");
    
    let mergedGeo = BufferGeometryUtils.mergeVertices(boxGeo);
    const geometry = Object.assign(mergedGeo, {
      parameters: boxGeo.parameters,
    });

    const positionAttribute = geometry.getAttribute("position");
    const particleCount = positionAttribute.count;

    // Հիշում ենք սկզբնական դիրքերը
    const originalPositions = new Float32Array(positionAttribute.array.length);
    originalPositions.set(positionAttribute.array);

    // Ստեղծում ենք ուղղությունների/արագությունների զանգված ցրման համար
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      velocities[i] = (Math.random() - 0.5) * 15;
    }

    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      color.setHSL(0.35, 0.8, 0.35);
      color.toArray(colors, i * 3);
      sizes[i] = PARTICLE_SIZE_BASE;
    }

    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));

    // --- SHADERS ---
    const vertexShader = `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      uniform float scale;

      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( scale / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord.xy - vec2(0.5);
        float dist = length(uv);
        if (dist > 0.5) discard;

        float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
        gl_FragColor = vec4( color * vColor, alpha * 0.9 );
        
        if (gl_FragColor.a < 0.01) discard;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00c050) },
        scale: { value: window.innerHeight * 0.5 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    particles = new THREE.Points(geometry, material);
    
    // Դիրքը ըստ քո պահանջի
    particles.position.x = 90;
    particles.position.y = -30;
    particles.position.z = 1;

    scene.add(particles);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- MOUSE TRACKING ---
    const onPointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      mouse.targetX = x;
      mouse.targetY = y;
      mouse.isMoving = true;
      lastMouseTime = Date.now();
    };

    container.addEventListener("pointermove", onPointerMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.scale.value = window.innerHeight * 0.5;
    };

    window.addEventListener("resize", handleResize);

    // --- ANIMATION LOOP ---
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Ստուգում ենք՝ արդյոք մկնիկը շարժվում է, թե կանգնել է
      if (Date.now() - lastMouseTime > 200) {
        mouse.isMoving = false;
      }

      // Մկնիկի հարթ անցում
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Տեղական պտույտ
      particles.rotation.x += 0.003;
      particles.rotation.y += 0.005;

      const posAttr = geometry.getAttribute("position");
      const posArray = posAttr.array as Float32Array;

      // Մկնիկի ազդեցության ուժը կախված շարժումից
      const scatterFactor = mouse.isMoving ? 1.4 : 0.0;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];

        if (mouse.isMoving) {
          // Մկնիկը շարժելիս պարտիկները պայթում/ցրվում են ամբողջ էկրանով՝ օգտագործելով իրենց velocities-ները
          const speed = 2.5;
          posArray[i3]     += velocities[i3] * speed * scatterFactor;
          posArray[i3 + 1] += velocities[i3 + 1] * speed * scatterFactor;
          posArray[i3 + 2] += velocities[i3 + 2] * speed * scatterFactor;

          // Սահմանափակում ենք, որ չափից շատ չհեռանան
          const maxDist = 300;
          const currentDist = Math.sqrt(
            Math.pow(posArray[i3] - origX, 2) +
            Math.pow(posArray[i3 + 1] - origY, 2) +
            Math.pow(posArray[i3 + 2] - origZ, 2)
          );
          if (currentDist > maxDist) {
            posArray[i3] = origX + (posArray[i3] - origX) * 0.9;
            posArray[i3 + 1] = origY + (posArray[i3 + 1] - origY) * 0.9;
            posArray[i3 + 2] = origZ + (posArray[i3 + 2] - origZ) * 0.9;
          }
        } else {
          // Մկնիկը կանգնելիս կամ հեռանալիս պարտիկները հարթ վերադառնում են իրենց սկզբնական տեղերը (հավաքվում են)
          posArray[i3]     += (origX - posArray[i3])     * 0.07;
          posArray[i3 + 1] += (origY - posArray[i3 + 1]) * 0.07;
          posArray[i3 + 2] += (origZ - posArray[i3 + 2]) * 0.07;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
}