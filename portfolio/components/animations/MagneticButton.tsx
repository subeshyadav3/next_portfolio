"use client";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  cursorLabel?: string;
  as?: "a" | "button";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
};

export default function MagneticButton({
  children,
  className = "",
  strength = 0.25,
  cursorLabel,
  as = "a",
  href,
  target,
  rel,
  onClick,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commonProps: any = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: ref as any,
    className,
    onMouseMove,
    onMouseLeave,
    style: { transition: "transform 250ms cubic-bezier(0.16,1,0.3,1)", ...style },
    "data-cursor-label": cursorLabel,
  };

  if (as === "button") {
    return (
      <button {...commonProps} onClick={onClick}>
        {children}
      </button>
    );
  }
  return (
    <a {...commonProps} href={href} target={target} rel={rel} onClick={onClick}>
      {children}
    </a>
  );
}
