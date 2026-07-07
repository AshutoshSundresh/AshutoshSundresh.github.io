import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableCard from './DraggableCard';
import GitHubContributions from './GitHubContributions';
import InterestPopup from './InterestPopup';

const LocationCard = dynamic(() => import('./LocationCard'), { ssr: false });
import FilmPopupContent from './FilmPopupContent';
import MusicPopupContent from './MusicPopupContent';
import DiecastCarsPopupContent from './DiecastCarsPopupContent';
import FashionPopupContent from './FashionPopupContent';
import HoverCursor from './HoverCursor';
import type { DragPosition, SkeumorphicInterestsData } from '../types';
import type { InterestName } from '../types/interestIcons';
import useIsMobile from '../hooks/useIsMobile';
import skeuData from '../data/skeumorphicInterests.json';

type Position = DragPosition;
type CursorKey = 'kp' | 'harvey' | 'brain' | 'shapeshiftos' | 'github' | 'fashion' | 'music' | 'games' | 'diecast' | 'film';

const CURSOR_MAP: Record<CursorKey, { text?: string; imageSrc: string }> = {
  kp:          { text: 'Kleiner Perkins', imageSrc: '/images/kleiner_perkins_logo_sm.webp' },
  harvey:      { text: 'Harvey',          imageSrc: '/images/harvey_ai_logo_sm.webp' },
  brain:       { text: 'Brain Co.',       imageSrc: '/images/brain_co_sm.webp' },
  shapeshiftos:{ text: 'ShapeShiftOS',    imageSrc: '/images/shapeshiftos_sm.webp' },
  github:      { text: 'GitHub',          imageSrc: '/images/github_sm.webp' },
  fashion:     {                          imageSrc: '/icons/games.gif' },
  music:       {                          imageSrc: '/icons/kirby_music.gif' },
  games:       {                          imageSrc: '/icons/Nintendo_3DS_Opening_and_Closing_1.gif' },
  diecast:     {                          imageSrc: '/icons/car.gif' },
  film:        {                          imageSrc: '/icons/films.gif' },
};

export default function IntroCards() {
  const [positions, setPositions] = useState<{ card1: Position; card2: Position; card3: Position; card4: Position }>({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 },
    card3: { x: 0, y: 0 },
    card4: { x: 0, y: 0 }
  });
  const [openInterest, setOpenInterest] = useState<InterestName | null>(null);
  const [activeCursor, setActiveCursor] = useState<CursorKey | null>(null);
  const isMobile = useIsMobile();

  const cursor = (key: CursorKey) => ({
    onMouseEnter: () => setActiveCursor(key),
    onMouseLeave: () => setActiveCursor(null),
  });

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
          <div className="backdrop-blur-xl bg-white/50 dark:bg-[#2A2A2A]/50 text-black dark:text-gray-100 p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[420px] lg:h-[180px] relative border border-gray-200 dark:border-gray-700 shadow-lg lg:flex lg:items-center" data-search-title="About — Overview">
            <div className="relative z-10">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-md">
                I build systems and infra. CS at UCLA,{' '}
                <a
                  href="https://fellows.kleinerperkins.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors blur-on-hover cursor-none"
                  {...cursor('kp')}
                >
                  Kleiner Perkins Fellow
                </a>
                , researching PGO compiler artifact reuse for serverless, first early career AI Platform Engineer at{' '}
                <a
                  href="https://brain.co/blog/introducing-brain-co-9gk9a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors blur-on-hover cursor-none"
                  {...cursor('brain')}
                >
                  Brain Co.
                </a>
                , previously at{' '}
                <a
                  href="https://harvey.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors blur-on-hover cursor-none"
                  {...cursor('harvey')}
                >
                  Harvey
                </a>
                . Founded{' '}
                <a
                  href="https://github.com/shapeshiftos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-pink-400 hover:text-purple-500 dark:hover:text-pink-300 transition-colors blur-on-hover cursor-none"
                  {...cursor('shapeshiftos')}
                >
                  ShapeShiftOS
                </a>
                , a mobile operating system with 160K+ downloads across 160 countries.
              </p>
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
          <a href="https://github.com/AshutoshSundresh" target="_blank" rel="noopener noreferrer" className="block cursor-none" {...cursor('github')}>
            <div data-search-title="About — GitHub contributions">
              <GitHubContributions />
            </div>
          </a>
        </DraggableCard>

        <DraggableCard id="card2" position={positions.card2} isDraggingDisabled={isMobile}>
          <div className="backdrop-blur-xl bg-white/50 dark:bg-[#2A2A2A]/50 text-black dark:text-gray-100 p-4 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[420px] relative hidden [@media(min-width:768px)]:block [@media(min-height:770px)_and_(max-width:767px)]:block border border-gray-200 dark:border-gray-700 shadow-lg lg:flex lg:items-center" data-search-title="About — Interests">
            <div className="relative z-10 w-full">
              <div className="mb-2">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span>Fun</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">(click to read more)</span>
                </div>
              </div>
              <div
                className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex flex-wrap gap-1.5"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenInterest('Fashion' as InterestName); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30 hover:bg-purple-500/30 dark:hover:bg-pink-500/30 transition-colors cursor-none pointer-events-auto relative z-10 blur-on-hover"
                  {...cursor('fashion')}
                >
                  Fashion
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenInterest('Music' as InterestName); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30 hover:bg-purple-500/30 dark:hover:bg-pink-500/30 transition-colors cursor-none pointer-events-auto relative z-10 blur-on-hover"
                  {...cursor('music')}
                >
                  Music
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenInterest('Games' as InterestName); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30 hover:bg-purple-500/30 dark:hover:bg-pink-500/30 transition-colors cursor-none pointer-events-auto relative z-10 blur-on-hover"
                  {...cursor('games')}
                >
                  Games
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenInterest('Diecast Cars' as InterestName); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30 hover:bg-purple-500/30 dark:hover:bg-pink-500/30 transition-colors cursor-none pointer-events-auto relative z-10 blur-on-hover"
                  {...cursor('diecast')}
                >
                  Diecast Cars
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenInterest('Film' as InterestName); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-purple-500/20 dark:bg-pink-500/20 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-300/30 dark:border-pink-400/30 hover:bg-purple-500/30 dark:hover:bg-pink-500/30 transition-colors cursor-none pointer-events-auto relative z-10 blur-on-hover"
                  {...cursor('film')}
                >
                  Film
                </button>
              </div>
            </div>
          </div>
        </DraggableCard>
      </div>

      {activeCursor && (
        <HoverCursor
          text={CURSOR_MAP[activeCursor].text}
          imageSrc={CURSOR_MAP[activeCursor].imageSrc}
        />
      )}

      <InterestPopup
        open={openInterest !== null}
        onClose={() => setOpenInterest(null)}
        interestName={openInterest!}
        content={openInterest ? ((skeuData as SkeumorphicInterestsData).interests?.[openInterest] || `Content for ${openInterest} will be added here.`) : ''}
        customBody={openInterest === 'Film' ? <FilmPopupContent /> : openInterest === 'Music' ? <MusicPopupContent /> : openInterest === 'Diecast Cars' ? <DiecastCarsPopupContent /> : openInterest === 'Fashion' ? <FashionPopupContent /> : undefined}
      />
    </DndContext>
  );
}
