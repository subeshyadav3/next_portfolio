// app/page.tsx
"use client"
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import './globals.css';
import Hero from './components/single-page-comp/Hero';
import About from './components/single-page-comp/about';
import Project from './components/single-page-comp/projects';
import ContactPage from './components/single-page-comp/contact';
import Navbar from './components/navbar';


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
      <Hero  animate={pageVisible}/>
      <About  />
      <Project />
      <ContactPage />

    </>
  );
}
