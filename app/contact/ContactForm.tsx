"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

type FieldErrors = Partial<
  Record<"name" | "company" | "email" | "phone" | "subject" | "message", string>
>;

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { language, t } = useLanguage();
  const contact = t.contact;

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Three.js Marching Cubes ֆոնի ինտեգրում (վերին հատվածի համար)
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;

    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let light: THREE.DirectionalLight, pointLight: THREE.PointLight, ambientLight: THREE.AmbientLight;
    let effect: MarchingCubes;
    let time = 0;
    const clock = new THREE.Clock();

    const resolution = 28;
    const numBlobs = 10;

    function init() {
      // Տեսախցիկի կարգավորումներ
      const aspect = container.clientWidth / container.clientHeight;
      camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
      // Կենտրոնացումը մի փոքր դեպի վերև՝ հերոս բլոկի վրա
      camera.position.set(-200, 200, 700); 
      camera.lookAt(0, 100, 0);

      scene = new THREE.Scene();
      // Ֆոնը սպիտակ
      scene.background = new THREE.Color(0xffffff);

      // Լուսավորություն
      light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(0.5, 0.5, 1);
      scene.add(light);

      pointLight = new THREE.PointLight(0x00c050, 3, 0, 0);
      pointLight.position.set(0, 0, 100);
      scene.add(pointLight);

      ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      // Նյութ
      const material = new THREE.MeshPhongMaterial({
        color: 0x00c050,
        specular: 0x494949,
        shininess: 50,
        transparent: true,
        opacity: 0.55,
      });

      // Marching Cubes օբյեկտ
      effect = new MarchingCubes(resolution, material, true, true, 100000);
      effect.position.set(0, 0, 0);
      effect.scale.set(750, 750, 750); // Մի փոքր ավելի կոմպակտ
      scene.add(effect);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function updateCubes(object: MarchingCubes, elapsedTime: number) {
      object.reset();
      const subtract = 12;
      const strength = 1.2 / ((Math.sqrt(numBlobs) - 1) / 4 + 1);

      for (let i = 0; i < numBlobs; i++) {
        const ballx = Math.sin(i + 1.26 * elapsedTime * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        // Անիմացիան կենտրոնացված է էկրանի վերին կեսի վրա
        const bally = Math.abs(Math.cos(i + 1.12 * elapsedTime * Math.cos(1.22 + 0.1424 * i))) * 0.88 + 0.3; 
        const ballz = Math.cos(i + 1.32 * elapsedTime * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

        object.addBall(ballx, bally, ballz, strength, subtract);
      }
      object.update();
    }

    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta * 0.5;
      updateCubes(effect, time);
      renderer.render(scene, camera);
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return; // duplicate submission protection
    setSending(true);
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      locale: language,
      // Honeypot: hidden from real users via CSS, bots tend to fill every field.
      website: String(fd.get("website") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        toast.error(data.message || contact.toastError[language]);
        return;
      }

      toast.success(contact.toastSuccess[language]);
      form.reset();
    } catch {
      toast.error(contact.toastError[language]);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* ՀԵՐՈՍ ԲԼՈԿ (Վերևի հատված) */}
      {/* Տեղադրված է z-index 20՝ ֆոնից բարձր լինելու համար */}
      <section className="relative border-b border-zinc-200 overflow-hidden z-20">
        <div className="container-x py-32 md:py-40">
          <div className="max-w-4xl pl-6 md:pl-16 text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00c050] mr-8">
              {contact.eyebrow[language]}
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-zinc-900">
              {contact.heroTitle[language]}{" "}
              <span className="text-[#00c050]">
                {contact.heroTitleHighlight[language]}
              </span>
            </h1>
            <p className="mt-8 text-lg text-zinc-800 font-semibold leading-relaxed">
              {contact.heroDescription[language]}
            </p>
          </div>
        </div>
      </section>

      {/* THREE.JS ՖՈՆ (Անցյալում absolute 0-ն էր, հիմա սահմանափակված է վերևով) */}
      {/* Փոխված է container-ի բարձրությունը և տեղադրությունը */}
      <div 
        ref={canvasContainerRef} 
        className="absolute top-0 left-0 w-full h-[60vh] z-10 pointer-events-none opacity-70" 
      />

      {/* MAIN CONTENT SECTION (Ներքևի ֆորմայի բլոկ) */}
      {/* Ֆոնը մաքուր սպիտակ է՝ ֆորմայի բլոկի տակ */}
      <section className="relative py-24 z-20 bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          {/* LEFT - CONTACT INFO */}
          <div className="lg:col-span-5 space-y-6 ml-8">
            <div className="mb-8 ml-4">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {contact.officeTitle[language]}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 font-medium">
                {contact.officeDescription[language]}
              </p>
            </div>
            <ContactCard
              icon={<MapPin className="text-[#00c050]" />}
              title={contact.info.addressTitle[language]}
              text={contact.info.address[language]}
            />
            <ContactCard
              icon={<Mail className="text-[#00c050]" />}
              title={contact.info.emailTitle[language]}
              text="info@digibase.am"
            />
            <ContactCard
              icon={<Phone className="text-[#00c050]" />}
              title={contact.info.phoneTitle[language]}
              text="+374 12 488888"
            />
            <div className="mt-10 overflow-hidden rounded-[32px] border border-zinc-200 shadow-[0_40px_100px_rgba(0,0,0,.15)] transition duration-500 hover:-translate-y-2">
              <iframe
                title="DIGIBASE Location"
                src="https://www.google.com/maps?q=20+Baghramyan+Ave,+Yerevan,+Armenia&output=embed"
                className="h-[380px] w-full border-0"
              />
            </div>
          </div>

          {/* RIGHT - FORM */}
          <form
            onSubmit={submit}
            className="relative lg:col-span-7 rounded-[32px] border border-zinc-200 bg-white p-8 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,.12)]"
          >
            {/* Honeypot: hidden from real users, bots tend to fill every input */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <h2 className="text-3xl font-bold text-zinc-900">
              {contact.formTitle[language]}
            </h2>
            <p className="mt-3 text-zinc-700 font-medium">
              {contact.formSubtitle[language]}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Field
                name="name"
                label={contact.form.fullName[language]}
                placeholder={contact.form.fullName[language]}
                required
                error={fieldErrors.name}
              />
              <Field
                name="company"
                label={contact.form.company[language]}
                placeholder={contact.form.company[language]}
                required
                error={fieldErrors.company}
              />
              <Field
                name="email"
                label={contact.form.email[language]}
                placeholder={contact.form.email[language]}
                type="email"
                required
                error={fieldErrors.email}
              />
              <Field
                name="phone"
                label={contact.form.phoneOptional[language]}
                placeholder={contact.form.phoneOptional[language]}
                error={fieldErrors.phone}
              />
              <div className="md:col-span-2">
                <Field
                  name="subject"
                  label={contact.form.subject[language]}
                  placeholder={contact.form.subject[language]}
                  error={fieldErrors.subject}
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-900">
                {contact.form.message[language]}
              </label>
              <textarea
                name="message"
                rows={6}
                required
                placeholder={contact.form.message[language]}
                className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 font-medium outline-none transition focus:border-[#00c050]"
              />
              {fieldErrors.message && (
                <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.message}</p>
              )}
            </div>
            <button
              disabled={sending}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#00c050] px-8 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#00a042] disabled:opacity-50"
            >
              {sending ? contact.form.sending[language] : contact.form.send[language]}
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-xl p-7 shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 text-[#00c050]">
          {icon}
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
            {title}
          </h3>
          <p className="mt-1 font-semibold text-zinc-900">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required,
  error,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-900">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={`mt-3 w-full rounded-2xl border bg-white px-5 py-4 text-zinc-900 font-medium outline-none transition focus:border-[#00c050] ${
          error ? "border-red-400" : "border-zinc-200"
        }`}
      />
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}