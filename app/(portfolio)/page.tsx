"use client";
import "../globals.css";
import Hero from "../components/hero/Hero";
import About from "../components/about/about";
import TechMarquee from "../components/marquee/TechMarquee";
import Stats from "../components/stats/Stats";
import Project from "../components/projects/projects";
import ContactPage from "../components/contact/contact";
import Education from "../components/education/education";
import Experience from "../components/experience/experience";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      {/* <TechMarquee /> */}
      <Stats />
      <Education />
      <Experience />
      <Project />
      <ContactPage />
    </>
  );
}
