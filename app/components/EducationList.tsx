"use client";

import React, { memo } from 'react';
import type { EducationListProps } from '../types';
import Image from 'next/image';
import Link from 'next/link';

function EducationList({ educationData }: EducationListProps) {
  return (
    <div className="mt-4 space-y-6">
        {educationData.map((edu) => (
        <div key={edu.id} className="bg-white dark:bg-[#2b2b2b] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="bg-gray-50 dark:bg-[#202020] p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                <Image src={edu.icon} alt={edu.institution} fill sizes="48px" className="object-contain rounded-lg" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  <a href={edu.institutionLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {edu.institution}
                  </a>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {edu.degree && (
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{edu.degree}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
              </div>
            )}

            {edu.gpa && <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{edu.gpa}</p>}

            {edu.details.grades && (
              <div className="space-y-2">
                {edu.details.grades?.map((grade, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{grade.grade}</span>
                    <span className="font-medium dark:text-gray-300">{grade.score}</span>
                  </div>
                ))}
              </div>
            )}

            {edu.details.achievements && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Achievements</p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {edu.details.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {edu.details.subjects && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {edu.details.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-[#202020] rounded-md text-xs text-gray-600 dark:text-gray-400">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-4">
              {edu.details.courses && edu.details.courses.length > 0 && (
                <Link
                  href="/experience/coursework"
                  className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center transition-colors"
                >
                  View Coursework →
                </Link>
              )}
              {edu.archiveLink && (
                <a href={edu.archiveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center">
                  View Archive →
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(EducationList);
