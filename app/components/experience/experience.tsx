"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import Image from "next/image";
import "../../globals.css";
import experienceData from "./experience-data";
import { Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const dateFormatOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };

export default function ExperienceCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { opacity: 0, clipPath: "inset(0 0 100% 0)", y: 30 },
          {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 0.8,
            ease: "power4.out",
            delay: idx * 0.15,
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experiences" ref={sectionRef} className="min-h-screen flex items-center px-6 sm:px-0 py-24 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple opacity-[0.02] rounded-full blur-[120px]" />
      
      <div className="max-w-[900px] mx-auto w-full relative z-10">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles size={14} />
          04 / experience
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-12">Experience</h2>
        <div className="flex flex-col gap-6">
          {experienceData.map((exp, idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el!; }}
              className="experience-card p-6 glass-card"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="experience-logo flex items-center gap-3">
                  <div className="p-2 bg-elevated/80 border border-custom" style={{ border: "1px solid var(--border)" }}>
                    <Image src={exp.logo} alt={exp.logoAlt} width={24} height={24} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-primary leading-tight">{exp.position}</h3>
                    <p className="text-xs text-muted leading-none mt-1">{exp.logoAlt}</p>
                  </div>
                </div>
                <span className="mono text-xs text-orange py-1 px-2.5 bg-orange/5 border border-orange/10">
                  {new Intl.DateTimeFormat("en-US", dateFormatOptions).format(exp.startDate)} -{" "}
                  {exp.currentlyWorkHere
                    ? "Present"
                    : exp.endDate
                    ? new Intl.DateTimeFormat("en-US", dateFormatOptions).format(exp.endDate)
                    : "Present"}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {exp.summary.map((s, i) => (
                  <li key={i} className="text-sm text-secondary leading-relaxed flex gap-2">
                    <span className="text-green select-none">▸</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
