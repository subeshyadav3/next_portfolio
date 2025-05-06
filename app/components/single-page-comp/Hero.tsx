"use client";

import '../../globals.css';

export default function Hero({ animate }: { animate: boolean }) {
  return (
    <div id="home" className="h-screen mt-[100px]">
      <div className="flex justify-center items-center flex-col my-12">
        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${animate ? "hero-anim delay-200" : ""}`}
        >
          <span className="text-[#CDCDFF]">Hi, I am</span>{" "}
          <span className="text-[#90A0D9]">Subesh</span>
        </h1>

        <h1
          className={`text-2xl sm:text-3xl lg:text-3xl text-[#CDCDFF] mt-5 font-bold ${animate ? "hero-anim delay-300" : ""}`}
        >
          Fullstack Developer
        </h1>

        <p
          className={`md:w-[600px] sm:p-10 text-[#BDBDDD] py-10 w-full ${animate ? "hero-anim delay-400" : ""}`}
        >
          An engineering student passionate about coding, problem-solving, and exploring new technologies. Dedicated to creating innovative solutions for real-world challenges.
        </p>

        <div
          className={`${animate ? "hero-anim delay-600" : ""}`}
        >
          <a href="/resume.pdf" download>
            <button className="border-2 border-[#90A0D9] px-4 py-2 rounded-sm resume-btn">
              <span className="relative z-10 hover:text-blue-950">Resume</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
