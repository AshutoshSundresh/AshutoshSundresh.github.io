"use client";

export default function IntroText() {
  const scrollToNext = () => {
    const currentSection = document.querySelector('#intro-text');
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div id="intro-text" className="relative h-screen flex flex-col items-center responsive-justify bg-white p-4 md:p-8 font-raleway">
      <div className="mt-16 md:mt-0 space-y-8 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
        <p className="animate-fadeIn">
        I'm an undergraduate Computer Science student at UCLA Henry Samueli School of Engineering. 
        <br /><br />
        My interests span operating systems, competitive programming, competitive mathematics, linguistics, open source, and open science.
        </p>
        
        <p className="animate-fadeIn animation-delay-300">
        Beyond STEM, I love RPG development, collecting diecast cars, fashion, film, and music.
        <br /><br /> I see each project as an opportunity to transform complex technical challenges into something that is fundamentally elegant and seamless.


        </p>
      </div>
    </div>
  );
}
