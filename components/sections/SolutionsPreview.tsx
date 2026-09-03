"use client";

import { TextReveal, BlurReveal } from "@/components/ui/TextReveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Մեդիա ֆայլերի հղումները
const projectMedia = [
  {
    key: "oracle",
    mediaType: "video",
    media: "/videos/video_202607021424.mp4",
    poster: "/images/project-oracle.jpg",
  },
  {
    key: "softconstruct",
    mediaType: "image",
    media: "/images/projects/active-active data center.png",
  },
  {
    key: "idbank",
    mediaType: "video",
    media: "/videos/Start_with_an_extreme_close-up_202607021402.mp4",
    poster: "/images/project-idbank.jpg",
  },
  {
    key: "nationalSecurity",
    mediaType: "video",
    media: "/videos/kling_20260629_VIDEO_Camera_slo_4155_0.mp4",
  },
] as const;

export function SolutionsPreview() {
  const { language, t } = useLanguage();
  const sp = t.solutionsPreview;

  return (
    <section className="relative py-24 md:py-32">
      {/* Glass background */}
      <div className="absolute inset-0 -z-10 bg-white/70 backdrop-blur-xl" />

      <div className="container-x">
        {/* Header */}
        <BlurReveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">{sp.eyebrow[language]}</span>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                <TextReveal splitBy="words">
                  {sp.title[language]}
                </TextReveal>
              </h2>
            </div>

            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 hover:gap-3"
            >
              {sp.viewAll[language]}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </BlurReveal>

        {/* PROJECT CARDS */}
        <div className="mt-16 space-y-10 md:space-y-16">
          {projectMedia.map((m, i) => {
            const projectData = sp.projects[m.key];
            const title = projectData.title[language];
            const description = projectData.description[language];
            const tags = Object.values(projectData.tags).map(
              (tagObj) => tagObj[language]
            );

            return (
              <BlurReveal key={m.key} delay={i * 0.1}>
                <Link href="/solutions" className="group block">
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl">
                    {/* MEDIA */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                      {m.mediaType === "video" ? (
                        <video
                          src={m.media}
                          poster={"poster" in m ? m.poster : undefined}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={m.media}
                          alt={title}
                          loading={i > 1 ? "lazy" : "eager"}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-700 group-hover:via-black/50" />

                      {/* Category Badge */}
                      <span className="absolute left-6 top-6 rounded-2xl bg-white/95 px-5 py-2 text-xs md:text-sm font-semibold uppercase tracking-widest text-foreground backdrop-blur-md shadow-md">
                        {tags[0]}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-8 md:p-12">
                      <h3 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                        {title}
                      </h3>

                      <p className="mt-4 text-base md:text-[17px] leading-relaxed text-muted-foreground">
                        {description}
                      </p>

                      {/* TAGS */}
                      <div className="mt-8 flex flex-wrap gap-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm text-zinc-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </BlurReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}