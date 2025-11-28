/**
 * Major filter dropdown component
 * Matches the styling of ViewToggle switch component
 */

import { DEFAULT_MAJOR_FILTER, ALL_MAJORS_LABEL } from '../../utils/courseUtils';

interface MajorFilterProps {
  majors: string[];
  selectedMajor: string;
  onMajorChange: (major: string) => void;
}

export default function MajorFilter({
  majors,
  selectedMajor,
  onMajorChange,
}: MajorFilterProps) {
  return (
    <div className="relative inline-flex bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg p-1 shadow-inner">
      <div className="relative">
        <select
          value={selectedMajor}
          onChange={(e) => onMajorChange(e.target.value)}
          className="appearance-none bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 pl-3 pr-8 py-1.5 text-xs font-medium cursor-pointer focus:outline-none"
        >
          <option value={DEFAULT_MAJOR_FILTER}>{ALL_MAJORS_LABEL}</option>
          {majors.map(major => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

