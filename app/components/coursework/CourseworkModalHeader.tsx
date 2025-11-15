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
    <div className="bg-gray-50 dark:bg-[#252525] px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 transition-colors relative">
      <div className="flex items-center gap-4">
        {children}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 text-sm text-gray-800 dark:text-gray-200 font-semibold tracking-tight hidden md:block">
        Coursework
      </div>
      <button
        onClick={onClose}
        className="px-5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 cursor-pointer text-white text-xs font-medium transition-colors"
        aria-label="Exit"
      >
        Exit
      </button>
    </div>
  );
}

