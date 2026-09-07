"use client";

import { useEffect, useRef } from "react";

interface LODFieldProps {
  className?: string;
  count?: number;
}

/**
 * Fixed, full-viewport background: a field of wireframe icosahedrons using
 * THREE.LOD (fewer triangles the farther they are from the camera), with a
 * slow, automatic camera drift through the field. Based on the three.js
 * "webgl_lod" example, recolored to #00c050 and de-interactive so it can
 * sit behind page content (no FlyControls -- the camera flies itself).
 */
export function LODField({ className, count = 260 }: LODFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: any;
    let scene: any;
    let camera: any;
    let animationId: number;
    let disposed = false;
    let handleResize: () => void = () => {};
    let handlePointerMove: (e: PointerEvent) => void = () => {};
    let handleScroll: () => void = () => {};

    const geometries: any[] = [];
    let material: any;

    (async () => {
      const THREE = await import("three");
      if (disposed || !container) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, 200, 9000);

      camera = new THREE.PerspectiveCamera(45, width / height, 1, 15000);
      camera.position.set(0, 0, 1400);

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

      // ---------- lights ----------
      const pointLight = new THREE.PointLight(0x00c050, 3, 0, 0);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
      dirLight.position.set(0, 0, 1).normalize();
      scene.add(dirLight);

      scene.add(new THREE.AmbientLight(0x0a2e18, 1.0));

      // ---------- LOD levels (same subdivision scheme as three.js's example) ----------
      const levels = [
        [new THREE.IcosahedronGeometry(100, 5), 50],
        [new THREE.IcosahedronGeometry(100, 4), 300],
        [new THREE.IcosahedronGeometry(100, 3), 1000],
        [new THREE.IcosahedronGeometry(100, 2), 2000],
        [new THREE.IcosahedronGeometry(100, 1), 8000],
      ] as const;
      levels.forEach((l) => geometries.push(l[0]));

      material = new THREE.MeshLambertMaterial({ color: 0x00c050, wireframe: true });

      const fieldGroup = new THREE.Group();
      scene.add(fieldGroup);

      for (let j = 0; j < count; j++) {
        const lod = new THREE.LOD();
        for (let i = 0; i < levels.length; i++) {
          const mesh = new THREE.Mesh(levels[i][0], material);
          mesh.scale.set(1.5, 1.5, 1.5);
          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;
          lod.addLevel(mesh, levels[i][1]);
        }
        lod.position.x = 8000 * (0.5 - Math.random());
        lod.position.y = 5000 * (0.5 - Math.random());
        lod.position.z = 8000 * (0.5 - Math.random());
        lod.updateMatrix();
        lod.matrixAutoUpdate = false;
        fieldGroup.add(lod);
      }

      // ---------- pointer-driven parallax + auto flythrough path ----------
      handleResize = () => {
        if (!renderer || !camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      let mouseX = 0;
      let mouseY = 0;
      let targetMouseX = 0;
      let targetMouseY = 0;

      handlePointerMove = (e: PointerEvent) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", handlePointerMove);

      // ---------- scroll tracking ----------
      let targetScroll = 0;
      let scrollProgress = 0;

      handleScroll = () => {
        const doc = document.documentElement;
        const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
        targetScroll = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      const clock = new THREE.Clock();
      const target = new THREE.Vector3();
      const basePos = new THREE.Vector3();
      const baseTarget = new THREE.Vector3();

      const PARALLAX_POS = 900;
      const PARALLAX_LOOK = 1400;
      const SCROLL_DEPTH = 3200;
      const SCROLL_SPIN = Math.PI * 1.5;

      const animate = () => {
        if (disposed) return;
        animationId = requestAnimationFrame(animate);
        const t = clock.elapsedTime;

        // smooth the raw pointer position so movement feels fluid, not jumpy
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;
        scrollProgress += (targetScroll - scrollProgress) * 0.06;

        // scrolling slowly spins the whole field, like passing through it
        fieldGroup.rotation.y = scrollProgress * SCROLL_SPIN;
        fieldGroup.rotation.x = scrollProgress * SCROLL_SPIN * 0.15;

        // slow lissajous-style autopilot drift through the field
        basePos.set(
          Math.sin(t * 0.05) * 2600,
          Math.sin(t * 0.037) * 1400,
          Math.cos(t * 0.04) * 2600 - scrollProgress * SCROLL_DEPTH
        );
        baseTarget.set(
          Math.sin(t * 0.05 + 0.6) * 2600,
          Math.sin(t * 0.037 + 0.6) * 1400,
          Math.cos(t * 0.04 + 0.6) * 2600 - scrollProgress * SCROLL_DEPTH
        );

        // mouse nudges both the camera position and where it looks, so
        // moving the pointer visibly steers/parallaxes the flythrough
        camera.position.set(
          basePos.x + mouseX * PARALLAX_POS,
          basePos.y - mouseY * PARALLAX_POS,
          basePos.z
        );
        target.set(
          baseTarget.x + mouseX * PARALLAX_LOOK,
          baseTarget.y - mouseY * PARALLAX_LOOK,
          baseTarget.z
        );
        camera.lookAt(target);

        scene.traverse((obj: any) => {
          if (obj.isLOD) obj.update(camera);
        });

        renderer.render(scene, camera);
      };
      animate();
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      for (const geo of geometries) geo.dispose();
      if (material) material.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}