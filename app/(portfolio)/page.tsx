"use client";
import "../globals.css";
import dynamic from "next/dynamic";
import Hero from "../../components/hero/Hero";
import About from "../../components/about/about";
import Stats from "../../components/stats/Stats";

const Education = dynamic(() => import("../../components/education/education"), { ssr: false });
const Experience = dynamic(() => import("../../components/experience/experience"), { ssr: false });
const Project = dynamic(() => import("../../components/projects/projects"), { ssr: false });
const ContactPage = dynamic(() => import("../../components/contact/contact"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Education />
      <Experience />
      <Project />
      <ContactPage />
    </>
  );
}
