"use client";

import React, { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import type { ExperienceListProps } from '../types';
import { getBlurDataURL } from '../constants/blurPlaceholder';

function ExperienceList({ experienceData, isMobile = false }: ExperienceListProps) {
  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([]);

  const toggleExperienceExpansion = useCallback((id: number) => {
    setExpandedExperiences(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  return (
    <div className={`${isMobile ? 'space-y-4' : 'mt-4 space-y-6'}`}>
      {experienceData.map((exp) => (
        <div
          key={exp.id}
          className={`overflow-hidden transition-colors ${
            isMobile
              ? 'rounded-[22px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#151922] dark:shadow-none'
              : 'rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2b2b2b]'
          }`}
        >
          <div className={`${isMobile ? 'p-5' : 'border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#202020]'}`}>
            <div className="flex items-start">
              <div className={`${isMobile ? 'mr-4 h-14 w-14' : 'mr-4 h-12 w-12'} relative flex-shrink-0`}>
                <Image src={exp.icon} alt={exp.company} fill sizes="48px" placeholder="blur" blurDataURL={getBlurDataURL(exp.icon)} className="object-contain rounded-lg" />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-[1.05rem]' : 'text-lg'} font-medium text-gray-900 dark:text-gray-200`}>
                  <a href={exp.companyLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {exp.company}
                  </a>
                </h3>
                <p className={`${isMobile ? 'mt-0.5 text-[0.95rem]' : 'text-sm'} font-medium text-gray-800 dark:text-gray-300`}>{exp.position}</p>
                <div className={`mt-1 flex ${isMobile ? 'flex-wrap gap-x-2 gap-y-1 text-[0.8rem]' : 'items-center text-sm'} text-gray-500 dark:text-gray-400`}>
                  {exp.location && (
                    <>
                      <span>{exp.location}</span>
                      {!isMobile && <span className="mx-2">•</span>}
                    </>
                  )}
                  <span>{exp.period}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={isMobile ? 'px-5 pb-5' : 'p-4'}>
            <ul className={`${isMobile ? 'space-y-2.5 text-[0.92rem]' : 'space-y-2 text-sm'} text-gray-600 dark:text-gray-400`}>
              {(exp.company === "Manav Rachna International Institute of Research and Studies" ? exp.description : exp.description.slice(0, expandedExperiences.includes(exp.id) ? undefined : 1)).map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className={`mr-2 mt-1.5 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-500 ${isMobile ? 'h-1.5 w-1.5' : 'h-1.5 w-1.5'}`}></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {exp.description.length > 1 && exp.company !== "Manav Rachna International Institute of Research and Studies" && (
              <button
                onClick={() => toggleExperienceExpansion(exp.id)}
                className={`${isMobile ? 'mt-3 text-[0.9rem]' : 'mt-2 text-sm'} flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300`}
              >
                {expandedExperiences.includes(exp.id) ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Show less
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(ExperienceList);
