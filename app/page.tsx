"use client";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";

export default function Home() {
  return (
    <main className="h-[100dvh] snap-y snap-mandatory overflow-y-auto smooth-scroll bg-white dark:bg-[#1e1e1e]">
      <section className="h-[100dvh] snap-start snap-always">
        <HeroSection />
      </section>
      <section className="h-[100dvh] snap-start snap-always">
        <IntroSection />
      </section>
    </main>
  );
}