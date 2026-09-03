"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Galaxy({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const count = 70000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorInside = new THREE.Color("#10b981"); // emerald-500
    const colorOutside = new THREE.Color("#22d3ee"); // cyan-400

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random() * 4.5, Math.random() * 2);
      const spinAngle = radius * 3;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      const rx = Math.pow(Math.random(), 4) * (Math.random() > 0.5 ? 1 : -1) * 0.8;
      const ry = Math.pow(Math.random(), 3.5) * (Math.random() > 0.5 ? 1 : -1) * 0.6;
      const rz = Math.pow(Math.random(), 4) * (Math.random() > 0.5 ? 1 : -1) * 0.8;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

      const mixed = colorInside.clone();
      mixed.lerp(colorOutside, Math.random() * (radius / 3));

      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const scroll = scrollProgress.current || 0;
      pointsRef.current.rotation.y = scroll * Math.PI * 3.5;
      pointsRef.current.rotation.x = Math.sin(scroll * 2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        transparent
      />
    </points>
  );
}

export default function GalaxyBackground({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  return (
    <div className="absolute inset-0 z-0 opacity-70">
      <Canvas
        camera={{ position: [0, 8, 15], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Galaxy scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}