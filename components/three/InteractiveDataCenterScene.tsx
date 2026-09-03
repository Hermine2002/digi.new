// "use client";

// import { useRef, useMemo, useEffect, Suspense } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Environment, ContactShadows, Float, Html, useProgress } from "@react-three/drei";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import * as THREE from "three";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useLanguage } from "@/context/LanguageContext";

// gsap.registerPlugin(ScrollTrigger);

// const CONFIG = {
//   gridSize: 5,
//   spacing: 3,
//   serverHeight: 2.5,
//   serverWidth: 0.7,
//   serverDepth: 0.7,
// };

// // ================= 3D COMPONENTS =================

// function ServerRack({ position, active = false, pulseDelay = 0 }: {
//   position: [number, number, number];
//   active?: boolean;
//   pulseDelay?: number;
// }) {
//   const meshRef = useRef<THREE.Group>(null);
//   const lightRef = useRef<THREE.Mesh>(null);

//   useFrame((state) => {
//     if (!meshRef.current) return;
//     const time = state.clock.elapsedTime;
//     meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + pulseDelay) * 0.015;

//     if (lightRef.current && active) {
//       const mat = lightRef.current.material as THREE.MeshBasicMaterial;
//       const pulse = Math.sin(time * 3 + pulseDelay) * 0.5 + 0.5;
//       mat.opacity = 0.2 + pulse * 0.6;
//     }
//   });

//   return (
//     <group ref={meshRef} position={position}>
//       <mesh castShadow>
//         <boxGeometry args={[CONFIG.serverWidth, CONFIG.serverHeight, CONFIG.serverDepth]} />
//         <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
//       </mesh>

//       <mesh position={[0, 0, 0.36]}>
//         <boxGeometry args={[CONFIG.serverWidth - 0.1, CONFIG.serverHeight - 0.1, 0.02]} />
//         <meshPhysicalMaterial
//           color="#e8f5e9"
//           transparent
//           opacity={0.15}
//           roughness={0.1}
//           metalness={0.1}
//           clearcoat={1}
//         />
//       </mesh>

//       <mesh ref={lightRef} position={[0, 0, 0.37]}>
//         <planeGeometry args={[0.4, 1.8]} />
//         <meshBasicMaterial color={active ? "#00C853" : "#333"} transparent opacity={0.3} side={THREE.DoubleSide} />
//       </mesh>

//       <mesh position={[0.2, 1.1, 0.37]}>
//         <sphereGeometry args={[0.03, 6, 6]} />
//         <meshBasicMaterial color={active ? "#00C853" : "#222"} />
//       </mesh>
//     </group>
//   );
// }

// function NetworkNode({ position }: { position: [number, number, number] }) {
//   const nodeRef = useRef<THREE.Mesh>(null);

//   useFrame((state) => {
//     if (nodeRef.current) {
//       nodeRef.current.rotation.y = state.clock.elapsedTime * 0.3;
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh ref={nodeRef}>
//         <octahedronGeometry args={[0.25, 0]} />
//         <meshStandardMaterial color="#00C853" emissive="#00C853" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
//       </mesh>
//       <mesh rotation={[Math.PI / 2, 0, 0]}>
//         <torusGeometry args={[0.4, 0.015, 6, 24]} />
//         <meshStandardMaterial color="#5EFC82" emissive="#5EFC82" emissiveIntensity={0.2} transparent opacity={0.5} />
//       </mesh>
//     </group>
//   );
// }

// function DataCenterFloor() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
//       <planeGeometry args={[25, 25]} />
//       <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.9} transparent opacity={0.2} />
//     </mesh>
//   );
// }

// function ParticleField({ count = 80 }: { count?: number }) {
//   const pointsRef = useRef<THREE.Points>(null);

//   const particles = useMemo(() => {
//     const positions = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 18;
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
//     }
//     return positions;
//   }, [count]);

//   useFrame((state) => {
//     if (pointsRef.current) {
//       pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
//     }
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
//       </bufferGeometry>
//       <pointsMaterial size={0.025} color="#00C853" transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} />
//     </points>
//   );
// }

