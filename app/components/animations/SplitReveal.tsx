"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: keyof React.JSX.IntrinsicElements;
  triggerOnMount?: boolean;
};

export default function SplitReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
  as: Tag = "h1",
  triggerOnMount = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const splitRef = useRef<SplitType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    splitRef.current = new SplitType(el, { types: "chars,words" });

    if (reduced) {
      gsap.set(splitRef.current.chars ?? [], { opacity: 1, y: 0 });
      return;
    }

    const chars = splitRef.current.chars ?? [];
    gsap.fromTo(
      chars,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger: triggerOnMount
          ? undefined
          : { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
      }
    );

    return () => {
      splitRef.current?.revert();
    };
  }, [text, delay, stagger, triggerOnMount]);

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={className}>
      {text}
    </Component>
  );
}
