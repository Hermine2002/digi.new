"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const navLinksConfig = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "partnership", href: "/vendors" },
  { key: "customers", href: "/partners" },
  { key: "contact", href: "/contact" },
] as const;

const languages = [
  { code: "hy", label: "Հայ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-[#00c050]/20"
          : "bg-black"
      )}
    >
      <div className="section-padding">
        <div className="container-wide">
          <nav className="flex h-20 items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <div className="relative h-20 w-36">
                <Image
                  src="/images/download (2).png"
                  alt="DigiBase"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinksConfig.map((link) => {
                const active = pathname === link.href;
                const label = t.nav[link.key][language];

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group relative text-sm font-medium transition-colors",
                      active
                        ? "text-[#00c050]"
                        : "text-white hover:text-[#00c050]"
                    )}
                  >
                    {label}

                    <span
                      className={cn(
                        "absolute -bottom-2 left-0 h-0.5 bg-[#00c050] transition-all duration-300",
                        active ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex items-center gap-4">
              {/* LANGUAGE SWITCHER */}
              <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLanguage(item.code)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      language === item.code
                        ? "bg-white text-black shadow-sm"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* CTA BUTTON */}
              <Link href="/contact">
                <Button
                  size="sm"
                  className="bg-[#00c050] hover:bg-[#00a042] text-white font-medium"
                >
                  {t.nav.getInTouch[language]}
                </Button>
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-white hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 right-0 overflow-hidden bg-black/95 backdrop-blur-2xl transition-all duration-300 ease-in-out border-b border-white/10",
          isMobileMenuOpen ? "max-h-[600px] border-t" : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-5 p-6">
          {navLinksConfig.map((link) => {
            const active = pathname === link.href;
            const label = t.nav[link.key][language];

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors",
                  active ? "text-[#00c050]" : "text-white hover:text-[#00c050]"
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="border-t border-white/20 pt-5 flex items-center justify-between">
            {/* MOBILE LANGUAGE SWITCHER */}
            <div className="flex gap-2">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold transition",
                    language === item.code
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full bg-[#00c050] hover:bg-[#00a042] text-white mt-2">
              {t.nav.getInTouch[language]}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}