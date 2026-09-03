"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Member } from "@/data/team";

type Language = "hy" | "en" | "ru";

interface MemberCardProps {
  member: Member;
  language: Language;
  isLeader?: boolean;
  index?: number;
}

export function MemberCard({
  member,
  language,
  isLeader,
  index,
}: MemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState("");
  const name = member.name[language] || member.name.hy;
  const role = member.role[language] || member.role.hy;

  // Typing Effect logic (աշխատում է միայն այն դեպքում, երբ ղեկավար է և hover է եղել)
  useEffect(() => {
    let isCancelled = false;

    const typeText = async () => {
      if (!isHovered || !isLeader || !role) return;

      // Սկզբից մաքրում ենք կամ զրոյացնում, եթե պետք է
      setTypedText("");

      for (let i = 0; i < role.length; i++) {
        if (isCancelled) break;

        // Սպասում ենք 30մվ (Promise-ով հիմնված setTimeout)
        await new Promise((resolve) => setTimeout(resolve, 30));

        if (isCancelled) break;

        setTypedText((prev) => prev + role.charAt(i));
      }
    };

    typeText();

    return () => {
      isCancelled = true; // Կանգնեցնում է լոպը, եթե կոմպոնենտը ունմաունթ լինի կամարդյունքը փոխվի
    };
  }, [isHovered, isLeader, role]);
  
  return (
    <div
      className="relative h-[320px] w-full cursor-pointer"
      onMouseEnter={() => isLeader && setIsHovered(true)}
      onMouseLeave={() => isLeader && setIsHovered(false)}
    >
      {/* ================= 1. ՄԱՅՐ ՔԱՐՏ ================= */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md transition-all duration-300 ease-in-out ${
          isHovered && isLeader
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        }`}
      >
        <div className="relative h-44 w-44 overflow-hidden rounded-2xl shadow-inner">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={name}
              fill
              sizes="176px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-zinc-100">
              <span className="text-3xl font-bold text-[#00c050]">
                {member.initials}
              </span>
            </div>
          )}
        </div>

        <h4 className="mt-4 text-lg font-bold tracking-tight text-zinc-900">
          {name}
        </h4>

        {/* Ցույց տալ գրությունը միայն ղեկավարների մոտ */}
        {isLeader ? (
          <span className="mt-2 text-xs font-semibold text-[#00c050] bg-[#00c050]/10 px-3 py-1 rounded-full">
            Hover to view details →
          </span>
        ) : (
          <span className="mt-2 text-xs font-semibold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full">
            {role}
          </span>
        )}
      </div>

      {/* ================= 2. ԵՐԿՐՈՐԴ ՔԱՐՏ (Միայն ղեկավարների համար) ================= */}
      {isLeader && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-start rounded-3xl border border-[#00c050]/40 bg-gradient-to-b from-white via-white to-[#00c050]/10 p-6 text-center shadow-xl transition-all duration-500 ease-out ${
            isHovered
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            transform: isHovered ? "translateY(25px) scale(1.02)" : "translateY(0px) scale(1)",
            zIndex: isHovered ? 30 : 1,
          }}
        >
          {/* Նկարը երկրորդ քարտի վրա */}
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#00c050] shadow-md ring-2 ring-[#00c050]/20">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-zinc-100">
                <span className="text-xl font-bold text-[#00c050]">
                  {member.initials}
                </span>
              </div>
            )}
          </div>

          {/* Անունը */}
          <h4 className="mt-3 text-base font-bold text-zinc-900 border-b border-zinc-200 pb-2 w-full">
            {name}
          </h4>

          {/* ՀԵՐԹՈՎ ՏՊՎՈՂ ԻՆՖՈՐՄԱՑԻԱ (Typing effect) - Ավելի մեծ և հաստ տեքստ (text-sm) */}
          <div className="mt-3 w-full text-left">
            <p className="text-sm leading-relaxed text-zinc-900 font-semibold min-h-[60px]">
              {typedText}
              {/* Տպող կուրսորի էֆեկտ */}
              {isHovered && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-[#00c050] animate-pulse" />
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}