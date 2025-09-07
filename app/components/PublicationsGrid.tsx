import React, { memo } from 'react';
import type { PublicationsGridProps } from '../types';
import Image from 'next/image';

function PublicationsGrid({ publications, selectedId, onItemClick }: PublicationsGridProps) {
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {publications.map((pub) => (
        <div
          key={pub.id}
          className={`flex flex-col items-center group cursor-pointer p-2 rounded-md ${selectedId === pub.id ? 'bg-[#0069d9]' : 'hover:bg-gray-100'}`}
          onClick={(e) => onItemClick(e, pub.id)}
        >
          <div className="w-16 h-16 mb-1 relative transition-transform duration-[8s] group-hover:scale-105">
            <Image src={pub.icon} alt="Publication" fill sizes="64px" className="object-contain" />
          </div>
          <div className="mt-3 text-center max-w-[100px]">
            <p className={`text-xs font-['Raleway'] text-center break-words leading-tight mb-1 ${selectedId === pub.id ? 'text-white' : 'text-gray-800'}`}>
              {pub.title}
            </p>
            {pub.year && (
              <p className={`${selectedId === pub.id ? 'text-blue-100' : 'text-gray-500'} text-[10px]`}>{pub.year}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(PublicationsGrid);
