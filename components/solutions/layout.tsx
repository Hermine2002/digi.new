import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions | DigiBase",
  description:
    "Detailed case studies: Oracle solutions, modular data centers, active-active banking, and national security systems.",
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}