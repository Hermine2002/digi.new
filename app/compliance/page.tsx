"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CompliancePage() {
  const { language, t } = useLanguage();
  const cp = t.compliancePage || {};

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="container-x max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            {cp.mainTitle?.[language] || "Compliance Statement"}
          </h1>
          <p className="text-zinc-500">{cp.mainSubtitle?.[language] || "Համապատասխանության հայտարարություն"}</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-10 text-zinc-700">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900">{cp.sectionTitle?.[language]}</h2>
            <p className="mb-4 leading-relaxed">{cp.paragraph1?.[language]}</p>
            <p className="mb-4 leading-relaxed">{cp.paragraph2?.[language]}</p>
            <p className="leading-relaxed">{cp.paragraph3?.[language]}</p>
          </div>
        </div>
      </div>
    </main>
  );
}