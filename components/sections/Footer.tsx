"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Linkedin, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const footerLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "partnership", href: "/vendors" },
  { key: "customers", href: "/partners" },
  { key: "contact", href: "/contact" },
];

export function Footer() {
  const { language, t } = useLanguage();
  const f = (t.footer || {}) as Record<string, Record<string, string> | undefined>;
  const nav = (t.nav || {}) as Record<string, Record<string, string> | undefined>;

  return (
    <footer className="relative bg-zinc-950 text-white border-t border-zinc-800/80 overflow-hidden">
      {/* Decorative ambient background glowing elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00c050]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-padding py-16 lg:py-24 relative z-10">
        <div className="container-wide">
          
          {/* Top Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-zinc-800/80 items-start">
            
            {/* Brand & Socials (Span 5 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-block mb-6 group">
                  <div className="relative h-16 w-36 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src="/images/download (2).png"
                      alt="DigiBase"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md mb-8">
                  {f.description?.[language] || "DIGIBASE delivers enterprise technology solutions, state-of-the-art infrastructure, and certified partnerships."}
                </p>
              </div>

              {/* Social & Contact Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center hover:bg-[#00c050]/10 hover:border-[#00c050]/40 transition-all text-zinc-300 hover:text-[#00c050] group shadow-sm"
                >
                  <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="mailto:info@digibase.am"
                  aria-label="Email"
                  className="w-11 h-11 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center hover:bg-[#00c050]/10 hover:border-[#00c050]/40 transition-all text-zinc-300 hover:text-[#00c050] group shadow-sm"
                >
                  <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>

            {/* Navigation Links Column (Span 3 columns) */}
            <div className="lg:col-span-3">
              <h3 className="font-medium text-xs tracking-widest text-zinc-300 uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c050]"></span>
                {language === "hy" ? "Արագ Նավարկություն" : language === "ru" ? "Быстрая навигация" : "Quick Navigation"}
              </h3>
              <ul className="space-y-3.5">
                {footerLinks.map((link) => {
                  const label = nav[link.key]?.[language] || link.key;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1.5 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-[#00c050]" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Gorgeous Accent Card / Call to Action (Span 4 columns) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 relative overflow-hidden group shadow-xl">
              {/* Subtle card glow */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#00c050]/10 rounded-full blur-2xl group-hover:bg-[#00c050]/20 transition-all" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00c050]/10 border border-[#00c050]/20 text-[#00c050] text-xs font-medium mb-4">
                  <Sparkles className="w-3 h-3" />
                  {language === "hy" ? "Պատրաստ ենք համագործակցության" : language === "ru" ? "Готовы к сотрудничеству" : "Let's work together"}
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">
                  {language === "hy" ? "Ունե՞ք հարցեր կամ նախագիծ" : language === "ru" ? "Есть вопросы или проект?" : "Have a project in mind?"}
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  {language === "hy" 
                    ? "Կապվեք մեզ հետ այսօր և ստացեք մասնագիտական լուծումներ ձեր բիզնեսի համար։"
                    : language === "ru" 
                    ? "Свяжитесь с нами сегодня и получите профессиональные решения для вашего бизнеса."
                    : "Get in touch with our experts to power up your digital transformation."}
                </p>
                <Link href="/contact">
                  <Button className="w-full bg-[#00c050] hover:bg-[#00a042] text-white font-medium text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-[#00c050]/10">
                    {nav.getInTouch?.[language] || "Get in Touch"}
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>
             {new Date().getFullYear()} DigiBase. {f.copyright?.[language] || "All rights reserved."}

             
            </p>
             
            <div className="flex flex-wrap gap-6">
             
              <Link href="/compliance" className="hover:text-zinc-300 transition-colors">
                {f.compliance?.[language] || "Compliance Statement"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}