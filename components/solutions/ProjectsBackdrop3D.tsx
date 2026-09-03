"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// const MODEL_CONFIGS = [
//   { path: "/models/security_cameras_low_polygon__game_ready.glb", targetSize: 3.4 },
  


// ] as const;

// MODEL_CONFIGS.forEach((m) => useGLTF.preload(m.path));

// Fixed on-screen slots the models occupy simultaneously.
// Section-ից section models swap between these slots.
const SLOTS = [
  { x: 2.7, y: 1.1, z: -1.0 },
  { x: 2.5, y: -0.5, z: -2.0 },
  { x: -1.5, y: -1.8, z: -0.4 },
  { x: 2.1, y: 1.9, z: -1.8 },
];

function useNormalizedScene(path: string, targetSize: number) {
  const { scene } = useGLTF(path);

  return useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const srcMat = mesh.material as THREE.MeshStandardMaterial;
        mesh.material = srcMat.clone();
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;

    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    clone.scale.setScalar(scale);

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    return wrapper;
  }, [scene, targetSize]);
}

function ModelInstance({
  path,
  targetSize,
  onRef,
}: {
  path: string;
  targetSize: number;
  onRef: (obj: THREE.Group) => void;
}) {
  const scene = useNormalizedScene(path, targetSize);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (ref.current) onRef(ref.current);
  }, [onRef]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0022;
  });

  return <primitive ref={ref} object={scene} />;
}

function transitionModel(obj: THREE.Object3D, target: { x: number; y: number; z: number }, spinDir: number) {
  gsap.killTweensOf(obj.position);
  gsap.killTweensOf(obj.scale);
  gsap.killTweensOf(obj.rotation);

  const tl = gsap.timeline();
  tl.to(obj.scale, { x: 1.32, y: 1.32, z: 1.32, duration: 0.22, ease: "power2.out" }, 0)
    .to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.55, ease: "power3.out" }, 0.22)
    .to(obj.position, { x: target.x, y: target.y, z: target.z, duration: 0.8, ease: "power4.out" }, 0)
    .to(obj.rotation, { y: obj.rotation.y + spinDir * Math.PI * 0.55, duration: 0.8, ease: "power3.out" }, 0);
}

function Scene3D({ containerId }: { containerId: string }) {
  const modelRefs = useRef<(THREE.Object3D | null)[]>([]);
  const rootRef = useRef<THREE.Group>(null);
  const parallax = useRef(0);

  useFrame(() => {
    if (rootRef.current) rootRef.current.position.x = -parallax.current * 0.5;
  });

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const parallaxTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => (parallax.current = self.progress),
    });

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-project-section]")
    ).sort((a, b) => Number(a.dataset.projectSection) - Number(b.dataset.projectSection));

    const applyLayout = (sectionIndex: number) => {
      modelRefs.current.forEach((obj, modelIndex) => {
        if (!obj) return;
        const slot = SLOTS[(modelIndex + sectionIndex) % SLOTS.length];
        const spinDir = (modelIndex % 2 === 0 ? 1 : -1) * (sectionIndex % 2 === 0 ? 1 : -1);
        transitionModel(obj, slot, spinDir);
      });
    };

    // Initial layout
    applyLayout(0);

    const triggers = sections.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => applyLayout(i),
        onEnterBack: () => applyLayout(i),
      })
    );

    return () => {
      parallaxTrigger.kill();
      triggers.forEach((t) => t.kill());
    };
  }, [containerId]);

  return (
    <group ref={rootRef}>
      {/* {MODEL_CONFIGS.map((cfg, i) => (
        <ModelInstance
          key={cfg.path}
          path={cfg.path}
          targetSize={cfg.targetSize}
          onRef={(obj) => {
            obj.position.set(SLOTS[i].x, SLOTS[i].y, SLOTS[i].z);
            modelRefs.current[i] = obj;
          }}
        />
      ))} */}
    </group>
  );
}

export function ProjectsBackdrop3D({ containerId }: { containerId: string }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 10, 6]} intensity={1.1} color="#8fd3ff" />
        <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#7c5cff" />
        <pointLight position={[0, 3, 4]} intensity={0.6} color="#00e5ff" />
        <Scene3D containerId={containerId} />
      </Suspense>
    </Canvas>
  );
}