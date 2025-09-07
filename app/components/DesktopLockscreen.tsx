"use client";
import React from 'react';
import type { IOSLockscreenProps } from '../types';
import Image from 'next/image';
import useClock from '../hooks/useClock';

const Clock = ({ formatString }: { formatString: string }) => {
  const value = useClock(formatString);
  return <>{value}</>;
};

const DesktopLockscreen: React.FC<IOSLockscreenProps> = ({ onUnlock }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white backdrop-blur-10">
      <div className="flex flex-col items-center">
        <div className="text-6xl font-light mb-2">
          <Clock formatString="h:mm" />
        </div>
        <div className="text-xl mb-8">
          <Clock formatString="EEEE, MMMM d" />
        </div>

        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden">
          <Image
            src="/images/ashutosh.jpeg"
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-xl mb-3">Ashutosh Sundresh</div>

        <div className="text-sm text-gray-400 mb-4 text-center">
          What is the number of ways you can arrange the letters in the word Ashutosh?
        </div>

        <div className="w-64 mb-4">
          <input
            type="text"
            className="w-full bg-black/40 border border-gray-600 rounded-md py-2 px-3 text-white text-center"
            placeholder="Enter password"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const answer = parseInt(input.value, 10);
                if (answer === 10080) {
                  onUnlock();
                } else {
                  alert('Incorrect answer. Try again!');
                  input.value = '';
                }
              }
            }}
            autoFocus
          />
        </div>

        <div className="text-sm text-gray-400">Press Enter to unlock</div>
      </div>
    </div>
  );
};

export default DesktopLockscreen;


