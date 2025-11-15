/**
 * Mobile horizontal quarter selector component
 */

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
  return (
    <div className="md:hidden bg-white dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 overflow-x-auto mobile-quarter-selector" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex gap-4 px-4 py-3 min-w-max">
        {years.map((year) => (
          <div key={year} className="flex flex-col gap-2 flex-shrink-0">
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
        ))}
      </div>
    </div>
  );
}

