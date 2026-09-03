"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Nodes({ count = 90 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const elapsed = useRef(0);

  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const t = index / Math.max(1, count);
      return {
        pos: new THREE.Vector3(
          Math.sin(t * Math.PI * 2) * 7 + ((index % 7) - 3) * 0.45,
          Math.cos(t * Math.PI * 1.3) * 4 + ((index % 5) - 2) * 0.4,
          Math.sin(t * Math.PI * 3) * 5,
        ),
        speed: 0.2 + ((index % 11) / 11) * 0.4,
        phase: t * Math.PI * 2,
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    nodes.forEach((node, i) => {
      dummy.position.set(
        node.pos.x + Math.sin(t * node.speed + node.phase) * 0.25,
        node.pos.y + Math.cos(t * node.speed + node.phase) * 0.25,
        node.pos.z,
      );

      const scale = 0.04 + (Math.sin(t + i) + 1) * 0.02;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#22c55e" />
    </instancedMesh>
  );
}

function Lines() {
  const ref = useRef<THREE.LineSegments>(null!);
  const elapsed = useRef(0);

  const geometry = useMemo(() => {
    const points: number[] = [];

    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      const a = new THREE.Vector3(
        Math.sin(t * Math.PI * 2) * 6,
        Math.cos(t * Math.PI * 1.6) * 3,
        (t - 0.5) * 8,
      );

      const b = a
        .clone()
        .add(
          new THREE.Vector3(
            Math.sin(t * Math.PI * 3) * 1.5,
            Math.cos(t * Math.PI * 2.5) * 1.2,
            0,
          ),
        );

      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (ref.current) {
      ref.current.rotation.z = Math.sin(elapsed.current * 0.1) * 0.05;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#16a34a" transparent opacity={0.35} />
    </lineSegments>
  );
}

function Rig() {
  useFrame(({ camera, mouse }, delta) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    
    // Տեղաշարժում ենք մկնիկի ազդեցությունը և բազային դիրքը դեպի աջ (+1.8)
    const targetX = mouse.x * 0.5 + 1.8;
    const targetY = mouse.y * 0.3 + scrollY * 0.002;

    camera.position.x += (targetX - camera.position.x) * delta * 4;
    camera.position.y += (targetY - camera.position.y) * delta * 4;
    camera.position.z = 8 + scrollY * 0.004;

    // Տեսախցիկը նայում է փոքր-ինչ աջ կենտրոնին, որ օբյեկտները մնան աջում
    camera.lookAt(1.5, 0, 0);
  });

  return null;
}

// HeroScene.tsx

// ... իմպորտները և այլ ֆունկցիաները (Nodes, Lines, Rig) մնում են նույնը

export function HeroScene() {
  return (
    <Canvas
      camera={{
        position: [2, 0, 8], // Տեսախցիկը փոքր-ինչ աջ է նայում
        fov: 50,
      }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop="always"
      className="!absolute inset-0 pointer-events-none z-0" // Ապահովում ենք, որ այն ֆոնին է
    >
      <ambientLight intensity={0.6} />

      {/* --- ԱՅՍՏԵՂ ԵՆ ՓՈՓՈԽՈՒԹՅՈՒՆՆԵՐԸ --- */}
      {/* Մենք խմբավորում ենք բոլոր օբյեկտները և փոքրացնում ենք 50%-ով (scale={[0.5, 0.5, 0.5]}) */}
      <group scale={[0.5, 0.5, 0.5]} position={[2, 0, 0]}>
        <Nodes count={90} />
        <Lines />
      </group>
      {/* ----------------------------------- */}

      <Rig />
    </Canvas>
  );
}