// function InfrastructureGroup({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const layer1Ref = useRef<THREE.Group>(null);
//   const layer2Ref = useRef<THREE.Group>(null);

//   const serverPositions = useMemo(() => {
//     const positions: { pos: [number, number, number]; active: boolean; delay: number }[] = [];
//     const halfGrid = Math.floor(CONFIG.gridSize / 2);
//     for (let x = -halfGrid; x <= halfGrid; x++) {
//       for (let z = -halfGrid; z <= halfGrid; z++) {
//         const distance = Math.sqrt(x * x + z * z);
//         if (distance <= halfGrid + 0.5) {
//           positions.push({
//             pos: [x * CONFIG.spacing, 0, z * CONFIG.spacing],
//             active: distance < halfGrid * 0.7,
//             delay: distance * 0.2,
//           });
//         }
//       }
//     }
//     return positions;
//   }, []);

//   const nodePositions = useMemo(() => [
//     { pos: [0, 2.5, 0] as [number, number, number] },
//     { pos: [-4, 1.5, -4] as [number, number, number] },
//     { pos: [4, 1.5, -4] as [number, number, number] },
//     { pos: [-4, 1.5, 4] as [number, number, number] },
//     { pos: [4, 1.5, 4] as [number, number, number] },
//   ], []);

//   useFrame((state) => {
//     if (!groupRef.current) return;
//     const progress = scrollProgress.current;
//     const time = state.clock.elapsedTime;

//     if (progress < 0.25) {
//       groupRef.current.rotation.y = time * 0.08;
//     } else if (progress < 0.5) {
//       const t = (progress - 0.25) / 0.25;
//       groupRef.current.rotation.y = time * 0.08 + t * 0.3;
//     } else if (progress < 0.75) {
//       const t = (progress - 0.5) / 0.25;
//       if (layer1Ref.current) layer1Ref.current.position.y = t * 1.5;
//       if (layer2Ref.current) layer2Ref.current.position.y = -t * 0.8;
//     } else {
//       const t = (progress - 0.75) / 0.25;
//       if (layer1Ref.current) layer1Ref.current.position.y = (1 - t) * 1.5;
//       if (layer2Ref.current) layer2Ref.current.position.y = -(1 - t) * 0.8;
//       groupRef.current.rotation.y = time * 0.08;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       <group ref={layer1Ref}>
//         {serverPositions.map((server, i) => (
//           <ServerRack key={i} position={server.pos} active={server.active} pulseDelay={server.delay} />
//         ))}
//       </group>
//       <group ref={layer2Ref}>
//         {nodePositions.map((node, i) => (
//           <NetworkNode key={i} position={node.pos} />
//         ))}
//       </group>
//       <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
//         <mesh position={[0, 4, 0]}>
//           <icosahedronGeometry args={[0.4, 0]} />
//           <meshStandardMaterial color="#00C853" emissive="#00C853" emissiveIntensity={0.2} wireframe transparent opacity={0.2} />
//         </mesh>
//       </Float>
//       <DataCenterFloor />
//       <ParticleField count={80} />
//     </group>
//   );
// }

// function CameraController({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
//   const { camera } = useThree();
//   const mouseRef = useRef({ x: 0, y: 0 });
//   const currentPos = useRef(new THREE.Vector3(12, 8, 12));

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
//       mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   useFrame(() => {
//     const progress = scrollProgress.current;
//     let targetPos: [number, number, number];

//     if (progress < 0.25) {
//       targetPos = [10, 7, 10];
//     } else if (progress < 0.5) {
//       const t = (progress - 0.25) / 0.25;
//       targetPos = [10 - t * 4, 7 - t * 3, 10 - t * 4];
//     } else if (progress < 0.75) {
//       targetPos = [6, 4, 6];
//     } else {
//       const t = (progress - 0.75) / 0.25;
//       targetPos = [Math.cos(t * Math.PI) * 3, 2 + Math.sin(t * Math.PI) * 1.5, Math.sin(t * Math.PI) * 3];
//     }

