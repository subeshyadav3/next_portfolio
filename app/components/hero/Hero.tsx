"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import "../../globals.css";

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {


    const tl = gsap.timeline();

    tl.fromTo(
      headingRef.current,
      { y: 30, opacity: 0 ,delay: 0.1},
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out"  },
      "-=0.2"
    )
      .fromTo(
        subheadingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        paragraphRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        buttonRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
  }, []);

  return (
    <div id="home" className="h-screen mt-[100px]">
      <div className="flex justify-center items-center flex-col my-12">
        <h1
          ref={headingRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#CDCDFF]"
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
          className="md:w-[600px] sm:p-10 text-[#BDBDDD] py-10 w-full text-center"
        >
          An engineering student passionate about coding, problem-solving, and exploring new technologies. Dedicated to creating innovative solutions for real-world challenges.
        </p>

        <div ref={buttonRef}>
          <a href="/final_CV.pdf">
            <button className="border-2 border-[#90A0D9] px-4 py-2 rounded-sm resume-btn">
              <span className="relative z-10 hover:text-blue-950">Resume</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
