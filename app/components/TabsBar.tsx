import React from 'react';
import type { TabsBarProps } from '../types';
import { COLOR_COMBINATIONS } from '../constants/colors';

export default function TabsBar({ tabs, activeTab, isMobile, showMobileMenu, onToggleMobileMenu, onSelect, mobileMenuRef }: TabsBarProps) {
  return (
    <div className="bg-gray-100 dark:bg-[#202020] border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center">
        <div className="flex-1 flex">
          {tabs.slice(0, isMobile ? 3 : undefined).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'text-gray-900 dark:text-white border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {isMobile && (
          <div className="relative" ref={mobileMenuRef}>
            <button onClick={onToggleMobileMenu} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16"
                  className={activeTab === 3 ? 'text-blue-500' : ''}
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12h16"
                  className={activeTab === 4 ? 'text-blue-500' : ''}
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 18h16"
                  className={activeTab === 5 ? 'text-blue-500' : ''}
                />
              </svg>
            </button>

            {showMobileMenu && (
              <div 
                className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-700 py-1 z-50"
                style={{ boxShadow: `0 1px 3px ${COLOR_COMBINATIONS.shadows.light}` }}
              >
                {tabs.slice(3).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelect(tab.id);
                      onToggleMobileMenu();
                    }}
                    className={`w-full px-4 py-2 text-sm text-left ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


