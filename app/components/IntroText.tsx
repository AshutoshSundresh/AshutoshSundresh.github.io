"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import NowPlaying from "./NowPlaying";
import GameOfLife from "./GameOfLife";
import { DndContext, useDraggable, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import GitHubContributions from "./GitHubContributions";

interface Position {
  x: number;
  y: number;
}

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  position: Position;
}

function DraggableCard({ id, children, position }: DraggableCardProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });
  
  const style = {
    transform: `translate3d(${position.x + (transform?.x ?? 0)}px, ${position.y + (transform?.y ?? 0)}px, 0)`,
    touchAction: 'none'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

interface Positions {
  card1: Position;
  card2: Position;
  card3: Position;
}

export default function IntroText() {
  const [isVisible, setIsVisible] = useState(false);
  const [musicStatus, setMusicStatus] = useState<'playing' | 'recent' | null>(null);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; artist: string } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Positions>({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 },
    card3: { x: 0, y: 0 }
  });

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
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id as keyof Positions;
    
    setPositions(prev => ({
      ...prev,
      [id]: {
        x: prev[id].x + delta.x,
        y: prev[id].y + delta.y
      }
    }));
  };

  return (
    <div 
      id="intro-text" 
      ref={sectionRef}
      className={`relative min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 font-raleway transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: '#ffffff'
      }}
    >
      <GameOfLife />
      <div className="absolute top-4 w-full flex justify-center z-10">
        <NowPlaying 
          onStatusChange={setMusicStatus} 
          onTrackChange={setCurrentTrack}
        />
      </div>
      <div className={`flex items-center justify-center w-full max-w-4xl mx-auto overflow-visible transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0' : 'translate-y-10'} relative z-10`}>
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 [@media(max-width:767px)_and_(max-height:800px)]:gap-1 gap-4 md:gap-4 lg:gap-8 place-items-center w-full px-4">
            <div className="lg:row-span-2">
              <DraggableCard id="card1" position={positions.card1}>
                <div className={`bg-black text-white p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[360px] relative cursor-move touch-none shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'} transition-all duration-700 delay-500 hover:shadow-xl`}>
                  <p className="text-gray-300 leading-relaxed text-md">
                    I currently study Computer Science at UCLA. 
                  </p>
                  <p className="text-gray-300 leading-relaxed text-md">
                    I'm particularly interested in product engineering, generative AI, operating systems/computer systems (built <a href="https://shapeshiftos.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">ShapeShiftOS</a>), startups (<a href="https://fellows.kleinerperkins.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Kleiner Perkins Fellows</a>), and linguistics (went to <a href="https://en.wikipedia.org/wiki/International_Linguistics_Olympiad" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">International Linguistics Olympiad Camp</a>).
                  </p>
                </div>
              </DraggableCard>
            </div>

            <DraggableCard id="card2" position={positions.card2}>
              <div className={`bg-black text-white p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[360px] relative cursor-move touch-none shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'} transition-all duration-700 delay-700 hover:shadow-xl hidden [@media(min-width:768px)]:block [@media(min-height:800px)_and_(max-width:767px)]:block`}>
                <div className="mb-2">
                  <div className="text-lg font-medium text-gray-400">Interests</div>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed flex flex-wrap gap-1.5">
                  <span className="bg-purple-500/20 px-3 py-1 rounded-full">RPG Development</span>
                  <span className="bg-purple-500/20 px-3 py-1 rounded-full">Diecast Cars</span>
                  <span className="bg-purple-500/20 px-3 py-1 rounded-full">Fashion</span>
                  <span className="bg-purple-500/20 px-3 py-1 rounded-full">Film</span>
                  <span className="bg-purple-500/20 px-3 py-1 rounded-full">Music</span>
                </div>
              </div>
            </DraggableCard>

            <DraggableCard id="card3" position={positions.card3}>
              <a 
                href="https://github.com/AshutoshSundresh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <GitHubContributions />
              </a>
            </DraggableCard>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
