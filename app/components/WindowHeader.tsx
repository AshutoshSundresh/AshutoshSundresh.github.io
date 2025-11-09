import React from 'react';
import Link from 'next/link';
import type { WindowHeaderProps } from '../types';

export default function WindowHeader({ onToggleLockscreen, onOpenTerminal }: WindowHeaderProps) {
  return (
    <div className="bg-gray-200 dark:bg-[#2b2b2b] px-4 py-2 flex items-center transition-colors">
      <div className="flex space-x-2">
        <Link href="/">
          <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"></div>
        </Link>
        <div
          className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
          onClick={onToggleLockscreen}
        ></div>
        <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" onClick={onOpenTerminal}></div>
      </div>

      <div className="flex-1 text-center text-sm text-gray-700 dark:text-gray-300 font-medium font-['Raleway']">Finder</div>

      <div className="w-16"></div>
    </div>
  );
}


