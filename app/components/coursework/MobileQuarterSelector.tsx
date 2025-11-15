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
      className="md:hidden bg-white dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 overflow-x-auto mobile-quarter-selector" 
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="flex gap-4 px-4 py-3 min-w-max">
        {years.map((year, index) => (
          <div key={year} className="flex items-start gap-4 flex-shrink-0">
            {index > 0 && (
              <div className="h-12 w-px bg-gray-200 dark:bg-gray-700/50 mt-6 flex-shrink-0" />
            )}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                {year}
              </div>
              <div className="flex gap-2">
                {quartersByYear[year]?.map((quarter) => {
                  const isSelected = selectedYear === year && selectedQuarter === quarter;
                  return (
                    <button
                      key={quarter}
                      onClick={() => onYearQuarterChange(year, quarter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-[#333333]'
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

