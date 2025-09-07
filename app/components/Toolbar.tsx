import React from 'react';

interface ToolbarProps {
  onBack: () => void;
  onForward: () => void;
  canBack: boolean;
  canForward: boolean;
  showArchive: boolean;
}

export default function Toolbar({ onBack, onForward, canBack, canForward, showArchive }: ToolbarProps) {
  return (
    <div className="bg-gray-100 px-2 py-1 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          disabled={!canBack}
          className={`text-xs px-2 py-1 rounded hover:bg-gray-200 font-['Raleway'] flex items-center ${!canBack ? 'text-gray-400 hover:bg-transparent cursor-not-allowed' : 'text-gray-700'}`}
        >
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={onForward}
          disabled={!canForward}
          className={`text-xs px-2 py-1 rounded hover:bg-gray-200 font-['Raleway'] flex items-center ${!canForward ? 'text-gray-400 hover:bg-transparent cursor-not-allowed' : 'text-gray-700'}`}
        >
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Forward
        </button>
      </div>

      {showArchive && (
        <a
          href="https://ashutoshsundresh.com/archive.html#extracurriculars"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-2 py-1 rounded hover:bg-gray-200 font-['Raleway'] text-gray-600 hover:text-gray-800"
        >
          View High School Archive →
        </a>
      )}
    </div>
  );
}


