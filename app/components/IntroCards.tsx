import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableCard from './DraggableCard';
import GitHubContributions from './GitHubContributions';
import LocationCard from './LocationCard';
import type { DragPosition } from '../types';
import useIsMobile from '../hooks/useIsMobile';

type Position = DragPosition;

export default function IntroCards() {
  const [positions, setPositions] = useState<{ card1: Position; card2: Position; card3: Position; card4: Position }>({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 },
    card3: { x: 0, y: 0 },
    card4: { x: 0, y: 0 }
  });
  const isMobile = useIsMobile();

  const handleDragEnd = (event: DragEndEvent) => {
    if (isMobile) return;
    const { active, delta } = event;
    const id = active.id as keyof typeof positions;
    setPositions(prev => ({
      ...prev,
      [id]: { x: prev[id].x + delta.x, y: prev[id].y + delta.y }
    }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 [@media(max-width:767px)_and_(max-height:800px)]:gap-1 gap-5 md:gap-4 lg:gap-6 place-items-center w-full px-4 lg:max-w-[900px] mx-auto">
        {/* Top Row */}
        <DraggableCard id="card1" position={positions.card1} isDraggingDisabled={isMobile}>
          <div className="backdrop-blur-xl bg-white/50 dark:bg-[#2A2A2A]/50 text-black dark:text-gray-100 p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[420px] lg:h-[180px] relative transition-all duration-700 delay-500 border border-gray-200 dark:border-gray-700 shadow-lg lg:flex lg:items-center" data-search-title="About — Overview">
            <div className="relative z-10">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-md">Computer Science at UCLA.</p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-md">Focused on generative AI and systems-level engineering. Built <a href="https://github.com/shapeshiftos" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors underline">ShapeShiftOS</a>, work with startups as a <a href="https://fellows.kleinerperkins.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors underline">Kleiner Perkins Engineering Fellow</a>, and have a background in linguistics (<a href="https://en.wikipedia.org/wiki/International_Linguistics_Olympiad" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors underline">International Linguistics Olympiad Camp</a>).</p>
            </div>
          </div>
        </DraggableCard>
        <div className="hidden [@media(min-width:768px)]:block">
          <DraggableCard id="card4" position={positions.card4} isDraggingDisabled={isMobile}>
            <LocationCard />
          </DraggableCard>
        </div>

        {/* Bottom Row */}
        <DraggableCard id="card3" position={positions.card3} isDraggingDisabled={true}>
          <a href="https://github.com/AshutoshSundresh" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div data-search-title="About — GitHub contributions">
              <GitHubContributions />
            </div>
          </a>
        </DraggableCard>

        <DraggableCard id="card2" position={positions.card2} isDraggingDisabled={isMobile}>
          <div className="backdrop-blur-xl bg-white/50 dark:bg-[#2A2A2A]/50 text-black dark:text-gray-100 p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[420px] relative transition-all duration-700 delay-700 hidden [@media(min-width:768px)]:block [@media(min-height:770px)_and_(max-width:767px)]:block border border-gray-200 dark:border-gray-700 shadow-lg lg:flex lg:items-center" data-search-title="About — Interests">
            <div className="relative z-10 w-full">
              <div className="mb-2">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">Fun</div>
              </div>
              <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex flex-wrap gap-1.5">
                <span className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30">Fashion</span>
                <span className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30">Music</span>
                <span className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30">RPG Development</span>
                <span className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30">Diecast Cars</span>
                <span className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30">Film</span>
              </div>
            </div>
          </div>
        </DraggableCard>
      </div>
    </DndContext>
  );
}


