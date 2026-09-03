"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF, Center } from "@react-three/drei";
// import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


// const ABOUT_MODEL_PATH2 = "/models/camera.glb";

// useGLTF.preload(ABOUT_MODEL_PATH2);

// function BrandModel({
//   scrollProgress,
//   activeIndexRef,
// }: {
//   scrollProgress: React.MutableRefObject<number>;
//   activeIndexRef: React.MutableRefObject<number>;
// }) {
//   // const { scene } = useGLTF(ABOUT_MODEL_PATH2);
//   // const cloned = useMemo(() => scene.clone(true), [scene]);
//   const groupRef = useRef<THREE.Group>(null);
//   const currentX = useRef(0);
//   const currentTilt = useRef(0);

//   useFrame((state) => {
//     const t = state.clock.elapsedTime;
//     const p = scrollProgress.current;

//     const fromRight = activeIndexRef.current % 2 === 0;
//     const targetX = fromRight ? 3.5 : -3.5;
//     const targetTilt = fromRight ? 0.25 : -0.25;

//     currentX.current += (targetX - currentX.current) * 0.1;
//     currentTilt.current += (targetTilt - currentTilt.current) * 0.1;

//     if (groupRef.current) {
//       groupRef.current.position.x = currentX.current;
//       groupRef.current.rotation.y = p * Math.PI * 1.2 + t * 0.05 + currentTilt.current;
//       groupRef.current.position.y = -p * 5;
//     }
//   });

//   return (
//     <group ref={groupRef} position={[0, 0, 0]}>
//       <Center>
//         {/* <primitive object={cloned} scale={0.03} /> */}
//       </Center>
//     </group>
//   );
// }

export function AboutBackdrop3D({
  containerId,
  activeIndexRef,
}: {
  containerId: string;
  activeIndexRef: React.MutableRefObject<number>;
}) {
  const scrollProgress = useRef(0);

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [containerId]);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 0.5]}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#00C853" />
        {/* <BrandModel scrollProgress={scrollProgress} activeIndexRef={activeIndexRef} /> */}
      </Suspense>
    </Canvas>
  );
}