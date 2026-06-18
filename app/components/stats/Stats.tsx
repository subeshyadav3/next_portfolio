"use client";
import { Code2, Layers, GraduationCap, Sparkles } from "lucide-react";
import CountUp from "../animations/CountUp";
import projectsData from "../projects/projectsData";

export default function Stats() {
  const projectCount = projectsData.length;

  return (
    <section id="stats" className="py-16 px-6 sm:px-0">
      <div className="max-w-[900px] mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card icon={<Code2 size={16} className="text-green" />} label="Projects Shipped">
            <CountUp to={projectCount} />
          </Card>
          <Card icon={<Layers size={16} className="text-blue" />} label="Technologies">
            <CountUp to={20} suffix="+" />
          </Card>
          <Card icon={<GraduationCap size={16} className="text-orange" />} label="Year at Pulchowk">
            <span className="text-primary">3rd</span>
          </Card>
          <Card icon={<Sparkles size={16} className="text-green" />} label="Status">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-green opacity-75 animate-ping" />
                <span className="relative rounded-full h-2 w-2 bg-green" />
              </span>
              <span className="text-primary">Open</span>
            </span>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="stat-card p-5 transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="mono text-[10px] text-muted uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl mono font-semibold">{children}</div>
    </div>
  );
}
