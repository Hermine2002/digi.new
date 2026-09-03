
"use client";

import dynamic from "next/dynamic";
import { useLenis } from "@/hooks/useLenis";

import { HeroSection } from "@/components/sections/HeroSection";
import { SolutionsPreview } from "@/components/sections/SolutionsPreview";
import { VendorsPreview } from "@/components/sections/VendorsPreview";
import { PartnersPreview } from "@/components/sections/PartnersPreview";


// Lazy load heavy 3D scene
// const InfrastructureScene = dynamic(
//   () => import("@/components/three/InteractiveDataCenterScene").then((mod) => mod.Scene),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="h-[400vh] relative">
//         <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] to-[#F0F0F0]">
//           <div className="text-center">
//             <div className="w-12 h-12 border-2 border-digibase-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-sm text-digibase-gray-500">Loading 3D Experience...</p>
//           </div>
//         </div>
//       </div>
//     ),
//   }
// );

export default function Home() {
  useLenis();

  return (
    <main className="relative">
      <HeroSection />
      
      {/* 3D Scene Component */}
      {/* <InfrastructureScene progressRef={{
        current: 0
      }} /> */}

      {/* <SolutionsPreview /> */}

      <VendorsPreview />
      <PartnersPreview />

    </main>
  );
}
