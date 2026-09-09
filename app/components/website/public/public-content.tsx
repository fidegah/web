import Features from "./home/features";
import HeroSection from "./home/hero-section";
import Stats from "./home/stats";
import Faq from "./home/faq";
import Newsletter from "./home/newsletter";
import { useEffect, useRef } from "react";
import HowItWorks from "./home/how-it-works";

export default function PublicContent() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mainRef.current.style.setProperty("--mouse-x", `${x}px`);
      mainRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main
      ref={mainRef}
      className="relative pt-16 pb-6 overflow-hidden bg-zinc-50 dark:bg-[#09090b]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-40 dark:opacity-25 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.18), transparent 80%)`,
        }}
      />

      <HeroSection />
      <Features />
      <HowItWorks />
      <Stats />
      <Faq />
      <Newsletter />
    </main>
  );
}
