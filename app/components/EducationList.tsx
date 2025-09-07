"use client";

import React, { memo } from 'react';
import type { EducationListProps } from '../types';
import Image from 'next/image';

function EducationList({ educationData }: EducationListProps) {
  return (
    <div className="mt-4 space-y-6">
      {educationData.map((edu) => (
        <div key={edu.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4 relative">
                <Image src={edu.icon} alt={edu.institution} fill sizes="48px" className="object-contain rounded-lg" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={edu.institutionLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    {edu.institution}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">{edu.period}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {edu.degree && (
              <div>
                <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.school}</p>
              </div>
            )}

            {edu.gpa && <p className="text-sm font-medium text-gray-900">{edu.gpa}</p>}

            {edu.details.grades && (
              <div className="space-y-2">
                {edu.details.grades?.map((grade, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{grade.grade}</span>
                    <span className="font-medium">{grade.score}</span>
                  </div>
                ))}
              </div>
            )}

            {edu.details.achievements && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Achievements</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {edu.details.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {edu.details.subjects && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {edu.details.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-4">
              {edu.courseLink && (
                <a href={edu.courseLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                  View Coursework →
                </a>
              )}
              {edu.archiveLink && (
                <a href={edu.archiveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
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
