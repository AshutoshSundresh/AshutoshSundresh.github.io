"use client";

import { format } from 'date-fns';
import type { Project } from '../types';
import Image from 'next/image';

interface Props {
  project: Project;
  onClose: () => void;
  isMobile: boolean;
}

export default function ProjectDetailView({ project, onClose, isMobile }: Props) {
  return (
    <div
      data-detail-view
      className={`
        ${isMobile
          ? 'fixed inset-0 z-50 bg-white'
          : 'absolute right-0 top-0 h-full w-72 z-20 border-l border-gray-200 bg-gray-50'}
        overflow-y-auto
      `}
    >
      {isMobile && (
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-sm font-medium font-['Raleway']">Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {!isMobile && (
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full" aria-label="Close details">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={`p-4 ${!isMobile ? 'pt-12' : ''}`}>
        <div className="mb-4 relative w-full h-40">
          <Image src={project.image} alt={project.name} fill className="object-cover rounded-lg shadow-sm" />
          <p className="text-xs text-gray-500 mt-2 italic font-['Raleway']">{project.caption}</p>
        </div>

        <h3 className="text-lg font-medium mb-2 font-['Raleway']">{project.name}</h3>

        {project.stats && project.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
            {project.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Description</p>
            <p className="font-['Raleway'] leading-relaxed">
              {project.description.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Created</p>
            <p className="font-['Raleway']">{format(project.created, 'MMM d, yyyy')}</p>
          </div>

          {project.link && (
            <div>
              <p className="text-gray-500 mb-1">Project Link</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-['Raleway']">
                View Project →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


