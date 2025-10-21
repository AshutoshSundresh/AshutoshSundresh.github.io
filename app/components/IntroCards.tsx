import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableCard from './DraggableCard';
import GitHubContributions from './GitHubContributions';
import type { DragPosition } from '../types';
import useIsMobile from '../hooks/useIsMobile';

type Position = DragPosition;

export default function IntroCards() {
  const [positions, setPositions] = useState<{ card1: Position; card2: Position; card3: Position }>({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 },
    card3: { x: 0, y: 0 }
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
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 [@media(max-width:767px)_and_(max-height:800px)]:gap-1 gap-4 md:gap-4 lg:gap-8 place-items-center w-full px-4">
        <div className="lg:row-span-2">
          <DraggableCard id="card1" position={positions.card1} isDraggingDisabled={isMobile}>
            <div className="backdrop-blur-xl bg-gradient-to-b from-white/20 to-white/10 text-black p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[360px] relative transition-all duration-700 delay-500 border-2 border-gray-300/40" data-search-title="About — Overview">
              <div className="relative z-10">
                <p className="text-gray-900 leading-relaxed text-md">I currently study Computer Science at UCLA.</p>
                <p className="text-gray-900 leading-relaxed text-md">I&apos;m particularly interested in product engineering, generative AI, operating systems/computer systems (built <a href="https://shapeshiftos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">ShapeShiftOS</a>), startups (<a href="https://fellows.kleinerperkins.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">Kleiner Perkins Engineering Fellow</a>), and linguistics (went to <a href="https://en.wikipedia.org/wiki/International_Linguistics_Olympiad" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">International Linguistics Olympiad Camp</a>).</p>
              </div>
            </div>
          </DraggableCard>
        </div>

        <DraggableCard id="card2" position={positions.card2} isDraggingDisabled={isMobile}>
          <div className="backdrop-blur-xl bg-gradient-to-b from-white/20 to-white/10 text-black p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[360px] relative transition-all duration-700 delay-700 hidden [@media(min-width:768px)]:block [@media(min-height:770px)_and_(max-width:767px)]:block border-2 border-gray-300/40" data-search-title="About — Interests">
            <div className="relative z-10">
              <div className="mb-2">
                <div className="text-lg font-medium text-gray-900">Fun</div>
              </div>
              <div className="text-gray-900 text-sm leading-relaxed flex flex-wrap gap-1.5">
                <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full">RPG Development</span>
                <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full">Diecast Cars</span>
                <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full">Fashion</span>
                <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full">Film</span>
                <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full">Music</span>
              </div>
            </div>
          </div>
        </DraggableCard>

        <DraggableCard id="card3" position={positions.card3} isDraggingDisabled={true}>
          <a href="https://github.com/AshutoshSundresh" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div data-search-title="About — GitHub contributions">
              <GitHubContributions />
            </div>
          </a>
        </DraggableCard>
      </div>
    </DndContext>
  );
}


