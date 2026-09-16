'use client';

import { memo, useCallback, useReducer, useRef } from 'react';
import { ChevronDown, Dices } from 'lucide-react';
import { HERO_TIMELINE, formatTimelineHeading } from '../data/heroTimeline';

const OLYMPIAD_PATTERN = /\b(olympiad|olympiads|SEAMO|APLO|ASMO|HKIMO|Fermat|Mathelogics|Math Day)\b/i;

/** Build a weighted index array: olympiad entries get weight 1, everything else weight 3. */
const WEIGHTED_POOL: number[] = HERO_TIMELINE.flatMap((entry, i) =>
  OLYMPIAD_PATTERN.test(entry.sentence) ? [i] : [i, i, i]
);

const BLACKLIST_SIZE = 10;

interface HeroTimelinePillProps {
  onScrollNext: () => void;
}

const tickerText =
  'text-left text-xs md:text-[13px] text-gray-700 dark:text-gray-200 font-light whitespace-nowrap';

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Plain form, for the title attribute and any non-visual use. */
function stripLinks(text: string): string {
  return text.replace(LINK_PATTERN, "$1");
}

/**
 * Renders inline `[label](url)` as anchors. The marquee paints a second,
 * aria-hidden copy of the sentence, so that copy takes `interactive: false`
 * to keep its duplicate links out of the tab order.
 */
function renderSentence(text: string, key: string, interactive: boolean) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(
      <a
        key={`${key}-${i}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={interactive ? undefined : -1}
        className="underline decoration-gray-400/70 underline-offset-2 transition-colors hover:text-gray-900 dark:decoration-gray-500/70 dark:hover:text-white"
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type PillState = { index: number; tickerKey: number };

function pillReducer(state: PillState, next: number): PillState {
  return { index: next, tickerKey: state.tickerKey + 1 };
}

const TickerSentence = memo(function TickerSentence({
  text,
  tickerKey,
}: {
  text: string;
  tickerKey: number;
}) {
  const plain = stripLinks(text);

  return (
    <>
      <div className="relative w-full min-h-[1.35rem] flex items-center overflow-hidden motion-reduce:hidden">
        <div key={tickerKey} className="hero-ticker-track">
          <span className={`inline-block shrink-0 ${tickerText} pr-10`}>
            {renderSentence(text, `a-${tickerKey}`, true)}
          </span>
          <span className={`inline-block shrink-0 ${tickerText} pr-10`} aria-hidden>
            {renderSentence(text, `b-${tickerKey}`, false)}
          </span>
        </div>
      </div>
      <p
        className={`hidden motion-reduce:block truncate w-full min-h-[1.35rem] min-w-0 ${tickerText}`}
        title={plain}
      >
        {renderSentence(text, `c-${tickerKey}`, true)}
      </p>
    </>
  );
});

const HeroTimelinePill = memo(function HeroTimelinePill({ onScrollNext }: HeroTimelinePillProps) {
  const [{ index, tickerKey }, dispatch] = useReducer(pillReducer, { index: 0, tickerKey: 0 });
  const recentRef = useRef<number[]>([0]);
  const entry = HERO_TIMELINE[index];

  const randomize = useCallback(() => {
    if (WEIGHTED_POOL.length <= 1) return;
    const blacklist = new Set(recentRef.current);
    const pool = WEIGHTED_POOL.filter((i) => !blacklist.has(i));
    const source = pool.length > 0 ? pool : WEIGHTED_POOL;
    const next = source[Math.floor(Math.random() * source.length)];
    recentRef.current = [...recentRef.current.slice(-(BLACKLIST_SIZE - 1)), next];
    dispatch(next);
  }, []);

  if (!entry) return null;

  return (
    <div className="hero-pill-container flex items-stretch rounded-full border border-gray-200/50 dark:border-gray-700/50 bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 backdrop-blur-md shadow-lg overflow-hidden transition-colors duration-300">
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
          onClick={randomize}
          className="hero-dice-btn h-full w-12 items-center justify-center text-gray-700 dark:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer blur-on-hover"
          aria-label="Show random milestone"
        >
          <Dices className="h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={1.65} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onScrollNext}
          className="flex h-full items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer blur-on-hover px-4 py-3 md:py-0 md:px-3 md:w-12 border-l border-gray-200/60 dark:border-gray-600/60"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
});

export default HeroTimelinePill;
