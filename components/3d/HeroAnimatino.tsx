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

      const scale = 0.045 + (Math.sin(t + i) + 1) * 0.022;
      dummy.scale.setScalar(scale);

      // Պտույտ ավելացրեցի ավելի դինամիկ տեսքի համար
      dummy.rotation.x = t * node.speed * 0.8 + i;
      dummy.rotation.y = t * node.speed * 0.6;

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Կլորի փոխարեն Icosahedron */}
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color="#22c55e" 
        wireframe={false} 
      />
    </instancedMesh>
  );
}

// Lines-ը թողեցի նույնը (կարող ես նաև փոխել)
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

      const b = a.clone().add(
        new THREE.Vector3(
          Math.sin(t * Math.PI * 3) * 1.5,
          Math.cos(t * Math.PI * 2.5) * 1.2,
          0,
        )
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

    const targetX = mouse.x * 0.6;
    const targetY = mouse.y * 0.4 + scrollY * 0.002;

    camera.position.x += (targetX - camera.position.x) * delta * 4;
    camera.position.y += (targetY - camera.position.y) * delta * 4;
    camera.position.z = 8 + scrollY * 0.004;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroAnimation() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 55,
      }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop="always"
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />

      <Nodes count={90} />
      <Lines />
      <Rig />
    </Canvas>
  );
}