//     targetPos[0] += mouseRef.current.x * 0.3;
//     targetPos[1] += mouseRef.current.y * 0.3;

//     currentPos.current.lerp(new THREE.Vector3(...targetPos), 0.03);
//     camera.position.copy(currentPos.current);
//     camera.lookAt(0, 0, 0);
//   });

//   return null;
// }

// function LoadingScreen() {
//   const { progress } = useProgress();
//   return (
//     <Html center>
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
//           <div className="h-full bg-[#00C853] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
//         </div>
//         <p className="text-sm text-zinc-500 font-medium">Loading 3D Scene... {Math.round(progress)}%</p>
//       </div>
//     </Html>
//   );
// }

// // ================= MAIN OVERLAY HERO COMPONENT =================

// export default function Hero3DSection() {
//   const scrollProgress = useRef(0);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   // Ref-er textual cards-i opacity animation-i hamar
//   const card1Ref = useRef<HTMLDivElement>(null);
//   const card2Ref = useRef<HTMLDivElement>(null);
//   const card3Ref = useRef<HTMLDivElement>(null);
//   const card4Ref = useRef<HTMLDivElement>(null);

//   const { language } = useLanguage();

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       ScrollTrigger.create({
//         trigger: containerRef.current,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 0.8,
//         onUpdate: (self) => {
//           const p = self.progress;
//           scrollProgress.current = p;

//           // Smooth Fade In/Out logic per section
//           if (card1Ref.current) card1Ref.current.style.opacity = `${Math.max(0, 1 - p * 4)}`;
//           if (card2Ref.current) card2Ref.current.style.opacity = `${Math.max(0, 1 - Math.abs(p - 0.33) * 4)}`;
//           if (card3Ref.current) card3Ref.current.style.opacity = `${Math.max(0, 1 - Math.abs(p - 0.66) * 4)}`;
//           if (card4Ref.current) card4Ref.current.style.opacity = `${Math.max(0, (p - 0.75) * 4)}`;
//         },
//       });
//     });
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={containerRef} className="h-[400vh] relative bg-[#fafafa]">
//       {/* Sticky 3D Canvas + Overlay */}
//       <div className="sticky top-0 h-screen w-full overflow-hidden">
        
//         {/* Three.js Canvas */}
//         <Canvas
//           shadows={false}
//           dpr={[1, 1.5]}
//           camera={{ position: [10, 7, 10], fov: 50, near: 0.1, far: 50 }}
//           gl={{
//             antialias: false,
//             alpha: true,
//             powerPreference: "high-performance",
//           }}
//           style={{ background: "linear-gradient(180deg, #FAFAFA 0%, #F0F0F0 100%)" }}
//           frameloop="always"
//         >
//           <Suspense fallback={<LoadingScreen />}>
//             <ambientLight intensity={0.5} />
//             <directionalLight position={[8, 8, 4]} intensity={0.8} color="#FFFFFF" />
//             <pointLight position={[0, 4, 0]} intensity={0.4} color="#00C853" distance={15} />
//             <pointLight position={[-4, 2, -4]} intensity={0.2} color="#5EFC82" distance={12} />
//             <Environment preset="city" />
//             <InfrastructureGroup scrollProgress={scrollProgress} />
//             <CameraController scrollProgress={scrollProgress} />
//             <ContactShadows position={[0, -2, 0]} opacity={0.2} scale={25} blur={1} far={8} />
//             <EffectComposer enabled={true}>
//               <Bloom intensity={0.3} luminanceThreshold={0.9} luminanceSmoothing={0.9} />
//             </EffectComposer>
//           </Suspense>
//         </Canvas>

//         {/* Text Cards Overlays (Controlled by GSAP Scroll) */}
//         <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center container-wide px-6">
          
//           {/* Card 1: Main Hero Title */}
//           <div ref={card1Ref} className="absolute text-center max-w-3xl transition-opacity duration-300">
//             <span className="inline-block py-1 px-3 rounded-full bg-[#00C853]/10 text-[#00C853] text-sm font-semibold tracking-wide uppercase mb-4 border border-[#00C853]/20">
//               Enterprise Infrastructure
//             </span>
//             <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-tight mb-6">
//               Next-Gen Data & IT Ecosystem
//             </h1>
//             <p className="text-zinc-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
//               Empowering global enterprises with ultra-secure cloud networks, scalable data center architectures, and smart automation.
//             </p>
//           </div>

//           {/* Card 2: Data Center Capabilities */}
//           <div ref={card2Ref} className="absolute left-6 md:left-20 max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-zinc-200/80 shadow-xl transition-opacity duration-300 opacity-0">
//             <h2 className="text-2xl font-bold text-zinc-900 mb-3">Modular Data Centers</h2>
//             <p className="text-zinc-600 text-sm leading-relaxed mb-4">
//               Tier IV compliant server architectures delivering maximum redundancy, 99.999% uptime, and zero-latency hardware virtualization.
//             </p>
//             <div className="flex gap-2">
//               <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 rounded-md text-zinc-700">Cloud Storage</span>
//               <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 rounded-md text-zinc-700">Bare Metal</span>
//             </div>
//           </div>

//           {/* Card 3: Network & Security */}
//           <div ref={card3Ref} className="absolute right-6 md:right-20 max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-zinc-200/80 shadow-xl transition-opacity duration-300 opacity-0">
//             <h2 className="text-2xl font-bold text-zinc-900 mb-3">Hyper-Connected Nodes</h2>
//             <p className="text-zinc-600 text-sm leading-relaxed mb-4">
//               Real-time load balancing and encrypted mesh nodes protecting your critical digital assets from cyber threats.
//             </p>
//             <div className="flex gap-2">
//               <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 rounded-md text-zinc-700">256-bit Encryption</span>
//               <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 rounded-md text-zinc-700">AI Defense</span>
//             </div>
//           </div>

//           {/* Card 4: Call To Action */}
//           <div ref={card4Ref} className="absolute text-center max-w-xl bg-white/90 backdrop-blur-lg p-10 rounded-3xl border border-zinc-200 shadow-2xl transition-opacity duration-300 opacity-0 pointer-events-auto">
//             <h2 className="text-3xl font-bold text-zinc-900 mb-4">Ready to Scale Your Infrastructure?</h2>
//             <p className="text-zinc-600 text-base leading-relaxed mb-6">
//               Let's build a customized infrastructure strategy tailored to your company's growth and data needs.
//             </p>
//             <button className="px-8 py-3.5 rounded-xl bg-[#00C853] text-white font-semibold shadow-lg shadow-[#00C853]/30 hover:bg-[#00A843] transition-colors">
//               Get Started Now
//             </button>
//           </div>

//         </div>

//         {/* Ambient Gradients for smooth section transitions */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
//           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRef, useMemo, forwardRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ------- easing + segment helpers -------
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) =>
  out.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));

