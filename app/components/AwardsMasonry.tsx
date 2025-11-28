"use client";

import React, { memo, useState } from 'react';
import type { AwardsMasonryProps } from '../types';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function AwardsMasonry({ awardsData }: AwardsMasonryProps) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-4 space-y-8">
      {awardsData.map((category) => (
        <div key={category.id} className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 font-['Raleway']">{category.category}</h3>
          <div className="columns-1 md:columns-2 gap-3 [column-fill:_balance]">
            {category.awards.map((award, index) => {
              const imageKey = `${category.id}-${index}`;
              const CardInner = (
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#202020] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {!loadedImages[imageKey] && <Skeleton height="100%" width="100%" containerClassName="h-full w-full block absolute top-0 left-0" />}
                      <Image 
                        src={award.icon} 
                        alt={award.title} 
                        fill 
                        sizes="40px" 
                        className={`object-contain rounded-lg transition-opacity duration-300 ${loadedImages[imageKey] ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(imageKey)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-200">{award.title}</h3>
                      </div>
                      {award.subtitle && <div className="text-xs text-gray-500 dark:text-gray-400">{award.subtitle}</div>}
                    </div>
                    {(award.highlight || award.stats) && (
                      <div className="text-right ml-2 shrink-0 w-32 sm:w-40 whitespace-normal break-words leading-tight">
                        {award.highlight && <div className="text-base font-medium text-gray-900 dark:text-gray-200">{award.highlight}</div>}
                        {award.stats && <div className="text-xs text-gray-500 dark:text-gray-400">{award.stats}</div>}
                      </div>
                    )}
                  </div>
                  {award.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: award.description }}></p>}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{award.year}</span>
                    {award.link && (
                      <a href={award.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50/0 dark:bg-blue-900/0 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                        <span>View</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );

              return (
                <div key={index} className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors break-inside-avoid mb-2 last:mb-0">
                  {CardInner}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(AwardsMasonry);
