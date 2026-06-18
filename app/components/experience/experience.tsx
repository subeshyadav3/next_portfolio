'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import '../../globals.css';
import experienceData from './experience-data';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const dateFormatOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

export default function ExperienceCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: idx * 0.1, scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experiences" ref={sectionRef} className="min-h-screen flex items-center px-6 sm:px-0 py-24">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4">04 / experience</p>
        <h2 className="text-[28px] font-semibold text-primary mb-12">Experience</h2>
        <div className="flex flex-col gap-4">
          {experienceData.map((exp, idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el!; }}
              className="p-6 transition-colors duration-200 hover:bg-elevated hover:border-hover"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <Image src={exp.logo} alt={exp.logoAlt} width={24} height={24} className="object-contain" />
                <span className="mono text-xs text-orange">
                  {new Intl.DateTimeFormat('en-US', dateFormatOptions).format(exp.startDate)} - {exp.currentlyWorkHere ? 'Present' : exp.endDate ? new Intl.DateTimeFormat('en-US', dateFormatOptions).format(exp.endDate) : 'Present'}
                </span>
              </div>
              <h3 className="text-base font-medium text-primary mt-2">{exp.position}</h3>
              <ul className="mt-2 space-y-1">
                {exp.summary.map((s, i) => (
                  <li key={i} className="text-sm text-secondary leading-relaxed flex gap-2">
                    <span className="text-green">▸</span>
                    {s}
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