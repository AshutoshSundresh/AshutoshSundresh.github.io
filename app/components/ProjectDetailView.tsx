"use client";

import { format } from 'date-fns';
import type { ProjectDetailViewProps } from '../types';
import Image from 'next/image';
import { getBlurDataURL } from '../constants/blurPlaceholder';

export default function ProjectDetailView({ project, onClose, isMobile }: ProjectDetailViewProps) {
  return (
    <div
      data-detail-view
      className={`
        ${isMobile
          ? 'fixed inset-0 z-20 bg-[#f5f6fa] dark:bg-[#0f1115] font-[Raleway]'
          : 'absolute right-0 top-0 h-full w-72 z-20 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181818]'}
        overflow-y-auto transition-colors
      `}
    >
      {isMobile && (
        <div className="sticky top-0 z-20 border-b border-black/5 bg-white/88 px-5 pb-3 pt-12 backdrop-blur-xl dark:border-white/8 dark:bg-[#101319]/82">
          <div className="flex min-h-6 items-center">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[0.95rem] font-medium text-[#007aff] dark:text-[#4da3ff]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 18l-6-6 6-6" />
              </svg>
              <span>Projects</span>
            </button>
          </div>
        </div>
      )}

      {!isMobile && (
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Close details">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={`${isMobile ? 'px-5 pb-10 pt-5' : `p-4 ${!isMobile ? 'pt-12' : ''}`}`}>
        <div className={`mb-4 relative w-full overflow-hidden ${isMobile ? 'h-52 rounded-[24px]' : 'h-40 rounded-lg'}`}>
          <Image 
            src={project.image} 
            alt={project.name} 
            fill 
            placeholder="blur"
            blurDataURL={getBlurDataURL(project.image)}
            className="object-cover rounded-lg shadow-sm"
          />
        </div>

        {isMobile ? (
          <div className="mb-5">
            <h3 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-gray-900 dark:text-gray-100">{project.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{project.caption}</p>
          </div>
        ) : (
          <h3 className="text-lg font-medium mb-2 font-['Raleway'] dark:text-gray-200">{project.name}</h3>
        )}

        {project.stats && project.stats.length > 0 && (
          <div className={`grid grid-cols-2 gap-4 mb-4 ${isMobile ? 'bg-white dark:bg-[#151922] border border-black/5 dark:border-white/8 p-4 rounded-[20px]' : 'bg-gray-50 dark:bg-[#2b2b2b] p-3 rounded-lg'}`}>
            {project.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className={`space-y-4 text-sm ${isMobile ? 'space-y-3' : ''}`}>
          {project.techstack && (
            <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Tech Stack</p>
              <p className="font-['Raleway'] dark:text-gray-300">{project.techstack}</p>
            </div>
          )}

          <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
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

          <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Created</p>
            <p className="font-['Raleway'] dark:text-gray-300">{format(project.created, 'MMM d, yyyy')}</p>
          </div>

          {project.link && (
            <div className={isMobile ? 'pt-1' : ''}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isMobile
                  ? 'inline-flex w-full items-center justify-center rounded-2xl bg-[#007aff] px-4 py-3 text-sm font-semibold text-white'
                  : 'text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-[Raleway]'}`
                }
              >
                View Project {isMobile ? '' : '→'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