type ProgressRef = { current: number };

// ------- ONE SERVER BLADE WITH LIGHT EXPLODED INTERNALS -------
function ServerBlade({ progressRef, primary = false }: { progressRef: ProgressRef; primary?: boolean }) {
  const doorRef = useRef<THREE.Group>(null);
  const bladeGroup = useRef<THREE.Group>(null);
  const fansRef = useRef<THREE.Group>(null);

  const parts = useMemo(
    () => ({
      door: { x: 0, y: 0, z: 0.51 },
      fans: [
        { x: -0.35, y: 0.1, z: 0.35, ex: [-0.35, 0.6, 1.0] },
        { x: 0, y: 0.1, z: 0.35, ex: [0, 0.9, 1.2] },
        { x: 0.35, y: 0.1, z: 0.35, ex: [0.35, 0.6, 1.0] },
      ],
      drives: [
        { x: -0.4, y: -0.12, z: 0, ex: [-1.2, -0.12, 0.4] },
        { x: -0.2, y: -0.12, z: 0, ex: [-1.4, -0.12, 0.1] },
        { x: 0.2, y: -0.12, z: 0, ex: [1.4, -0.12, 0.1] },
        { x: 0.4, y: -0.12, z: 0, ex: [1.2, -0.12, 0.4] },
      ],
      ram: [
        { x: -0.25, y: 0.05, z: -0.15, ex: [-0.6, 0.7, -1.1] },
        { x: -0.15, y: 0.05, z: -0.15, ex: [-0.35, 0.9, -1.3] },
        { x: 0.15, y: 0.05, z: -0.15, ex: [0.35, 0.9, -1.3] },
        { x: 0.25, y: 0.05, z: -0.15, ex: [0.6, 0.7, -1.1] },
      ],
      cpu: { x: 0, y: -0.02, z: -0.2, ex: [0, 1.3, -1.4] },
      psu: { x: 0.35, y: 0.15, z: -0.35, ex: [1.6, 0.4, -0.4] },
    }),
    [],
  );

  useFrame((_, dt) => {
    const p = progressRef.current;
    const openP = primary ? easeInOut(seg(p, 0.35, 0.55)) : 0;
    const reP = primary ? easeInOut(seg(p, 0.75, 0.9)) : 0;
    const explode = openP * (1 - reP);

    if (doorRef.current) {
      doorRef.current.rotation.y = -explode * 1.4;
    }
    if (fansRef.current) {
      const spin = (reP + (p > 0.9 ? 1 : 0)) * dt * 8;
      fansRef.current.rotation.z += spin;
    }
  });

  const chassisColor = primary ? "#ffffff" : "#f1f5f9";
  const emissive = primary ? "#00E676" : "#00B0FF";

  return (
    <group>
      {/* Premium Metallic & Frosted Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.35, 1]} />
        <meshStandardMaterial color={chassisColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Glass Front Panel Bezel */}
      <group position={[0, 0, 0.501]}>
        <mesh>
          <planeGeometry args={[1, 0.35]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} transparent opacity={0.8} />
        </mesh>
        {/* Status LEDs */}
        <mesh position={[0.42, 0.12, 0.001]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color={emissive} />
        </mesh>
        <mesh position={[0.36, 0.12, 0.001]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color="#ffb703" />
        </mesh>
      </group>

      {/* Glass Door hinged on left edge */}
      <group ref={doorRef} position={[-0.5, 0, 0.51]}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[1, 0.34, 0.02]} />
          <MeshTransmissionMaterial
            thickness={0.1}
            roughness={0.1}
            transmission={0.9}
            ior={1.2}
            color="#e2e8f0"
          />
        </mesh>
      </group>

      {/* Interior Components (Explodable) */}
      <group ref={bladeGroup}>
        {/* Fans */}
        <group ref={fansRef}>
          {parts.fans.map((f, i) => (
            <ExplodedPart key={"f" + i} base={[f.x, f.y, f.z]} target={f.ex as [number, number, number]} progressRef={progressRef}>
              <mesh castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.09, 0.015, 8, 16]} />
                <meshStandardMaterial color="#00E676" emissive="#00E676" emissiveIntensity={0.5} />
              </mesh>
            </ExplodedPart>
          ))}
        </group>

        {/* Drives */}
        {parts.drives.map((d, i) => (
          <ExplodedPart key={"d" + i} base={[d.x, d.y, d.z]} target={d.ex as [number, number, number]} progressRef={progressRef}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.08, 0.22]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.041, 0]}>
              <planeGeometry args={[0.14, 0.2]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.2} />
            </mesh>
          </ExplodedPart>
        ))}

        {/* RAM sticks */}
        {parts.ram.map((r, i) => (
          <ExplodedPart key={"r" + i} base={[r.x, r.y, r.z]} target={r.ex as [number, number, number]} progressRef={progressRef}>
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.12, 0.4]} />
              <meshStandardMaterial color="#00e676" metalness={0.5} roughness={0.2} emissive="#00e676" emissiveIntensity={0.4} />
            </mesh>
          </ExplodedPart>
        ))}

        {/* CPU + Heatsink */}
        <ExplodedPart base={[parts.cpu.x, parts.cpu.y, parts.cpu.z]} target={parts.cpu.ex as [number, number, number]} progressRef={progressRef}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.04, 0.22]} />
            <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} />
          </mesh>
          <group position={[0, 0.06, 0]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[-0.09 + i * 0.026, 0, 0]}>
                <boxGeometry args={[0.015, 0.08, 0.2]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        </ExplodedPart>

        {/* PSU */}
        <ExplodedPart base={[parts.psu.x, parts.psu.y, parts.psu.z]} target={parts.psu.ex as [number, number, number]} progressRef={progressRef}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.28, 0.22]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        </ExplodedPart>
      </group>
    </group>
  );
}

