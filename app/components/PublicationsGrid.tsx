import React, { memo, useState } from 'react';
import type { PublicationsGridProps } from '../types';
import Image from 'next/image';
import { SEMANTIC_COLORS } from '../constants/colors';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function PublicationsGrid({ publications, selectedId, onItemClick }: PublicationsGridProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {publications.map((pub) => (
        <div
          key={pub.id}
          className={`flex flex-col items-center group cursor-pointer p-2 rounded-md ${selectedId === pub.id ? 'text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={(e) => onItemClick(e, pub.id)}
          style={selectedId === pub.id ? { backgroundColor: SEMANTIC_COLORS.selection } : undefined}
        >
          <div className="w-16 h-16 mb-1 relative transition-transform duration-[8s] group-hover:scale-105">
            {!loadedImages[pub.id] && <Skeleton height="100%" circle containerClassName="h-full w-full block absolute top-0 left-0" />}
            <Image 
              src={pub.icon} 
              alt="Publication" 
              fill 
              sizes="64px" 
              className={`object-contain transition-opacity duration-300 ${loadedImages[pub.id] ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => handleImageLoad(pub.id)}
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
