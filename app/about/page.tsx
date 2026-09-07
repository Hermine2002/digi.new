"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Member, team } from "@/data/team";
import { AboutBackdrop3DLoader } from "@/components/about/AboutBackdrop3DLoader";
import { AboutSectionReveal } from "@/components/about/AboutSectionReveal";
import { useLanguage } from "@/context/LanguageContext";
import { HeroScene } from "@/components/3d/HeroScen";
import { MemberCard } from "@/components/about/MemberCard";

const sectionTitles = {
  leaders: {
    hy: "Թիմի առաջնորդները",
    en: "Team Leaders / Key Leadership",
    ru: "Лидеры команды",
  },
  team: {
    hy: "Մեր թիմի անդամները",
    en: "Our Experts / Meet the Team",
    ru: "Наша команда / Наши специалисты",
  },
};

export default function AboutPage() {
  const activeIndexRef = useRef(0);
  const { language, t } = useLanguage();
  const ab = t.about;

  useEffect(() => {
    AboutBackdrop3DLoader({
      containerId: "about-scroll-container",
      activeIndexRef,
    });
  }, []);

  const leaders = team.filter((m) => m.isLeadership);
  const staff = team.filter((m) => !m.isLeadership);

  return (
    <div id="about-scroll-container" className="relative bg-white pl-20 pr-20">
      {/* 3D Background */}
      <HeroScene />
      <div className="absolute inset-0 z-0 pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-white/40 pointer-events-none" />

      <div className="relative z-10">
        {/* ==================== HERO ==================== */}
        <AboutSectionReveal index={0} activeIndexRef={activeIndexRef}>
        
          <section className="relative border-b border-border overflow-hidden min-h-[500px]">
                <HeroScene />
            <div className="relative z-10 container-x py-24 md:py-32 bg-white/80 backdrop-blur-sm w-full rounded-3xl border border-border shadow-2xl">
             <HeroScene />
              <div className="max-w-4xl pl-6 md:pl-16 text-left">
                 <HeroScene />
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00c050]/20 bg-[#00c050]/10 px-4 py-1.5 backdrop-blur-md">
                 <HeroScene />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00c050] animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#00c050] font-medium">
                    {ab.aboutUs[language]}
                  </span>
                </div>

                <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-6xl leading-[1.05] text-zinc-900">
                  {ab.heroTitle[language]}
                </h1>

                <p className="mt-8 text-lg font-bold text-[#00c050]">
                  {ab.heroSubtitle1[language]}
                </p>

                <div className="mt-10 h-px w-24 bg-gradient-to-r from-[#00c050]/20 to-transparent" />
              </div>
            </div>
          </section>
        </AboutSectionReveal>

        {/* ==================== TEAM ==================== */}
        <AboutSectionReveal index={3} activeIndexRef={activeIndexRef}>
          <section className="py-24">
             <HeroScene />
            <div className="container-x">
               <HeroScene />
              {/* TOP BLOCK */}
              <div className="grid gap-12 md:grid-cols-2 items-center mb-20">
                <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-xl">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                    {ab.aboutUs[language]}
                  </span>

                  {/* ===== Team Experience (bullets) ===== */}
                  <div className="mt-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-6">
                      {ab.teamTitle?.[language] ||
                        (language === "hy"
                          ? "ՄԵՐ ԹԻՄԻ ՓՈՐՁԸ"
                          : language === "ru"
                          ? "Опыт нашей команды"
                          : "OUR TEAM’S EXPERIENCE")}
                    </h2>

                    <p className="text-lg text-zinc-700 leading-relaxed mb-10">
                      {language === "hy"
                        ? "Մեր թիմի ուժեղ կողմը մասնագիտական բարձր որակավորումը, արագ աճն ու շարունակական զարգացումն են։"
                        : language === "ru"
                        ? "Сила нашей команды — в высокой профессиональной квалификации, быстром росте и непрерывном развитии."
                        : "The strength of our team lies in high professional qualifications, rapid growth and continuous development."}
                    </p>

                    {/* Ոլորտներ */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                        {language === "hy"
                          ? "Ոլորտներ, որտեղ ունենք խորը փորձ․"
                          : language === "ru"
                          ? "Отрасли, в которых у нас есть глубокий опыт:"
                          : "Industries where we have deep expertise:"}
                      </h3>
                      <ul className="space-y-2.5">
                        {(language === "hy"
                          ? [
                              "Բանկեր և ֆինանսներ",
                              "Մանրածախ առևտուր",
                              "Տեղեկատվական տեխնոլոգիաներ",
                              "Պետական կառույցներ",
                            ]
                          : language === "ru"
                          ? [
                              "Банки и финансы",
                              "Розничная торговля",
                              "Информационные технологии",
                              "Государственный сектор",
                            ]
                          : [
                              "Banking & Finance",
                              "Retail",
                              "Information Technology",
                              "Government sector",
                            ]
                        ).map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-zinc-700"
                          >
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00c050] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Առավելություններ */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 mb-5">
                        {language === "hy"
                          ? "Մեր հիմնական առավելությունները․"
                          : language === "ru"
                          ? "Наши ключевые преимущества:"
                          : "Our key advantages:"}
                      </h3>
                      <ul className="space-y-5">
                        {(language === "hy"
                          ? [
                              {
                                title: "Գործընթացների խորը ընկալում",
                                text: "Գիտենք՝ ինչպես են աշխատում բիզնես պրոցեսները և ինչպես դրանք դարձնել ավելի արդյունավետ։",
                              },
                              {
                                title: "Շուկայի խորացված իմացություն",
                                text: "Գերազանց ճանաչում ենք ԱՊՀ շուկան և ճիշտ կառավարում հաճախորդների հետ հարաբերությունները։",
                              },
                              {
                                title: "Ամուր գործընկերություն",
                                text: "Կարողանում ենք գտնել ճիշտ լուծումներ և կառուցել երկարատև, հուսալի կապեր։",
                              },
                            ]
                          : language === "ru"
                          ? [
                              {
                                title: "Глубокое понимание процессов",
                                text: "Мы знаем, как работают бизнес-процессы и как сделать их более эффективными.",
                              },
                              {
                                title: "Углублённое знание рынка",
                                text: "Отлично знаем рынок СНГ и правильно выстраиваем отношения с клиентами.",
                              },
                              {
                                title: "Надёжное партнёрство",
                                text: "Умеем находить правильные решения и строить долгосрочные, надёжные связи.",
                              },
                            ]
                          : [
                              {
                                title: "Deep process understanding",
                                text: "We know how business processes work and how to make them more efficient.",
                              },
                              {
                                title: "Deep market knowledge",
                                text: "We have excellent knowledge of the CIS market and manage client relationships correctly.",
                              },
                              {
                                title: "Strong partnerships",
                                text: "We find the right solutions and build long-term, reliable relationships.",
                              },
                            ]
                        ).map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[#00c050] shrink-0" />
                            <div>
                              <span className="font-semibold text-zinc-900">
                                {item.title}
                              </span>
                              <span className="text-zinc-600"> — {item.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-3xl border border-border bg-white shadow-2xl overflow-hidden">
                  <Image
                    src="/images/IMGL0074.jpg"
                    alt="The DigiBase team"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* LEADERSHIP + STAFF */}
              <div className="space-y-20">
                {/* Leaders */}
                <div>
                  <div className="mb-8 border-b border-zinc-200 pb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#00c050]" />
                      {sectionTitles.leaders[language]}
                    </h3>
                  </div>

                  <div className="grid gap-10 sm:grid-cols-3 max-w-5xl mx-auto [&>:hover]:z-50 relative">
                    {leaders.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        language={language}
                        isLeader
                      />
                    ))}
                  </div>
                </div>

                {/* Staff */}
                <div>
                  <div className="mb-8 border-b border-zinc-200 pb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                      {sectionTitles.team[language]}
                    </h3>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {staff.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AboutSectionReveal>

        {/* ==================== SERVICES ==================== */}
        <AboutSectionReveal index={4} activeIndexRef={activeIndexRef}>
          <section className="border-b border-border py-20 md:py-28">
            <div className="container-x">
              <div className="mb-14 md:mb-20">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
                  {language === "hy"
                    ? "Ծառայություններ"
                    : language === "ru"
                    ? "Услуги"
                    : "Services"}
                </h2>
                <div className="mt-3 h-1 w-16 bg-[#00c050] rounded-full" />
              </div>

              <div className="grid gap-7 md:grid-cols-3">
                {/* Card 1 */}
                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 backdrop-blur-md px-9 py-10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-[#00c050]/[0.03] to-transparent" />
                  <div className="relative">
                    <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors duration-300 group-hover:bg-[#00c050]/15">
                      <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M12 2l3 3-3 3-3-3 3-3zM5 9l3 3-3 3-3-3 3-3zM19 9l3 3-3 3-3-3 3-3zM12 16l3 3-3 3-3-3 3-3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 leading-snug tracking-tight">
                      {language === "hy"
                        ? "Նախագծում & Խորհրդատվություն"
                        : language === "ru"
                        ? "Проектирование & Консалтинг"
                        : "Design & Consulting"}
                    </h3>
                    <ul className="mt-7 space-y-4">
                      {(language === "hy"
                        ? [
                            "ՏՏ համակարգերի վիճակի գնահատում",
                            "Հարմարեցված տեխնիկական լուծումներ",
                            "Ամբողջական փաստաթղթավորում",
                          ]
                        : language === "ru"
                        ? [
                            "Оценка состояния ИТ-систем",
                            "Адаптированные технические решения",
                            "Полная техническая документация",
                          ]
                        : [
                            "IT systems assessment",
                            "Tailored technical solutions",
                            "Complete documentation",
                          ]
                      ).map((item, i) => (
                        <li key={i} className="flex items-start gap-3.5 text-zinc-600">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00c050]/12 text-[#00c050] transition-colors duration-300 group-hover:bg-[#00c050]/20">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-[15px] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 backdrop-blur-md px-9 py-10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-[#00c050]/[0.03] to-transparent" />
                  <div className="relative">
                    <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors duration-300 group-hover:bg-[#00c050]/15">
                      <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <rect x="2" y="3" width="20" height="6" rx="1" />
                        <rect x="2" y="15" width="20" height="6" rx="1" />
                        <path d="M6 6h.01M6 18h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 leading-snug tracking-tight">
                      {language === "hy"
                        ? "Ներդրում & Ֆինանսավորում"
                        : language === "ru"
                        ? "Внедрение & Финансирование"
                        : "Implementation & Financing"}
                    </h3>
                    <ul className="mt-7 space-y-4">
                      {(language === "hy"
                        ? [
                            "Իրականացում «սկզբից մինչև վերջ»",
                            "Վճարման ճկուն պայմաններ",
                            "Միջազգային ֆինանսավորում",
                          ]
                        : language === "ru"
                        ? [
                            "Реализация «от начала до конца»",
                            "Гибкие условия оплаты",
                            "Международное финансирование",
                          ]
                        : [
                            "End-to-end project delivery",
                            "Flexible payment terms",
                            "International financing",
                          ]
                      ).map((item, i) => (
                        <li key={i} className="flex items-start gap-3.5 text-zinc-600">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00c050]/12 text-[#00c050] transition-colors duration-300 group-hover:bg-[#00c050]/20">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-[15px] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 backdrop-blur-md px-9 py-10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-[#00c050]/[0.03] to-transparent" />
                  <div className="relative">
                    <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors duration-300 group-hover:bg-[#00c050]/15">
                      <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 leading-snug tracking-tight">
                      {language === "hy"
                        ? "Հետվաճառքային Սպասարկում"
                        : language === "ru"
                        ? "Послепродажное обслуживание"
                        : "After-Sales Support"}
                    </h3>
                    <ul className="mt-7 space-y-4">
                      {(language === "hy"
                        ? [
                            "Տեխ. սպասարկում և երաշխիք",
                            "Պահեստամասերի արագ մատակարարում",
                            "24/7 շուրջօրյա աջակցություն",
                          ]
                        : language === "ru"
                        ? [
                            "Тех. обслуживание и гарантия",
                            "Быстрая поставка запчастей",
                            "Круглосуточная поддержка 24/7",
                          ]
                        : [
                            "Technical maintenance & warranty",
                            "Fast spare parts supply",
                            "24/7 round-the-clock support",
                          ]
                      ).map((item, i) => (
                        <li key={i} className="flex items-start gap-3.5 text-zinc-600">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00c050]/12 text-[#00c050] transition-colors duration-300 group-hover:bg-[#00c050]/20">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-[15px] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AboutSectionReveal>

        {/* ==================== WHO WE ARE ==================== */}
        <AboutSectionReveal index={1} activeIndexRef={activeIndexRef}>
          <section className="border-b border-border py-40 md:py-24">
             <HeroScene />
            <div className="container-x">
              <div className="mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
                  {language === "hy"
                    ? "Ով ենք Մենք"
                    : language === "ru"
                    ? "Кто мы"
                    : "Who We Are"}
                </h2>
                <div className="mt-3 h-1 w-16 bg-[#00c050] rounded-full" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Mission */}
                <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 backdrop-blur-md p-8 md:p-10 shadow-lg">
                 <HeroScene />
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00c050]" />
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#00c050]/10">
                    <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900">
                    {language === "hy" ? "Մեր առաքելությունը" : language === "ru" ? "Наша миссия" : "Our Mission"}
                  </h3>
                  <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-600">
                    {ab.philosophyText1[language]}
                  </p>
                </div>

                {/* Vision */}
                <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 backdrop-blur-md p-8 md:p-10 shadow-lg">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00c050]" />
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#00c050]/10">
                    <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900">
                    {language === "hy" ? "Մեր տեսլականը" : language === "ru" ? "Наше видение" : "Our Vision"}
                  </h3>
                  <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-600">
                    {language === "hy"
                      ? "Դառնալ թվային ենթակառուցվածքների և ՏՏ ինտեգրման ոլորտի ամենավստահելի առաջատարը տարածաշրջանում։"
                      : language === "ru"
                      ? "Стать самым надёжным лидером в сфере цифровой инфраструктуры и ИТ-интеграции в регионе."
                      : "To become the most trusted leader in digital infrastructure and IT integration in the region."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </AboutSectionReveal>

        {/* ==================== JOURNEY ==================== */}

      </div>
    </div>
  );
}