"use client";

import { useLanguage } from "@/context/LanguageContext";
// import { FloatingParticles } from "../3d/FloatingParticles";

export function PartnersHero() {
  const { language, t } = useLanguage();
  const pp = t.partners;

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      {/* Three.js Ինտերակտիվ Պարտիկների և 3D օբյեկտի ֆոնային բաղադրիչը */}
      {/* <FloatingParticles className="absolute inset-0 z-10 pointer-events-auto" /> */}

      {/* Բովանդակություն (Content) - pl-6 md:pl-16-ով մի փոքր տեղաշարժված է դեպի աջ */}
      <div className="relative z-20 container-x py-24 md:py-32 p-4">
        <div className="max-w-4xl pl-6 md:pl-16 text-left">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-medium">
              {pp.eyebrow[language]}
            </span>
          </div>

          <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-zinc-900">
            {pp.title[language]}{" "}
            <span className="text-[#00c050]">
              {pp.trust[language]}
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg leading-relaxed text-zinc-900 font-semibold">
            {pp.description1[language]}
          </p>

          {/* <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-800 font-medium">
            {pp.description2[language]}
          </p>

          <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-800 font-medium">
            {pp.description3[language]}
          </p> */}

          <div className="mt-8 h-px w-24 bg-gradient-to-r from-emerald-400/40 to-transparent" />

        </div>
      </div>
    </section>
  );
}