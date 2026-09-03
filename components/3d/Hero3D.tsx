// "use client";

// import { Canvas, useFrame } from "@react-three/fiber";
// import {
//   OrbitControls,
//   useGLTF,
//   Center,
//   Environment,
//   ContactShadows,
// } from "@react-three/drei";

// import { Suspense, useRef } from "react";
// import * as THREE from "three";


// function DataCenterModel() {
//   const group = useRef<THREE.Group>(null);

//   const { scene } = useGLTF("/models/security_camera.glb");


//   scene.traverse((child:any)=>{

//     if(child.isMesh){

//       child.material.transparent = false;
//       child.material.opacity = 1;

//     }

//   });


//   useFrame((state)=>{

//     if(!group.current) return;

//     group.current.rotation.y =
//       Math.sin(state.clock.elapsedTime * 0.3) * 0.08;

//   });


//   return (
//     <group ref={group}>

//       <Center>

//         <primitive
//           object={scene}
//           scale={1}
//         />

//       </Center>

//     </group>
//   );
// }



// function LoaderFallback(){

// return (

// <mesh>

// <sphereGeometry args={[0.5,32,32]} />

// <meshStandardMaterial
// color="#0b6b50"
// />

// </mesh>

// )

// }



// export default function Hero3D(){


// return (

// <div
// style={{
//  width:"100%",
//  height:"100%",
//  position:"absolute",
//  inset:0
// }}
// >


// <Canvas

// camera={{
//   position:[0,-1,8],
//   fov:90
// }}

// dpr={[1,2]}

// >


// <ambientLight intensity={1}/>


// <directionalLight
// position={[5,5,5]}
// intensity={2}
// />


// <Suspense fallback={<LoaderFallback/>}>


// <DataCenterModel />


// <Environment preset="city"/>


// <ContactShadows

// position={[0,-1.5,0]}

// opacity={0.45}

// scale={10}

// blur={2}

// />


// </Suspense>



// <OrbitControls

// enableZoom={false}

// enablePan={false}

// autoRotate

// autoRotateSpeed={2}

// minPolarAngle={Math.PI/3}

// maxPolarAngle={Math.PI/2}

// />



// </Canvas>


// </div>

// )

// }



// useGLTF.preload("/models/security_camera.glb");