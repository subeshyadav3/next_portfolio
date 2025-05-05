// app/page.tsx
"use client"
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import './globals.css';
import Hero from './components/single-page-comp/Hero';
import About from './components/single-page-comp/about';
import Project from './components/single-page-comp/projects';
import ContactPage from './components/single-page-comp/contact';


export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  console.log("server")
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <Hero />
      <About />
      <Project />
      <ContactPage />
    </>
  );
}
