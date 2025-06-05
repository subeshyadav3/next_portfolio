"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../education.css";
import AnimatedTitle from "../animation/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const educationData = [
    {
      period: "Jan 2024 - Jan 2028",
      degree: "Bachelor's Degree",
      institution: "Pulchowk Campus",
      description:
        "Currently pursuing a Bachelor's degree in Computer Engineering, focusing on building a strong foundation in technical skills and innovative problem-solving approaches.",
    },
    {
      period: "Mar 2021 - Mar 2023",
      degree: "Higher Secondary Education",
      institution: "KIST COLLEGE & SS",
      description:
        "Completed higher secondary education with a strong focus on science and mathematics. Developed analytical thinking and problem-solving skills through rigorous coursework.",
    },
    {
      period: "Jan 2016 - Jan 2021",
      degree: "Secondary Education (SEE)",
      institution: "Navodaya Shishu Sadan",
      description:
        "Completed secondary education with excellence in science and mathematics. Participated in various academic competitions and extracurricular activities.",
    },
    {
      period: "Early Education",
      degree: "Primary Education",
      institution: "Sagarmatha Lower Secondary School",
      description:
        "Built a strong educational foundation during primary schooling, where curiosity and love for learning were nurtured.",
    },
  ];


  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRefMob = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!cardsRef.current) return;

    cardsRef.current.forEach((card, idx) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 30, x: -20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: idx * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      
      
    });

    
    cardsRefMob.current.forEach((card, idx) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 30, x: -20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: idx * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      
      
    });

    

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      id="education"
      className="flex flex-col mt-15 sm:ml-[100px] lg:ml-[200px] pb-5 sm:px-0 pl-2"
    >
      <div>
        <AnimatedTitle className="text-3xl font-bold text-[#90A0D9] title-line mb-10 sm:mb-2">
          Education
        </AnimatedTitle>
      </div>

      <div className="education-timeline-vertical md:hidden mt-10">
        {educationData.map((item, index) => (
          <div
            key={index}
            ref={(el) => {cardsRefMob.current[index] = el!;}}
            className="timeline-item-vertical"
          >
            <div className="timeline-dot-vertical"></div>
            <div className="timeline-date-vertical">
              <span>{item.period} </span>
            </div>
            <div className="timeline-content-vertical">
              <h3>{item.degree}</h3>
              <h4>{item.institution}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block education-timeline-horizontal mt-16">
        <div className="timeline-track">
          <div className="timeline-items-container">
            {educationData.map((item, index) => (
              <div
                key={index}
                ref={(el) => {cardsRef.current[index] = el!;}}
                className="timeline-item-horizontal"
              >
                <div className="timeline-dot-horizontal"></div>
                <div className="timeline-content-horizontal">
                  <h3>{item.degree}</h3>
                  <h4>{item.institution}</h4>
                  <span className="timeline-period">{item.period}</span>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
