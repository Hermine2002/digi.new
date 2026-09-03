import type { Metadata } from "next";
// Suppress TS error for side-effect CSS import when no CSS module declarations exist
// @ts-ignore
import "../styles/globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "DigiBase - Enterprise IT Infrastructure Solutions",
  description:
    "Leading IT infrastructure solutions provider in Armenia. Data centers, cloud solutions, and enterprise security systems.",
  keywords: [
    "IT infrastructure",
    "data center",
    "cloud solutions",
    "security systems",
    "Armenia",
  ],
  authors: [{ name: "DigiBase" }],

  icons: {
    icon: "/Opt.5.svg",
    shortcut: "/Opt.5.svg",
    apple: "/Opt.5.svg",
  },

  openGraph: {
    title: "DigiBase - Enterprise IT Infrastructure Solutions",
    description: "Building the digital foundation of tomorrow",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}