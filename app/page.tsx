"use client";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";

export default function Home() {
  return (
    <main className="h-[100dvh] snap-y snap-mandatory overflow-y-auto smooth-scroll">
      <section className="h-[100dvh] snap-start snap-always">
        <HeroSection />
      </section>
      <section className="h-[100dvh] snap-start snap-always">
        <IntroSection />
      </section>
    </main>
  );
}