'use client';

import { useRef, useState } from 'react';
import { ChevronDown, Dices } from 'lucide-react';
import { HERO_TIMELINE, formatTimelineHeading } from '../data/heroTimeline';

const OLYMPIAD_PATTERN = /\b(olympiad|olympiads|SEAMO|APLO|ASMO|HKIMO|Fermat|Mathelogics|Math Day)\b/i;

/** Build a weighted index array: olympiad entries get weight 1, everything else weight 3. */
const WEIGHTED_POOL: number[] = HERO_TIMELINE.flatMap((entry, i) =>
  OLYMPIAD_PATTERN.test(entry.sentence) ? [i] : [i, i, i]
);

interface HeroTimelinePillProps {
  onScrollNext: () => void;
}

const tickerText =
  'text-left text-xs md:text-[13px] text-gray-700 dark:text-gray-200 font-light whitespace-nowrap';

function TickerSentence({ text, tickerKey }: { text: string; tickerKey: number }) {
  return (
    <>
      <div className="relative w-full min-h-[1.35rem] flex items-center overflow-hidden motion-reduce:hidden">
        <div key={tickerKey} className="hero-ticker-track">
          <span className={`inline-block shrink-0 ${tickerText} pr-10`}>{text}</span>
          <span className={`inline-block shrink-0 ${tickerText} pr-10`} aria-hidden>
            {text}
          </span>
        </div>
      </div>
      <p
        className={`hidden motion-reduce:block truncate w-full min-h-[1.35rem] min-w-0 ${tickerText}`}
        title={text}
      >
        {text}
      </p>
    </>
  );
}

const BLACKLIST_SIZE = 10;

export default function HeroTimelinePill({ onScrollNext }: HeroTimelinePillProps) {
  const [index, setIndex] = useState(0);
  const [tickerKey, setTickerKey] = useState(0);
  const recentRef = useRef<number[]>([0]);
  const entry = HERO_TIMELINE[index];

  const randomize = () => {
    if (WEIGHTED_POOL.length <= 1) return;
    const blacklist = new Set(recentRef.current);
    const pool = WEIGHTED_POOL.filter((i) => !blacklist.has(i));
    const source = pool.length > 0 ? pool : WEIGHTED_POOL;
    const next = source[Math.floor(Math.random() * source.length)];
    recentRef.current = [...recentRef.current.slice(-(BLACKLIST_SIZE - 1)), next];
    setIndex(next);
    setTickerKey((k) => k + 1);
  };

  if (!entry) return null;

  return (
    <div
      className="hero-pill-container flex items-stretch rounded-full border border-gray-200/50 dark:border-gray-700/50 bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-300"
    >
      {/* Text area — hidden on mobile, flex on md+ */}
      <div className="hero-pill-content min-w-0 flex-1 px-4 py-2.5 items-center gap-2">
        <time
          dateTime={entry.sortKey}
          className="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 tabular-nums"
        >
          {formatTimelineHeading(entry.sortKey)}
        </time>
        <span
          className="shrink-0 text-gray-400 dark:text-gray-500 text-sm leading-none select-none"
          aria-hidden
        >
          ·
        </span>
        <div className="min-w-0 flex-1">
          <TickerSentence text={entry.sentence} tickerKey={tickerKey} />
        </div>
      </div>
      {/* border-l only visible on md+ when text area is present */}
      <div className="hero-pill-border-l flex shrink-0 border-gray-200/60 dark:border-gray-600/60">
        <button
          type="button"
          onClick={onScrollNext}
          className="flex h-full items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer blur-on-hover px-4 py-3 md:py-0 md:px-3 md:w-12"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={randomize}
          className="hero-dice-btn h-full w-12 items-center justify-center text-gray-700 dark:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-colors border-l border-gray-200/60 dark:border-gray-600/60 cursor-pointer blur-on-hover"
          aria-label="Show random milestone"
        >
          <Dices className="h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={1.65} aria-hidden />
        </button>
      </div>
    </div>
  );
}
