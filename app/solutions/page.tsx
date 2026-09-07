"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getProjects } from "@/data/projects";
import { ProjectsBackdrop3DLoader } from "@/components/solutions/ProjectsBackdrop3DLoader";
import { ProjectSectionReveal, useSectionRefs } from "@/components/solutions/ProjectSectionReveal";
import { useLanguage } from "@/context/LanguageContext";

// Helper to detect video
const isVideoFile = (url: string) => {
  return /\.(mp4|mov|webm|ogg)$/i.test(url);
};

// ================= 3D BACKGROUND – CRYSTAL SHARDS =================
function BackgroundShards() {
  const groupRef = useRef<THREE.Group>(null);

  const shards = useRef(
    Array.from({ length: 55 }, () => {
      const radius = 10 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      return {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta) * 0.6,
          radius * Math.cos(phi) - 8
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.005
        ),
        scale: new THREE.Vector3(
          0.12 + Math.random() * 0.32,
          0.7 + Math.random() * 1.6,
          0.12 + Math.random() * 0.32
        ),
        orbitOffset: Math.random() * Math.PI * 2,
        orbitSpeed: 0.035 + Math.random() * 0.09,
      };
    })
  ).current;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    groupRef.current.rotation.y = t * 0.014;
    groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.035;

    groupRef.current.children.forEach((child, i) => {
      const data = shards[i];
      child.rotation.x += data.rotSpeed.x;
      child.rotation.y += data.rotSpeed.y;
      child.rotation.z += data.rotSpeed.z;

      const orbit = t * data.orbitSpeed + data.orbitOffset;
      child.position.x = data.position.x + Math.sin(orbit) * 0.65;
      child.position.z = data.position.z + Math.cos(orbit) * 0.65;
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((shard, i) => (
        <mesh key={i} position={shard.position} scale={shard.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#00e0a0" : i % 3 === 1 ? "#00c8ff" : "#a0ffe0"}
            transparent
            opacity={0.14}
            wireframe={i % 5 === 0}
            emissive={i % 3 === 0 ? "#00e0a0" : "#0088aa"}
            emissiveIntensity={0.1}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Soft mouse parallax
function SoftCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    camera.position.x += (mouse.current.x * 1.3 - camera.position.x) * delta * 1.8;
    camera.position.y += (3.1 + mouse.current.y * 0.6 - camera.position.y) * delta * 1.8;
    camera.lookAt(0, 0.3, 0);
  });

  return null;
}

// ================= PROJECT CARD =================
function ProjectCard({
  project,
  textFirst,
}: {
  project: ReturnType<typeof getProjects>[number];
  textFirst: boolean;
}) {
  const { textRef, mediaRef } = useSectionRefs();
  const { language, t } = useLanguage();
  const sp = t.solutions;

  return (
    <section className="relative overflow-hidden">
      <div className="relative container-x py-28 md:py-36">
        <div className="grid gap-20 lg:grid-cols-12 items-center">
          {/* TEXT SIDE */}
          <div
            ref={textRef}
            className={`lg:col-span-5 space-y-8 rounded-3xl border border-zinc-200/80 bg-white/85 backdrop-blur-md md:p-10 shadow-xl ${
              textFirst ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <span className="inline-flex rounded-full border border-[#00c050]/20 bg-[#00c050]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#00c050] font-medium ml-2">
              {project.tag}
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-black">
              {project.title}
            </h2>

            <p className="text-sm text-zinc-500 ml-4">{project.client}</p>
            <p className="text-lg leading-relaxed text-zinc-600">{project.description}</p>

            <div>
              <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-400">
                {sp?.technologiesLabel?.[language] || "Technologies"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-[#00c050]/20 bg-[#00c050]/5 p-6">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#00c050]" />
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#00c050] font-semibold">
                  {sp?.businessOutcomeLabel?.[language] || "Business outcome"}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  {project.outcome}
                </p>
              </div>
            </div>
          </div>

          {/* MEDIA SIDE */}
          <div
            ref={mediaRef}
            className={`lg:col-span-7 ${textFirst ? "lg:order-2" : "lg:order-1"}`}
          >
            <div className="space-y-5">
              <div className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
                {isVideoFile(project.gallery[0]) || project.mediaType === "video" ? (
                  <video
                    src={project.gallery[0]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={project.gallery[0]}
                    alt={project.title}
                    width={1200}
                    height={700}
                    className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= MAIN PAGE =================
export default function SolutionsPage() {
  const { language, t } = useLanguage();
  const sp = t.solutions;
  const projects = getProjects(language);

  return (
    <main className="relative bg-white text-black min-h-screen">
      {/* ========== FIXED 3D BACKGROUND (ամբողջ էջի վրա) ========== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 3.1, 10], fov: 42 }}>
          <color attach="background" args={["#f8fafc"]} />
          <ambientLight intensity={0.45} />
          <pointLight position={[12, 10, 8]} intensity={0.85} color="#00ffaa" />
          <pointLight position={[-10, -4, 6]} intensity={0.45} color="#00aaff" />
          <BackgroundShards />
          <SoftCamera />
        </Canvas>
      </div>

      {/* ========== CONTENT (վերևում) ========== */}
      <div className="relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-zinc-200/60 min-h-[85vh] flex items-center">
          <div className="container-x py-32 md:py-40">
            <div className="max-w-4xl pl-6 md:pl-16 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00c050]/30 bg-[#00c050]/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00c050] animate-pulse" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#00c050] font-medium">
                  {sp.eyebrow[language]}
                </span>
              </div>

              <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-900">
                {sp.title1[language]}{" "}
                <span className="text-[#00c050]">{sp.title2[language]}</span>
              </h1>

              <p className="mt-8 text-lg leading-relaxed text-zinc-800 font-medium max-w-2xl">
                {sp.description1[language]}
              </p>
            </div>
          </div>
        </section>

        {/* 4 SOLUTION CATEGORIES */}
        <section className="border-b border-zinc-200/60 py-20 md:py-28 px-6 md:px-20">
          <div className="container-x">
            <div className="mb-14 md:mb-16">
              <p className="mt-3 text-base md:text-lg text-zinc-700">
                {language === "hy"
                  ? "Մեր լուծումները"
                  : language === "ru"
                  ? "Наши решения"
                  : "Our solutions"}
              </p>
              <div className="mt-4 h-1 w-14 bg-[#00c050] rounded-full" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card 1 */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 backdrop-blur-md px-8 py-9 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors group-hover:bg-[#00c050]/15">
                  <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 leading-snug">
                  1.{" "}
                  {language === "hy"
                    ? "Տվյալների կենտրոններ և ԱԲ ենթակառուցվածքներ"
                    : language === "ru"
                    ? "Дата-центры и ИИ-инфраструктура"
                    : "Data Centers & AI Infrastructure"}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {(language === "hy"
                    ? ["Սերվերներ և տվյալների պահպանում", "AI և GPU հարթակներ", "Վիրտուալացում և Cloud"]
                    : language === "ru"
                    ? ["Серверы и хранение данных", "AI и GPU платформы", "Виртуализация и Cloud"]
                    : ["Servers & Data Storage", "AI & GPU Platforms", "Virtualization & Cloud"]
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-zinc-600">
                      <span className="mt-1.5 text-[#00c050] text-sm">›</span>
                      <span className="text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2 */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 backdrop-blur-md px-8 py-9 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors group-hover:bg-[#00c050]/15">
                  <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 leading-snug">
                  2.{" "}
                  {language === "hy"
                    ? "Ցանցեր և Կիբեռանվտանգություն"
                    : language === "ru"
                    ? "Сети и Кибербезопасность"
                    : "Networks & Cybersecurity"}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {(language === "hy"
                    ? ["Կորպորատիվ ցանցային տեխնոլոգիաներ", "Տվյալների պաշտպանություն", "Կիբեռանվտանգության համակարգեր"]
                    : language === "ru"
                    ? ["Корпоративные сетевые технологии", "Защита данных", "Системы кибербезопасности"]
                    : ["Corporate Network Technologies", "Data Protection", "Cybersecurity Systems"]
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-zinc-600">
                      <span className="mt-1.5 text-[#00c050] text-sm">›</span>
                      <span className="text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3 */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 backdrop-blur-md px-8 py-9 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors group-hover:bg-[#00c050]/15">
                  <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 leading-snug">
                  3.{" "}
                  {language === "hy"
                    ? "Անվտանգություն և «Խելացի» ենթակառուցվածքներ"
                    : language === "ru"
                    ? "Безопасность и «Умная» инфраструктура"
                    : "Security & Smart Infrastructure"}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {(language === "hy"
                    ? ["Տեսահսկման համակարգեր", "Մուտքի կառավարում", "Հրդեհային ազդանշանային համակարգեր", "Խելացի լուսավորություն"]
                    : language === "ru"
                    ? ["Системы видеонаблюдения", "Управление доступом", "Пожарная сигнализация", "Умное освещение"]
                    : ["Video Surveillance Systems", "Access Control", "Fire Alarm Systems", "Smart Lighting"]
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-zinc-600">
                      <span className="mt-1.5 text-[#00c050] text-sm">›</span>
                      <span className="text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 4 */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 backdrop-blur-md px-8 py-9 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00c050]/40 hover:shadow-xl hover:shadow-[#00c050]/10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 transition-colors group-hover:bg-[#00c050]/15">
                  <svg className="h-6 w-6 text-[#00c050]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M2 17h20M8 21h8" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 leading-snug">
                  4.{" "}
                  {language === "hy"
                    ? "Համակարգչային և տպագրական տեխնիկա"
                    : language === "ru"
                    ? "Компьютерная и печатная техника"
                    : "Computer & Printing Equipment"}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {(language === "hy"
                    ? ["Բիզնես դասի համակարգիչներ և նոութբուքեր", "Աշխատանքային կայաններ (Workstations)", "Տպիչներ և սկաներներ"]
                    : language === "ru"
                    ? ["Бизнес-класс компьютеры и ноутбуки", "Рабочие станции (Workstations)", "Принтеры и сканеры"]
                    : ["Business-class PCs & Laptops", "Workstations", "Printers & Scanners"]
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-zinc-600">
                      <span className="mt-1.5 text-[#00c050] text-sm">›</span>
                      <span className="text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <div id="projects-scroll-container" className="relative">
          {/* Եթե ուզում ես ProjectsBackdrop3DLoader-ը էլ պահել, թող մնա, բայց հիմա ամբողջ էջի ֆոնը արդեն կա */}
          {/* <ProjectsBackdrop3DLoader containerId="projects-scroll-container" /> */}

          <div className="relative z-10 px-6 md:px-20">
            <div className="mt-20 mb-10">
              <p className="mt-3 text-base md:text-lg text-zinc-900">
                {language === "hy"
                  ? "Մեր Նախագծերը"
                  : language === "ru"
                  ? "Наши Проекты"
                  : "Our Projects"}
              </p>
              <div className="mt-4 h-1 w-14 bg-[#00c050] rounded-full" />
            </div>

            {projects.map((project, index) => (
              <ProjectSectionReveal
                key={project.slug}
                textFirst={index % 2 === 0}
                index={index}
              >
                <ProjectCard project={project} textFirst={index % 2 === 0} />
              </ProjectSectionReveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}