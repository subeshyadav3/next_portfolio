"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export default function CountUp({ to, duration = 1.5, prefix = "", suffix = "", className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        v: to,
        duration,
        ease: "power2.out",
        onUpdate: () => setValue(Math.round(counter.v)),
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
    return () => ctx.revert();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
