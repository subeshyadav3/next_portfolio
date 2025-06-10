// app/page.tsx
"use client"
import './globals.css';
import Hero from './components/hero/Hero';
import About from './components/about/about';
import Project from './components/projects/projects';
import ContactPage from './components/contact/contact';
import Navbar from './components/navbar/navbar';
import Education from './components/education/education';
import Experience from './components/experience/experience';

export default function HomePage() {


  return (
    <>
    <Navbar  />
      <Hero />
      <About  />
      <Education />
      <Experience />
      <Project />
      <ContactPage />

    </>
  );
}
