"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import NowPlaying from "./NowPlaying";

export default function IntroText() {
  const [isVisible, setIsVisible] = useState(false);
  const [musicStatus, setMusicStatus] = useState<'playing' | 'recent' | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => {
    const currentSection = document.querySelector('#intro-text');
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when the section comes into view
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Optionally reset visibility when scrolling away
          // setIsVisible(false);  // Uncomment if you want it to fade out when scrolled away
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      id="intro-text" 
      ref={sectionRef}
      className={`relative h-screen flex flex-col items-center responsive-justify p-4 md:p-8 font-raleway transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        backgroundImage: "url('https://img.freepik.com/premium-photo/abstract-82-background-wallpaper-gradient_792836-180215.jpg?semt=ais_hybrid')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* NowPlaying placeholder for music widget at the top of notes page */}
      <div className="w-full flex justify-center mb-4">
        <NowPlaying onStatusChange={setMusicStatus} />
      </div>
      <div className={`flex items-center justify-center h-screen mt-0 max-w-3xl mx-auto w-full overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
      {/* Two notes side by side on desktop */}
        <div className="flex flex-col md:flex-row md:space-x-8 items-center md:items-start justify-center md:justify-between gap-6 md:gap-0">
          {/* Sticky Note 2 */}
          <div className={`sticky-note bg-yellow-50 p-5 rounded shadow-lg transform rotate-[2deg] w-[280px] relative z-30 hover:z-50 transition-all duration-300 hover:shadow-xl ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-500`}>
            {/* Right-oriented tape */}
            <div className="absolute -top-5 right-[40px] w-[70px] h-[30px]">
              <Image
                src="https://www.freeiconspng.com/uploads/scotch-tape-png-25.png"
                alt="Tape"
                width={70}
                height={30}
                className="object-contain transform rotate-[15deg] scale-x-[-1]"
              />
            </div>
            <p className="mb-4">
              My interests span operating systems, competitive programming, competitive mathematics, generative AI, linguistics, open source, and open science.
              I'm also extremely interested in startups and I'm a Kleiner Perkins Engineering Fellow.            </p>
          </div>

          {/* Sticky Note 3 */}
          <div className={`sticky-note bg-blue-50 p-5 rounded shadow-lg transform rotate-[-2deg] w-[280px] relative z-20 hover:z-50 transition-all duration-300 hover:shadow-xl ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-700`}>
            {/* Center tape */}
            <div className="absolute -top-5 left-[85px] w-[70px] h-[30px]">
              <Image
                src="https://www.freeiconspng.com/uploads/scotch-tape-png-25.png"
                alt="Tape"
                width={70}
                height={30}
                className="object-contain transform rotate-[-8deg]"
              />
            </div>
            <p className="mb-4">
              Beyond STEM, I love RPG development, collecting diecast cars, fashion, film, and music (my {musicStatus === 'playing' ? 'currently playing' : 'recently played'} song is at the top).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
