"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, BookOpen, School, BookMarked, Sparkles } from "lucide-react";
import "@/app/globals.css";

gsap.registerPlugin(ScrollTrigger);

const educationData = [
  { period: "Jan 2024 - Jan 2028", degree: "Bachelor's Degree", institution: "Pulchowk Campus", description: "Currently pursuing a Bachelor's degree in Computer Engineering, focusing on building a strong foundation in technical skills and innovative problem-solving approaches.", Icon: GraduationCap, color: "var(--accent-green)" },
  { period: "Mar 2021 - Mar 2023", degree: "Higher Secondary Education", institution: "KIST COLLEGE & SS", description: "Completed higher secondary education with a strong focus on science and mathematics.", Icon: BookOpen, color: "var(--accent-blue)" },
  { period: "Jan 2016 - Jan 2021", degree: "Secondary Education (SEE)", institution: "Navodaya Shishu Sadan", description: "Completed secondary education with excellence in science and mathematics.", Icon: School, color: "var(--accent-purple)" },
  { period: "Early Education", degree: "Primary Education", institution: "Sagarmatha Lower Secondary School", description: "Built a strong educational foundation during primary schooling.", Icon: BookMarked, color: "var(--accent-cyan)" },
];

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: -30, filter: "blur(5px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
            delay: idx * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="education" ref={sectionRef} className="min-h-screen flex items-center px-6 sm:px-0 py-24 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-green opacity-[0.02] rounded-full blur-[120px]" />

      <div className="max-w-[900px] mx-auto w-full relative z-10">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles size={14} />
          03 / education
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-12">Education</h2>

        <div className="space-y-0 relative border-l border-custom ml-3 sm:ml-4">
          {educationData.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el!; }}
              className="relative pl-8 pb-10 group last:pb-0"
            >
              {/* Timeline Indicator Node with customized color & pulse */}
              <div
                className="absolute left-0 top-1 w-3 h-3 bg-base border-2 -translate-x-1.5 transition-all duration-300 group-hover:scale-125 timeline-dot"
                style={{
                  borderColor: item.color,
                  boxShadow: `0 0 10px ${item.color}80`
                }}
              />

              <p className="mono text-xs text-orange uppercase tracking-wider mb-1.5 font-semibold">{item.period}</p>
              
              <div className="glass-card p-5 border border-custom transition-all duration-300 group-hover:border-hover">
                <h3 className="text-base font-semibold text-primary flex items-center gap-2.5">
                  <span className="p-1.5 bg-elevated border border-custom group-hover:border-hover transition-colors">
                    <item.Icon size={14} style={{ color: item.color }} />
                  </span>
                  {item.degree}
                </h3>
                <p className="text-sm font-medium text-secondary mt-2 mb-2">{item.institution}</p>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
