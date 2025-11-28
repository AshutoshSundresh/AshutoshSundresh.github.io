"use client";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import GameOfLife from "./components/GameOfLife";

export default function Home() {
  return (
    <main className="h-[100dvh] snap-y snap-mandatory overflow-y-auto smooth-scroll bg-white dark:bg-[#1e1e1e]">
      {/* Shared static background across both snap-scrolled pages */}
      <div className="fixed inset-0 w-full h-full z-0">
        <GameOfLife />
      </div>
      <section className="h-[100dvh] snap-start snap-always relative z-10">
        <HeroSection />
      </section>
      <section className="h-[100dvh] snap-start snap-always relative z-10">
        <IntroSection />
      </section>
    </main>
  );
}