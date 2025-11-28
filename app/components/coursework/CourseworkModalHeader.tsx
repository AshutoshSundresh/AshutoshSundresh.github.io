/**
 * Header component for the Coursework Modal
 */

import { ReactNode } from 'react';

interface CourseworkModalHeaderProps {
  onClose: () => void;
  children?: ReactNode;
}

export default function CourseworkModalHeader({ onClose, children }: CourseworkModalHeaderProps) {
  return (
    <div className="bg-gray-200 dark:bg-[#2b2b2b] px-4 py-2 flex items-center justify-between transition-colors relative">
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] active:bg-[#e6392f] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5f57]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-[#252525]"
          aria-label="Close"
          title="Close"
        >
          <span className="sr-only">Close</span>
        </button>
        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 cursor-not-allowed" aria-hidden="true"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 cursor-not-allowed" aria-hidden="true"></div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 text-sm text-gray-700 dark:text-gray-300 font-medium font-['Raleway'] tracking-tight hidden md:block">
        Coursework
      </div>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  );
}

