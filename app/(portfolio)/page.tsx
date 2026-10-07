import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/about";
import Stats from "@/components/stats/Stats";
import Education from "@/components/education/education";
import Experience from "@/components/experience/experience";
import Project from "@/components/projects/projects";
import ContactPage from "@/components/contact/contact";
import {
  generateLocalBusinessSchema,
  generatePersonSchema,
} from "@/lib/blog/schema";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

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
