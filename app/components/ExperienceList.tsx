"use client";

import React, { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import type { ExperienceListProps } from '../types';

function ExperienceList({ experienceData }: ExperienceListProps) {
  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([]);

  const toggleExperienceExpansion = useCallback((id: number) => {
    setExpandedExperiences(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  return (
    <div className="mt-4 space-y-6">
      {experienceData.map((exp) => (
        <div key={exp.id} className="bg-white dark:bg-[#2b2b2b] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="bg-gray-50 dark:bg-[#202020] p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                <Image src={exp.icon} alt={exp.company} fill sizes="48px" className="object-contain rounded-lg" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  <a href={exp.companyLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {exp.company}
                  </a>
                </h3>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-300">{exp.position}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{exp.location}</span>
                  <span className="mx-2">•</span>
                  <span>{exp.period}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {(exp.company === "Manav Rachna International Institute of Research and Studies" ? exp.description : exp.description.slice(0, expandedExperiences.includes(exp.id) ? undefined : 1)).map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {exp.description.length > 1 && exp.company !== "Manav Rachna International Institute of Research and Studies" && (
              <button onClick={() => toggleExperienceExpansion(exp.id)} className="mt-2 text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center">
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
