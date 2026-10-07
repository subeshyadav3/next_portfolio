"use client";
import "../globals.css";
import dynamic from "next/dynamic";
import Hero from "../../components/hero/Hero";
import About from "../../components/about/about";
import Stats from "../../components/stats/Stats";
import { generateLocalBusinessSchema, generatePersonSchema } from "../../lib/blog/schema";

const Education = dynamic(() => import("../../components/education/education"), { ssr: false });
const Experience = dynamic(() => import("../../components/experience/experience"), { ssr: false });
const Project = dynamic(() => import("../../components/projects/projects"), { ssr: false });
const ContactPage = dynamic(() => import("../../components/contact/contact"), { ssr: false });

export default function HomePage() {
  const serviceSchema = generateLocalBusinessSchema();
  const personSchema = generatePersonSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
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
