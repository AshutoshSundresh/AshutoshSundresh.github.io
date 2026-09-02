"use client";

import React, { memo } from 'react';
import type { ProjectsGridProps } from '../types';
import Image from 'next/image';
import { SEMANTIC_COLORS } from '../constants/colors';
import { getBlurDataURL } from '../constants/blurPlaceholder';

/**
 * Finder icon view. Selection and hover match PublicationsGrid: the wash
 * covers the whole tile rather than just the label, and the icon holds still.
 */
function ProjectsGrid({ projects, selectedItem, onItemClick, folderIconUrl }: ProjectsGridProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {projects.map((project) => {
        const selected = selectedItem === project.id;
        return (
          <button
            key={project.id}
            type="button"
            onClick={(e) => onItemClick(e, project.id)}
            aria-pressed={selected}
            data-project-tile
            title={project.name}
            className={`group flex cursor-pointer flex-col items-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 ${
              selected ? 'text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            style={selected ? { backgroundColor: SEMANTIC_COLORS.selection } : undefined}
          >
            <div className="relative mb-1 h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={folderIconUrl}
                alt=""
                fill
                sizes="64px"
                placeholder="blur"
                blurDataURL={getBlurDataURL(folderIconUrl)}
                className="object-contain"
              />
            </div>
            <div className="mt-3 max-w-[100px] text-center">
              <p
                className={`line-clamp-2 break-words text-center font-['Raleway'] text-xs leading-tight ${
                  selected ? 'text-white' : 'text-gray-800 dark:text-gray-300'
                }`}
              >
                {project.name}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
export default memo(ProjectsGrid);
