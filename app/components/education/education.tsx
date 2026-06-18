"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../globals.css";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const educationData = [
    { period: "Jan 2024 - Jan 2028", degree: "Bachelor's Degree", institution: "Pulchowk Campus", description: "Currently pursuing a Bachelor's degree in Computer Engineering, focusing on building a strong foundation in technical skills and innovative problem-solving approaches." },
    { period: "Mar 2021 - Mar 2023", degree: "Higher Secondary Education", institution: "KIST COLLEGE & SS", description: "Completed higher secondary education with a strong focus on science and mathematics." },
    { period: "Jan 2016 - Jan 2021", degree: "Secondary Education (SEE)", institution: "Navodaya Shishu Sadan", description: "Completed secondary education with excellence in science and mathematics." },
    { period: "Early Education", degree: "Primary Education", institution: "Sagarmatha Lower Secondary School", description: "Built a strong educational foundation during primary schooling." },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: idx * 0.15, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="education" ref={sectionRef} className="min-h-screen flex items-center px-6 sm:px-0 py-24">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4">03 / education</p>
        <h2 className="text-[28px] font-semibold text-primary mb-12">Education</h2>

        <div className="space-y-0">
          {educationData.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el!; }}
              className="relative pl-6 pb-8 transition-colors duration-200 hover:border-green"
              style={{ borderLeft: "2px solid var(--border)" }}
            >
              {/* Connecting dot */}
              <div
                className="absolute left-0 top-0 w-2 h-2 bg-green"
                style={{ transform: "translateX(-5px)" }}
              />

              <p className="mono text-xs text-orange uppercase tracking-wider mb-1">{item.period}</p>
              <h3 className="text-base font-medium text-primary">{item.degree}</h3>
              <p className="text-sm text-secondary mb-2">{item.institution}</p>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}