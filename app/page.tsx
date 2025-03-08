"use client";
import { useEffect, useRef } from 'react';
import PersonalIntro from "./components/PersonalIntro";
import IntroText from "./components/IntroText";

export default function Home() {
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto smooth-scroll">
      <section className="h-screen snap-start">
        <PersonalIntro />
      </section>
      <section className="h-screen snap-start">
        <IntroText />
      </section>
    </main>
  );
}
