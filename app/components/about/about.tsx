"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useInViewAnimation from "@/app/hooks/useInViewAnimation";
import "../../globals.css";
import AnimatedTitle from "../animation/AnimatedTitle";
import ScrollFadeIn from "../animation/fadeIn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


export default function About() {
  const isInView = useInViewAnimation(0.8, "about");
  const imageRef= useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0,scale:0.5 },
          {
            opacity: 1,
           
            duration: 1,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 80%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, [imageRef]);

    return () => ctx.revert();
  }

  , []);
  return (
    <div
      id="about"
      className="flex flex-col sm:ml-[100px] min-h-screen lg:ml-[200px] mt-[-165px] sm:mt-[-200px] pb-5 sm:px-0 pl-2"
    >
      <div>
        <AnimatedTitle className="text-3xl font-semibold title-line mb-6 text-[#90A0D9]">
         About Me
        </AnimatedTitle>
       
      </div>
      <div className="flex flex-col md:flex-row">
        <div
        ref={imageRef} 
          className={`relative order-1 md:order-2 lg:ml-[100px] ml-5 my-5 `}
        >
          
          <div className="absolute top-[40px] left-[40px] w-[220px] h-[230px] bg-[#272D44] border-2 border-[#BDBDDD] rounded-sm"></div>
          <Image
            src="/profile.jpg"
            alt="About Me"
            width={250}
            height={250}
            className="relative object-cover p-2 shadow-lg  rounded-2xl opacity-90 hover:opacity-100  z-10 hover:top-[5px] hover:left-[5px] transition-transform duration-300 ease-in-out"
          />
        </div>

        <div
          className={`py-5 w-full md:w-1/2 order-2 md:order-1 `}
        >
          <ScrollFadeIn>

          <p className="text-[#BDBDDD]">
            I am a passionate engineering student with a keen interest in coding
            and problem-solving. I thrive on challenges and enjoy exploring new
            technologies to create innovative solutions for real-world problems.
            My dedication to continuous learning drives me to stay updated with
            the latest trends in the tech industry.
          </p>
          </ScrollFadeIn>
          <ScrollFadeIn>
          <p
            className={`text-[#BDBDDD] py-5`}
          >
            I am always eager to expand my skill set and take on new projects
            that push my boundaries. Whether it's developing web applications or
            diving into algorithms, I approach each task with enthusiasm and a
            commitment to excellence.
          </p>

          </ScrollFadeIn>
          <div
            className={``}
          >
            <ScrollFadeIn>
            <p>I am working in these languages, libraries, or frameworks:</p>
            </ScrollFadeIn>

            <div className="flex pl-5">
             <ScrollFadeIn>
             <ul className="flex gap-2 mr-10 flex-col text-[#BDBDDD] pt-5 list-disc">
                <li>JavaScript</li>
                <li>React.js</li>
                <li>Node.js</li>
                <li>Next.js</li>
              </ul>
              </ScrollFadeIn>
              <ScrollFadeIn>
              <ul className="flex gap-2 flex-col text-[#BDBDDD] pt-5 list-disc">
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>Tailwind CSS</li>
                <li>Python</li>
              </ul>
              </ScrollFadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}