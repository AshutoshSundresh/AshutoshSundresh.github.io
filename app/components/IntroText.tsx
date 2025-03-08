"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function IntroText() {
  const [isVisible, setIsVisible] = useState(false);
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
      <div className={`mt-16 md:mt-0 max-w-3xl mx-auto w-full overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
        
        <div className="flex flex-wrap justify-center md:justify-start md:relative md:h-[500px] gap-6 md:gap-0 overflow-x-hidden" style={{ 
          msOverflowStyle: 'none', /* IE and Edge */
          scrollbarWidth: 'none', /* Firefox */
        }}>
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style jsx>{`
            .overflow-x-hidden::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Sticky Note 2 */}
          <div className={`sticky-note bg-white p-5 rounded shadow-lg transform rotate-[2deg] w-[280px] relative md:absolute md:top-[20px] md:left-[260px] z-30 hover:z-50 transition-all duration-300 hover:shadow-xl ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-500`}>
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
              My interests span operating systems, competitive programming, competitive mathematics, linguistics, open source, and open science.
            </p>
          </div>

          {/* Sticky Note 3 */}
          <div className={`sticky-note bg-white p-5 rounded shadow-lg transform rotate-[-2deg] w-[280px] relative md:absolute md:top-[160px] md:left-[40px] z-20 hover:z-50 transition-all duration-300 hover:shadow-xl ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-700`}>
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
              Beyond STEM, I love RPG development, collecting diecast cars, fashion, film, and music.
            </p>
          </div>

          {/* Sticky Note 4 */}
          <div className={`sticky-note bg-white p-5 rounded shadow-lg transform rotate-[1deg] w-[280px] relative md:absolute md:top-[230px] md:left-[370px] z-40 hover:z-50 transition-all duration-300 hover:shadow-xl ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-900`}>
            {/* Left-oriented tape */}
            <div className="absolute -top-5 left-[30px] w-[70px] h-[30px]">
              <Image
                src="https://www.freeiconspng.com/uploads/scotch-tape-png-25.png"
                alt="Tape"
                width={70}
                height={30}
                className="object-contain transform rotate-[5deg]"
              />
            </div>
            <p className="mb-4">
              I see each project as an opportunity to transform complex technical challenges into something that is fundamentally elegant and seamless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
