/**
 * Sidebar component for selecting year and quarter
 */

interface CourseworkSidebarProps {
  years: number[];
  quartersByYear: Record<number, string[]>;
  selectedYear: number | null;
  selectedQuarter: string | null;
  onYearQuarterChange: (year: number, quarter: string) => void;
}

export default function CourseworkSidebar({
  years,
  quartersByYear,
  selectedYear,
  selectedQuarter,
  onYearQuarterChange,
}: CourseworkSidebarProps) {
  return (
    <div className="w-72 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-700/50 overflow-y-auto transition-colors">
      <div className="p-6 space-y-8">
        {years.map((year) => (
          <div key={year} className="space-y-3">
            <div className="px-2">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {year}
              </div>
            </div>
            {quartersByYear[year] && (
              <div className="space-y-1">
                {quartersByYear[year].map((quarter) => {
                  const isSelected = selectedYear === year && selectedQuarter === quarter;
                  return (
                    <label
                      key={quarter}
                      className={`flex items-center cursor-pointer group px-3 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name={`quarter-${year}`}
                          checked={isSelected}
                          onChange={() => {
                            onYearQuarterChange(year, quarter);
                          }}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className={`ml-3 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                      }`}>
                        {quarter}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

