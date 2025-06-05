'use client';

import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import '../../globals.css';
import experienceData from './experience-data';
import AnimatedTitle from '../animation/AnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
};

export default function ExperienceCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      cardsRef.current.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, x: -50 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 30%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
      
    }, [sectionRef]);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="py-8 px-2 sm:px-6 mb-5 max-w-4xl sm:ml-[100px] lg:ml-[200px]"
    >
<AnimatedTitle className="text-3xl font-semibold title-line mb-6 text-[#90A0D9]">
  Experiences
</AnimatedTitle>

     

      <div className="flex flex-col gap-10 max-w-5xl mx-auto">
        {experienceData.map((exp, idx) => (
          <div
            key={idx}
            ref={(el) => { cardsRef.current[idx] = el!; }}
            className="flex flex-col gap-6 rounded-xl
      border-t-2 border-l-2 border-[#90a0d9]
      shadow-xl shadow-[#171f31]
      hover:border-t-8 hover:border-l-8
      px-4 py-8 sm:p-8 md:flex-row md:items-center md:gap-8
      opacity-0 translate-y-12 transition-all"
          >
     
            <div className="flex flex-row items-center justify-between md:flex-col md:w-1/4 gap-2 md:gap-6">
              <Image
                src={exp.logo}
                alt={exp.logoAlt}
                width={80}
                height={60}
                className="object-contain w-[80px] sm:w-[120px]"
                priority={idx === 0}
              />
              <div className="whitespace-nowrap md:text-right text-sm font-medium">
                {new Intl.DateTimeFormat('en-US', dateFormatOptions).format(exp.startDate)} -{' '}
                {exp.currentlyWorkHere
                  ? 'Present'
                  : exp.endDate
                    ? new Intl.DateTimeFormat('en-US', dateFormatOptions).format(exp.endDate)
                    : 'Present'}
              </div>
            </div>

            <div className="flex flex-col md:w-3/4 gap-4">
              <h3 className="font-semibold text-[#90a0d9] text-lg">
                {exp.position}
              </h3>
              <ul className="list-disc font-light pl-5 space-y-2">
                {exp.summary.map((sentence, i) => (
                  <li key={i} className="leading-relaxed">
                    {sentence}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
