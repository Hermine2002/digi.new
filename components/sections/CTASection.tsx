"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { BlurReveal } from "@/components/ui/TextReveal";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const cta = t.cta;

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0.8 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-black">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c050]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00c050]/5 rounded-full blur-3xl" />

      <div className="relative z-10 section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <BlurReveal>
                <span className="text-sm font-semibold text-[#00c050] tracking-widest uppercase mb-4 block">
                  {cta.badge[language]}
                </span>
              </BlurReveal>
              <h2 className="text-display-md font-bold text-white mb-6 text-balance">
                {cta.title[language]}
              </h2>
              <BlurReveal delay={0.2}>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  {cta.description[language]}
                </p>
              </BlurReveal>
              <BlurReveal delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="group bg-[#00c050] hover:bg-[#00a042] text-white">
                    {cta.primaryBtn[language]}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    {cta.secondaryBtn[language]}
                  </Button>
                </div>
              </BlurReveal>
            </div>

            <div className="space-y-6">
              <BlurReveal delay={0.3}>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00c050]/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#00c050]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {cta.contact.emailTitle[language]}
                    </h3>
                    <p className="text-zinc-400 text-sm">info@digibase.am</p>
                  </div>
                </div>
              </BlurReveal>

              <BlurReveal delay={0.4}>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00c050]/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#00c050]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {cta.contact.phoneTitle[language]}
                    </h3>
                    <p className="text-zinc-400 text-sm">+374 12 488888</p>
                  </div>
                </div>
              </BlurReveal>

              <BlurReveal delay={0.5}>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00c050]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#00c050]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {cta.contact.addressTitle[language]}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {cta.contact.address[language]}
                    </p>
                  </div>
                </div>
              </BlurReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}