// ------- EXPLODED PART LEVER -------
const ExplodedPart = forwardRef<THREE.Group, {
  base: [number, number, number];
  target: [number, number, number];
  progressRef: ProgressRef;
  children: React.ReactNode;
}>(function ExplodedPart({ base, target, progressRef, children }, _) {
  const g = useRef<THREE.Group>(null);
  const from = useMemo(() => new THREE.Vector3(...base), [base]);
  const to = useMemo(() => new THREE.Vector3(...target), [target]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = progressRef.current;
    const open = easeInOut(seg(p, 0.35, 0.55));
    const re = easeInOut(seg(p, 0.75, 0.9));
    const t = open * (1 - re);
    if (g.current) {
      lerp3(from, to, t, tmp);
      g.current.position.copy(tmp);
      g.current.rotation.y = t * 0.4;
    }
  });

  return <group ref={g}>{children}</group>;
});

// ------- RACK FRAME (Light Glass & Silver) -------
function Rack({ x, z, progressRef, primary = false }: { x: number; z: number; progressRef: ProgressRef; primary?: boolean }) {
  const blades = 8;
  return (
    <group position={[x, 0, z]}>
      {/* Aluminum / Frosted Frame */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 3.2, 1.1]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
      </mesh>

      {/* Stacked blades */}
      {Array.from({ length: blades }).map((_, i) => {
        const y = 0.2 + i * 0.38;
        const isPrimary = primary && i === 3;
        return (
          <group key={i} position={[0, y, 0]}>
            <ServerBlade progressRef={progressRef} primary={isPrimary} />
          </group>
        );
      })}

      {/* Neon Top Accent Line */}
      <mesh position={[0, 3.15, 0.56]}>
        <planeGeometry args={[1.05, 0.03]} />
        <meshBasicMaterial color="#00E676" />
      </mesh>
    </group>
  );
}

