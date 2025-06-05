import ScrollText from "../components/animation/ScrollText";

export default function HomePage() {
  return (
    <main className="h-[1500px]">
      <ScrollText text="👋 Hello! Scroll to reveal me." duration={1.5} yOffset={80} />
      {/* <ScrollText text="🔥 Reusable scroll animation in GSAP!" duration={1} yOffset={100} /> */}
    </main>
  );
}
