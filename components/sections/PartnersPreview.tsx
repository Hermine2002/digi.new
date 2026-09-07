"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BlurReveal } from "@/components/ui/TextReveal";
import { useLanguage } from "@/context/LanguageContext";
import { partners } from "@/data/partners"; // <-- expects [{ name, logo }]
import { LODField } from "../3d/Lodfield ";

const AUTOPLAY_INTERVAL = 2800;
const CARD_WIDTH = 150; // px, logo card width (aspect-square)

// ================= TILTED LOGO CAROUSEL (codepen: vii120/VYmmdMK) =================
function PartnerLogosTilted() {
  const { language, t } = useLanguage();
  const pe = t.partnersExperience;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const toPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? partners.length - 1 : prev - 1));
  }, []);

  const toNext = useCallback(() => {
    setActiveIndex((prev) => (prev === partners.length - 1 ? 0 : prev + 1));
  }, []);

  const toSlide = (index: number) => setActiveIndex(index);

  // Autoplay, loops, pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(toNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused, toNext]);

  return (
    <div
      className="flex flex-col items-center gap-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category badges */}
      <div className="flex items-center gap-2">
        {/* <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-[#00c050]/10 text-[#00c050]">
          {pe?.strategicPartners?.[language] || "Strategic partners"}
        </span>
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-500">
          {pe?.technologyAlliances?.[language] || "Technology alliances"}
        </span> */}
      </div>

      {/* Tilted carousel */}
      <div style={{ width: CARD_WIDTH }} className="mt-2">
        <motion.div
          className="flex w-fit"
          animate={{ x: `${(-activeIndex * 100) / partners.length}%` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
        >
          {partners.map((partner, i) => {
            const isActive = activeIndex === i;

            return (
              <div className="perspective-midrange" key={partner.name}>
                <motion.div
                  style={{ width: CARD_WIDTH }}
                  className="aspect-square flex flex-col items-center gap-2 will-change-transform"
                  animate={{ rotateY: (activeIndex - i) * 60, scale: isActive ? 1 : 0.85 }}
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                >
                  <div
                    onClick={() => toSlide(i)}
                    className="w-full h-full rounded-2xl bg-white border border-zinc-200/80 shadow-lg flex items-center justify-center p-6 cursor-pointer"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-[75%] max-w-[75%] object-contain"
                    />
                  </div>

                  <motion.div
                    className="text-xs md:text-sm font-medium text-zinc-700 whitespace-nowrap will-change-[opacity,filter]"
                    animate={{
                      filter: isActive ? "blur(0px)" : "blur(2px)",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {partner.name}
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Below the stack: description, controls */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {/* <p className="max-w-[320px] text-center text-xs leading-5 text-zinc-400">
          {pe?.description?.[language] ||
            "Global vendors supporting enterprise infrastructure, cloud, security and data center solutions."}
        </p> */}

        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200/80">
          <button
            onClick={toPrev}
            className="p-1.5 rounded-full text-zinc-500 hover:text-[#00c050] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5">
            {partners.map((_, i) => (
              <button
                key={i}
                onClick={() => toSlide(i)}
                className={`rounded-full h-1.5 transition-all duration-300 ${
                  activeIndex === i ? "w-5 bg-[#00c050]" : "w-1.5 bg-zinc-300"
                }`}
                aria-label={`Go to partner ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={toNext}
            className="p-1.5 rounded-full text-zinc-500 hover:text-[#00c050] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================
// export function PartnersPreview() {
//   return (
//     <section className="relative overflow-hidden py-28 md:py-36 bg-white p-10">
//       <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />
//       <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#00c050]/10 blur-[120px]" />

//       <div className="container-x">
//         {/* Տեքստային հատված - վերևում, ամբողջ լայնությամբ */}
//         <BlurReveal>
//           <div className="max-w-2xl mx-auto text-center">
//             <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
//               Partnership
//             </span>

//             <h2 className="mt-5 text-4xl font-bold tracking-tight text-black md:text-6xl">
//               Our <span className="text-[#00c050]">Partners</span>
//             </h2>

//             <p className="mt-7 text-lg leading-8 text-zinc-600">
//               We partner with global IT leaders to deliver secure, cutting-edge
//               solutions for your business.
//             </p>
//           </div>
//         </BlurReveal>

//         {/* Logo-ների tilted carousel - ներքևի հատված, կենտրոնացված */}
//         <div className="mt-16 md:mt-20 flex justify-center">
//           <PartnerLogosTilted />
//         </div>
//       </div>
//     </section>
//   );
// }
export function PartnersPreview() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden py-28 md:py-36 bg-white p-10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#00c050]/10 blur-[120px]" />
    <LODField/>
      <div className="container-x">
        {/* Տեքստային հատված - վերևում, ամբողջ լայնությամբ */}
        <BlurReveal>
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
              {language === "hy"
                ? "Գործընկերություն"
                : language === "ru"
                ? "Партнёрство"
                : "Partnership"}
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {language === "hy" ? (
                <>
                  Մեր <span className="text-[#00c050]">գործընկերները</span>
                </>
              ) : language === "ru" ? (
                <>
                  Наши <span className="text-[#00c050]">партнёры</span>
                </>
              ) : (
                <>
                  Our <span className="text-[#00c050]">Partners</span>
                </>
              )}
            </h2>

            <p className="mt-7 text-lg leading-8 text-zinc-600">
              {language === "hy"
                ? "Մենք համագործակցում ենք համաշխարհային IT առաջատարների հետ՝ ձեր բիզնեսի համար ապահովելով անվտանգ և ժամանակակից լուծումներ։"
                : language === "ru"
                ? "Мы сотрудничаем с мировыми IT-лидерами, чтобы предоставлять безопасные и передовые решения для вашего бизнеса."
                : "We partner with global IT leaders to deliver secure, cutting-edge solutions for your business."}
            </p>
          </div>
        </BlurReveal>

        {/* Logo-ների tilted carousel - ներքևի հատված, կենտրոնացված */}
        <div className="mt-16 md:mt-20 flex justify-center">
          <PartnerLogosTilted />
        </div>
      </div>
    </section>
  );
}