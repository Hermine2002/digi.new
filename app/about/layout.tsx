import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | DigiBase",
  description:
    "DIGIBASE is Armenia's enterprise technology partner. Meet the team engineering the country's digital backbone.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}