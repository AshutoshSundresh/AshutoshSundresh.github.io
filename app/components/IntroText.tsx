"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import NowPlaying from "./NowPlaying";
import GameOfLife from "./GameOfLife";
import { DndContext, useDraggable, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
}

export default function IntroText() {
  const [isVisible, setIsVisible] = useState(false);
  const [musicStatus, setMusicStatus] = useState<'playing' | 'recent' | null>(null);
  const [currentTrack, setCurrentTrack] = useState<{ name: string; artist: string } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Positions>({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center w-full px-4">
            <DraggableCard id="card1" position={positions.card1}>
              <div className={`bg-black text-white p-6 rounded-3xl w-[300px] relative cursor-move touch-none shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'} transition-all duration-700 delay-500 hover:shadow-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-medium">Technical</div>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  My interests span operating systems, competitive programming, competitive mathematics, generative AI, linguistics, open source, and open science.
                  I'm also extremely interested in startups and I'm a Kleiner Perkins Engineering Fellow.
                </p>
              </div>
            </DraggableCard>

            <DraggableCard id="card2" position={positions.card2}>
              <div className={`bg-black text-white p-6 rounded-3xl w-[300px] relative cursor-move touch-none shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'} transition-all duration-700 delay-700 hover:shadow-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-medium">Creative</div>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Beyond STEM, I love RPG development, collecting diecast cars, fashion, film, and music{currentTrack ? ` (I ${musicStatus === 'playing' ? 'am currently listening to' : 'was listening to'} ${currentTrack.name} by ${currentTrack.artist}).` : '.'}
                </p>
              </div>
            </DraggableCard>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
