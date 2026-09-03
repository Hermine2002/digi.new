import type { Metadata } from "next";
import { PartnershipIntro } from "@/components/venders/PartnershipIntro";
import { VendorsExperienceLoader } from "@/components/venders/VendorsExperienceLoader";

export const metadata: Metadata = {
  title: "Vendors | DigiBase",
  description: "Certified vendor partnerships: Oracle, Huawei, Cisco, Microsoft, Dell, VMware, Nvidia and more.",
};

export default function VendorsPage() {
  return (
    <main>
      <PartnershipIntro />
      <VendorsExperienceLoader />
    </main>
  );
}