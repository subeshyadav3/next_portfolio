"use client";
import { useRef } from "react";
import { Code2, Layers, GraduationCap, Sparkles } from "lucide-react";
import CountUp from "../animations/CountUp";
import projectsData from "../projects/projectsData";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const projectCount = projectsData.length;

  const stats = [
    {
      icon: <Code2 size={20} className="text-green" />,
      label: "Projects Shipped",
      value: <CountUp to={projectCount} />,
      suffix: "+",
      color: "green",
    },
    {
      icon: <Layers size={20} className="text-blue" />,
      label: "Technologies",
      value: <CountUp to={20} />,
      suffix: "+",
      color: "blue",
    },
    {
      icon: <GraduationCap size={20} className="text-orange" />,
      label: "Year at Pulchowk",
      value: <span className="text-primary">3rd</span>,
      suffix: "",
      color: "orange",
    },
    {
      icon: <Sparkles size={20} className="text-purple" />,
      label: "Status",
      value: (
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-green opacity-75 animate-ping" />
            <span className="relative rounded-full h-2 w-2 bg-green" />
          </span>
          <span className="text-primary">Open</span>
        </span>
      ),
      suffix: "",
      color: "green",
    },
  ];

  return (
    <section id="stats" ref={sectionRef} className="py-20 px-6 sm:px-0 relative">
      <div className="max-w-[900px] mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card p-6 group cursor-default"
              style={{
                backgroundColor: "rgba(22, 27, 34, 0.5)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    backgroundColor:
                      stat.color === "green" ? "rgba(61,214,140,0.1)" :
                      stat.color === "blue" ? "rgba(96,165,250,0.1)" :
                      stat.color === "orange" ? "rgba(249,115,22,0.1)" :
                      "rgba(168,85,247,0.1)",
                  }}
                >
                  {stat.icon}
                </span>
                <span className="mono text-[10px] text-muted uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-3xl mono font-bold flex items-baseline gap-1">
                {stat.value}
                {stat.suffix && <span className="text-lg text-muted">{stat.suffix}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
