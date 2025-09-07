"use client";

import React, { memo } from 'react';
import type { ProjectsGridProps } from '../types';
import Image from 'next/image';

function ProjectsGrid({ projects, selectedItem, onItemClick, folderIconUrl }: ProjectsGridProps) {
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`flex flex-col items-center group cursor-pointer p-2 rounded-md ${selectedItem === project.id ? 'bg-[#0069d9]' : 'hover:bg-gray-100'}`}
          onClick={(e) => onItemClick(e, project.id)}
        >
          <div className="w-16 h-16 mb-1 relative transition-transform duration-[8s] group-hover:scale-105">
            <Image src={folderIconUrl} alt="Folder" fill sizes="64px" className="object-contain" />
          </div>
          <div className="text-center max-w-[100px]">
            <p className={`text-xs font-['Raleway'] text-center break-words leading-tight mb-1 ${selectedItem === project.id ? 'text-white' : 'text-gray-800'}`}>
              {project.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(ProjectsGrid);
 
