/**
 * Mobile horizontal quarter selector component
 */

import { useEffect, useRef } from 'react';

interface MobileQuarterSelectorProps {
  years: number[];
  quartersByYear: Record<number, string[]>;
  selectedYear: number | null;
  selectedQuarter: string | null;
  onYearQuarterChange: (year: number, quarter: string) => void;
}

export default function MobileQuarterSelector({
  years,
  quartersByYear,
  selectedYear,
  selectedQuarter,
  onYearQuarterChange,
}: MobileQuarterSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the right (most recent year) on initial load
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="md:hidden overflow-x-auto mobile-quarter-selector" 
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="flex gap-4 px-2 py-2 min-w-max">
        {years.map((year, index) => (
          <div key={year} className="flex items-start gap-4 flex-shrink-0">
            {index > 0 && (
              <div className="h-12 w-px bg-gray-200 dark:bg-gray-700/50 mt-6 flex-shrink-0" />
            )}
            <div className="flex flex-col gap-2">
              <div className="text-[0.68rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em] px-2">
                {year}
              </div>
              <div className="flex gap-2">
                {quartersByYear[year]?.map((quarter) => {
                  const isSelected = selectedYear === year && selectedQuarter === quarter;
                  return (
                    <button
                      key={quarter}
                      onClick={() => onYearQuarterChange(year, quarter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#007aff] text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 dark:bg-[#171922] dark:border-white/8 dark:text-gray-300 active:bg-gray-100 dark:active:bg-[#20242d]'
                      }`}
                    >
                      {quarter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