// ------- CORRIDOR OF RACKS -------
function AmbientRacks({ progressRef }: { progressRef: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const rows = 6;
  const spacing = 3.2;

  return (
    <group ref={group}>
      {Array.from({ length: rows }).map((_, i) => {
        const z = -i * spacing - 2;
        return (
          <group key={i}>
            <Rack x={-2.2} z={z} progressRef={progressRef} />
            <Rack x={2.2} z={z} progressRef={progressRef} primary={i === 0} />
          </group>
        );
      })}
    </group>
  );
}

// ------- AMBIENT BLINKING LIGHTS -------
function BlinkingLights() {
  const group = useRef<THREE.Group>(null);
  const lights = useMemo(() => {
    const arr: { pos: [number, number, number]; phase: number; color: string }[] = [];
    for (let r = 0; r < 6; r++) {
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 12; i++) {
          arr.push({
            pos: [side * 1.65, 0.4 + i * 0.24, -r * 3.2 - 2 + 0.56],
            phase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.8 ? "#00E676" : "#00B0FF",
          });
        }
      }
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const phase = lights[i].phase;
      mat.opacity = 0.3 + Math.abs(Math.sin(t * 3 + phase)) * 0.7;
    });
  });

  return (
    <group ref={group}>
      {lights.map((l, i) => (
        <mesh key={i} position={l.pos}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color={l.color} transparent />
        </mesh>
      ))}
    </group>
  );
}

