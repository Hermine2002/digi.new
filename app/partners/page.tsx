import type { Metadata } from "next";
import { ClientsExperience } from "@/components/partners/ClientsExperience";
import { PartnersHero } from "@/components/partners/PartnersHero";

export const metadata: Metadata = {
  title: "Partnerships Built on Trust | DigiBase",
  description:
    "DigiBase ensures the technological reliability of Armenia’s leading companies and government institutions.",
};

export default function PartnersPage() {
  return (
    <main className="bg-white text-black">
      {/* HERO SECTION */}
      <PartnersHero />

      {/* CLIENTS — 3D scroll orbit */}
      <ClientsExperience />
    </main>
  );
}