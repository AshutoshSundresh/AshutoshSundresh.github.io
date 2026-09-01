"use client";

import React, { memo } from 'react';
import type { ProjectsGridProps } from '../types';
import Image from 'next/image';
import { getBlurDataURL } from '../constants/blurPlaceholder';
import { UI_FONT_STACK } from './skeumorphic/macos';

/**
 * Finder icon view. Modern macOS puts the selection highlight on the label
 * pill rather than the whole cell, and clamps long names to two lines.
 */
function ProjectsGrid({ projects, selectedItem, onItemClick, folderIconUrl }: ProjectsGridProps) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 md:grid-cols-5">
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
            className="group flex cursor-pointer flex-col items-center rounded-[8px] px-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60"
          >
            <div
              className={`relative mb-1.5 h-[68px] w-[68px] transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-95 ${
                selected ? 'drop-shadow-[0_2px_6px_rgba(10,132,255,0.45)]' : ''
              }`}
            >
              <Image
                src={folderIconUrl}
                alt=""
                fill
                sizes="68px"
                placeholder="blur"
                blurDataURL={getBlurDataURL(folderIconUrl)}
                className="object-contain"
              />
            </div>
            {/* Fixed-height wrapper guarantees the two-line clip; the pill
                inside hugs the text the way Finder's label highlight does. */}
            <span className="flex h-[32px] w-full items-start justify-center overflow-hidden">
              <span
                className={`line-clamp-2 rounded-[5px] px-1.5 py-[1px] text-center text-[11.5px] leading-[15px] transition-colors ${
                  selected
                    ? 'bg-[#0A84FF] text-white'
                    : 'text-[#1d1d1f] group-hover:bg-black/[0.05] dark:text-gray-200 dark:group-hover:bg-white/[0.08]'
                }`}
                style={{ fontFamily: UI_FONT_STACK }}
              >
                {project.name}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
export default memo(ProjectsGrid);