// ------- CAMERA RIG -------
function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const target = useMemo(() => new THREE.Vector3(2.2, 1.6, -2), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const camLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }) => {
    const p = progressRef.current;
    const t = clock.elapsedTime;

    if (p < 0.2) {
      const k = easeInOut(seg(p, 0, 0.2));
      camPos.set(0, 1.7, lerp(8, -1.5, k));
      camLook.set(0, 1.6, lerp(0, -2, k));
    } else if (p < 0.35) {
      const k = easeInOut(seg(p, 0.2, 0.35));
      const angle = lerp(Math.PI, 0, k);
      const radius = 2.6;
      camPos.set(target.x + Math.cos(angle) * radius, 1.9, target.z + Math.sin(angle) * radius);
      camLook.copy(target);
    } else if (p < 0.55) {
      const k = easeInOut(seg(p, 0.35, 0.55));
      camPos.set(target.x + lerp(2.6, 1.9, k), lerp(1.9, 1.7, k), target.z + lerp(0, 1.6, k));
      camLook.copy(target);
    } else if (p < 0.75) {
      const k = seg(p, 0.55, 0.75);
      const a = lerp(0.3, -0.6, easeInOut(k));
      camPos.set(target.x + Math.cos(a) * 1.7, lerp(1.6, 1.9, k), target.z + 1.4 + Math.sin(a) * 0.6);
      camLook.set(target.x, lerp(1.7, 1.6, k), target.z);
    } else if (p < 0.9) {
      const k = easeInOut(seg(p, 0.75, 0.9));
      camPos.set(target.x + lerp(1.2, 1.6, k), 1.75, target.z + lerp(1.5, 1.4, k));
      camLook.copy(target);
    } else {
      const k = easeInOut(seg(p, 0.9, 1));
      camPos.set(lerp(target.x + 1.6, 0, k), lerp(1.75, 2.6, k), lerp(target.z + 1.4, 6, k));
      camLook.set(lerp(target.x, 0, k), 1.6, lerp(target.z, -3, k));
    }

    camPos.x += Math.sin(t * 0.6) * 0.03;
    camPos.y += Math.cos(t * 0.5) * 0.02;

    camera.position.copy(camPos);
    camera.lookAt(camLook);
  });
  return null;
}

// ------- MAIN LIGHT SCENE CONTAINER -------
export function Scene({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.7, 8], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      {/* Light Clean Tech Background */}
      <color attach="background" args={["#f8fafc"]} />
      <fog attach="fog" args={["#f8fafc", 8, 25]} />

      {/* Bright Studio Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow color="#ffffff" />
      <hemisphereLight args={["#ffffff", "#e2e8f0", 0.8]} />

      {/* Modern High-End Overhead Lighting */}
      {Array.from({ length: 6 }).map((_, i) => (
        <spotLight
          key={i}
          position={[0, 3.8, -i * 3.2]}
          angle={0.8}
          penumbra={0.5}
          intensity={80}
          distance={8}
          color="#ffffff"
          castShadow={i < 2}
        />
      ))}

      {/* Dynamic Emerald & Cyan Accent Lights */}
      <pointLight position={[2.2, 1.6, -1.5]} intensity={3} color="#00E676" distance={5} />
      <pointLight position={[-2.2, 1.6, -1.5]} intensity={2} color="#00B0FF" distance={5} />

      {/* Polished Light Ceramic Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]} receiveShadow>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.3} roughness={0.15} />
      </mesh>

      {/* Clean White Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, -6]}>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} />
      </mesh>

      <Suspense fallback={null}>
        <AmbientRacks progressRef={progressRef} />
        <BlinkingLights />

        {/* Soft Contact Shadows */}
        <ContactShadows position={[0, 0.01, -6]} opacity={0.3} scale={35} blur={2} far={6} color="#0f172a" />

        {/* Clean Bright Studio Reflections */}
        <Environment preset="city" environmentIntensity={0.6} />

        <CameraRig progressRef={progressRef} />

        {/* Soft Visual Bloom Effects */}
        <EffectComposer enabled>
          <Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
          <Vignette eskil={false} offset={0.05} darkness={0.15} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}