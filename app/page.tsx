// app/page.tsx
"use client"
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import './globals.css';
import Hero from './components/hero/Hero';
import About from './components/about/about';
import Project from './components/projects/projects';
import ContactPage from './components/contact/contact';
import Navbar from './components/navbar/navbar';
import Education from './components/education/education';
import Experience from './components/experience/experience';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setPageVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
    <Navbar animate={pageVisible} />
      <Hero />
      <About  />
      <Education />
      <Experience />
      <Project />
      <ContactPage />

    </>
  );
}
