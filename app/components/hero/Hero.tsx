"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import "../../globals.css";

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const animateRotateIn = (element: HTMLElement | null, delay = 0) => {
      if (!element) return;
      const split = new SplitType(element, { types: "words" });
      gsap.from(split.words, {
        rotateX: -90,
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.1,
        delay,
      });
    };

    animateRotateIn(headingRef.current, 0);
    animateRotateIn(subheadingRef.current, 0.4);


    if (paragraphRef.current) {
      gsap.fromTo(
        paragraphRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          
          duration: 1,
          ease: "power2.out",
          delay: .6,
        }
      );
    }


    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { y: 0,scale:0.7, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.7,
        }
      );
    }
  }, []);

  return (
    <div id="home" className="h-screen mt-[100px] overflow-hidden">
      <div className="flex justify-center items-center flex-col my-12 text-center px-4">
        <h1
          ref={headingRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#CDCDFF] leading-snug"
        >
          Hi, I am <span className="text-[#90A0D9]">Subesh</span>
        </h1>

        <h1
          ref={subheadingRef}
          className="text-2xl sm:text-3xl lg:text-3xl text-[#CDCDFF] mt-5 font-bold"
        >
          Fullstack Developer
        </h1>

        <p
          ref={paragraphRef}
          className="md:w-[600px] sm:p-10 text-[#BDBDDD] py-10 w-full"
        >
          An engineering student passionate about coding, problem-solving, and
          exploring new technologies. Dedicated to creating innovative solutions
          for real-world challenges.
        </p>

        <div ref={buttonRef}>
          <a href="/final.pdf">
            <button className="border-2 border-[#90A0D9] px-4 py-2 rounded-sm resume-btn hover:bg-[#90A0D9]/20 transition">
              <span className="relative z-10 hover:text-blue-950">Resume</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
