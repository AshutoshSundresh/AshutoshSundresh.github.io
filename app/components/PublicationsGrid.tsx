import React, { memo } from 'react';
import type { PublicationsGridProps } from '../types';
import Image from 'next/image';
import { SEMANTIC_COLORS } from '../constants/colors';
import { getBlurDataURL } from '../constants/blurPlaceholder';

function PublicationsGrid({ publications, selectedId, onItemClick }: PublicationsGridProps) {
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {publications.map((pub) => (
        <div
          key={pub.id}
          className={`flex flex-col items-center group cursor-pointer p-2 rounded-md ${selectedId === pub.id ? 'text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={(e) => onItemClick(e, pub.id)}
          style={selectedId === pub.id ? { backgroundColor: SEMANTIC_COLORS.selection } : undefined}
        >
          <div className="w-16 h-16 mb-1 relative transition-transform duration-[8s] group-hover:scale-105 rounded-lg overflow-hidden">
            <Image 
              src={pub.icon} 
              alt="Publication" 
              fill 
              sizes="64px" 
              placeholder="blur"
              blurDataURL={getBlurDataURL(pub.icon)}
              className="object-contain"
            />
          </div>
          <div className="mt-3 text-center max-w-[100px]">
            <p className={`text-xs font-['Raleway'] text-center break-words leading-tight mb-1 ${selectedId === pub.id ? 'text-white' : 'text-gray-800 dark:text-gray-300'}`}>
              {pub.title}
            </p>
            {pub.year && (
              <p className={`${selectedId === pub.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'} text-[10px]`}>{pub.year}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(PublicationsGrid);
