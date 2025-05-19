"use client";

import Image from "next/image"
import NowPlaying from "./NowPlaying"

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default function PersonalIntro() {
  const scrollToNext = () => {
    const currentSection = document.querySelector('#personal-intro');
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div id="personal-intro" className="relative h-[100dvh] flex flex-col items-center justify-center bg-white p-4 md:p-8 snap-start snap-always">
      <NowPlaying />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center text-center md:text-left md:justify-start gap-2">
          {/* First line */}
          <span className="text-5xl md:text-6xl text-gray-900 font-bold animate-gradient bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text">Hey, I'm</span>

          <div className="relative w-16 h-16 mx-2">
            <div
              className="w-16 h-16 rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 duration-300"
              style={{
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 z-10 pointer-events-none"></div>
              <Image
                src="https://raw.githubusercontent.com/AshutoshSundresh/AshutoshSundresh.github.io/main/pages/ashutosh.webp"
                alt="Profile photo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <span className="text-5xl md:text-6xl font-normal animate-gradient bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 text-transparent bg-clip-text">Ashutosh Sundresh</span>
        </div>

        {/* Second line */}
        <div className="flex flex-wrap items-center justify-center text-center md:text-left md:justify-start gap-2 mt-2">
          <span className="text-5xl md:text-6xl">
          <span className="text-5xl md:text-6xl text-gray-500 font-light animate-gradient bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 text-transparent bg-clip-text">a </span>
            <span className="font-array text-[50px] md:text-[60px] animate-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Computer Science major
            </span>
          </span>

          <span className="text-5xl md:text-6xl text-gray-500 font-light animate-gradient bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 text-transparent bg-clip-text">at</span>

          <div className="relative w-16 h-16 mx-2">
            <div
              className="w-16 h-16 rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 duration-300"
              style={{
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 z-10 pointer-events-none"></div>
              <Image
                src="https://raw.githubusercontent.com/AshutoshSundresh/AshutoshSundresh.github.io/main/pages/UCLA-square-logo.jpg"
                alt="Profile photo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="https://twitter.com/asundresh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-gray-600 rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide"
          >
            X
          </a>
          <a
            href="https://github.com/ashutoshsundresh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-gray-600 rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/asund"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-gray-600 rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}