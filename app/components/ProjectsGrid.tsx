"use client";

import React, { memo, useState } from 'react';
import type { ProjectsGridProps } from '../types';
import Image from 'next/image';
import { SEMANTIC_COLORS } from '../constants/colors';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ProjectsGrid({ projects, selectedItem, onItemClick, folderIconUrl }: ProjectsGridProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`flex flex-col items-center group cursor-pointer p-2 rounded-md ${selectedItem === project.id ? 'text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={(e) => onItemClick(e, project.id)}
          style={selectedItem === project.id ? { backgroundColor: SEMANTIC_COLORS.selection } : undefined}
        >
          <div className="w-16 h-16 mb-1 relative transition-transform duration-[8s] group-hover:scale-105">
            {!loadedImages[project.id] && <Skeleton height="100%" width="100%" containerClassName="h-full w-full block absolute top-0 left-0" />}
            <Image 
              src={folderIconUrl} 
              alt="Folder" 
              fill 
              sizes="64px" 
              className={`object-contain transition-opacity duration-300 ${loadedImages[project.id] ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => handleImageLoad(project.id)}
            />
          </div>
          <div className="text-center max-w-[100px]">
            <p className={`text-xs font-['Raleway'] text-center break-words leading-tight mb-1 ${selectedItem === project.id ? 'text-white' : 'text-gray-800 dark:text-gray-300'}`}>
              {project.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(ProjectsGrid);
 
