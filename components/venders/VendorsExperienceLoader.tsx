"use client";

import dynamic from "next/dynamic";

const VendorsExperience = dynamic(() => import("./VendorsExperience"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] to-[#F0F0F0]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-digibase-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-digibase-gray-500">Loading 3D Experience...</p>
      </div>
    </div>
  ),
});

export function VendorsExperienceLoader() {
  return <VendorsExperience />;
}