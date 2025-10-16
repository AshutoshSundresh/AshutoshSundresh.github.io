"use client";

import React, { memo } from 'react';
import type { AwardsMasonryProps } from '../types';
import Image from 'next/image';

function AwardsMasonry({ awardsData }: AwardsMasonryProps) {
  return (
    <div className="mt-4 space-y-8">
      {awardsData.map((category) => (
        <div key={category.id} className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 font-['Raleway']">{category.category}</h3>
          <div className="columns-1 md:columns-2 gap-3 [column-fill:_balance]">
            {category.awards.map((award, index) => {
              const CardInner = (
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <Image src={award.icon} alt={award.title} fill sizes="40px" className="object-contain rounded-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-gray-900">{award.title}</h3>
                      </div>
                      {award.subtitle && <div className="text-xs text-gray-500">{award.subtitle}</div>}
                    </div>
                    {(award.highlight || award.stats) && (
                      <div className="text-right ml-2 shrink-0 w-32 sm:w-40 whitespace-normal break-words leading-tight">
                        {award.highlight && <div className="text-base font-medium text-gray-900">{award.highlight}</div>}
                        {award.stats && <div className="text-xs text-gray-500">{award.stats}</div>}
                      </div>
                    )}
                  </div>
                  {award.description && <p className="mt-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: award.description }}></p>}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{award.year}</span>
                    {award.link && (
                      <a href={award.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-blue-600 bg-blue-50/0 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
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
                <div key={index} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors break-inside-avoid mb-2 last:mb-0">
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
