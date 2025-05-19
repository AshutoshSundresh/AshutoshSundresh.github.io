"use client";
import { useEffect, useRef } from 'react';
import PersonalIntro from "./components/PersonalIntro";
import IntroText from "./components/IntroText";

export default function Home() {
  return (
    <main className="h-[100dvh] snap-y snap-mandatory overflow-y-auto smooth-scroll">
      <section className="h-[100dvh] snap-start snap-always">
        <PersonalIntro />
      </section>
      <section className="h-[100dvh] snap-start snap-always">
        <IntroText />
      </section>
    </main>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
