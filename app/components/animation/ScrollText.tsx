'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ScrollTextProps = {
  text: string;
  duration?: number;
  yOffset?: number;
  delay?: number;
};

export default function ScrollText({
    text,
    duration = 1,
    yOffset = 100,
    delay = 0,
    animateOnMount = false,
  }: ScrollTextProps & { animateOnMount?: boolean }) {
    const textRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (textRef.current) {
        if (animateOnMount) {

          gsap.fromTo(
            textRef.current,
            { x: -50, y: -yOffset, opacity: 0, rotate: -5, scale: 0.95 },
            {
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              duration,
                delay: delay,
              ease: 'power3.out',
            }
          );
        } else {

          gsap.fromTo(
            textRef.current,
            { x: -50, y: -yOffset, opacity: 0, rotate: -5, scale: 0.95 },
            {
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              
              duration,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: textRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      }
    }, [duration, yOffset, animateOnMount]);
  
    return (
      <div
        ref={textRef}
        style={{

          display: 'inline-block',
        }}
      >
        {text}
      </div>
    );
  }
  