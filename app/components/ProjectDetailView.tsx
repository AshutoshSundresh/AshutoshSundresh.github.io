"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import type { ProjectDetailViewProps } from '../types';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProjectDetailView({ project, onClose, isMobile }: ProjectDetailViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      data-detail-view
      className={`
        ${isMobile
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#1e1e1e]'
          : 'absolute right-0 top-0 h-full w-72 z-20 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181818]'}
        overflow-y-auto transition-colors
      `}
    >
      {isMobile && (
        <div className="sticky top-0 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center transition-colors">
          <h3 className="text-sm font-medium font-['Raleway'] dark:text-gray-200">Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {!isMobile && (
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Close details">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={`p-4 ${!isMobile ? 'pt-12' : ''}`}>
        <div className="mb-4 relative w-full h-40">
          {!imageLoaded && <Skeleton height="100%" containerClassName="h-full w-full block absolute top-0 left-0" />}
          <Image 
            src={project.image} 
            alt={project.name} 
            fill 
            className={`object-cover rounded-lg shadow-sm transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic font-['Raleway']">{project.caption}</p>
        </div>

        <h3 className="text-lg font-medium mb-2 font-['Raleway'] dark:text-gray-200">{project.name}</h3>

        {project.stats && project.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 dark:bg-[#2b2b2b] p-3 rounded-lg">
            {project.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 text-sm">
          {project.techstack && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Tech Stack</p>
              <p className="font-['Raleway'] dark:text-gray-300">{project.techstack}</p>
            </div>
          )}

          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Description</p>
            <p className="font-['Raleway'] leading-relaxed dark:text-gray-300">
              {project.description.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Created</p>
            <p className="font-['Raleway'] dark:text-gray-300">{format(project.created, 'MMM d, yyyy')}</p>
          </div>

          {project.link && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Project Link</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-['Raleway']">
                View Project →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


