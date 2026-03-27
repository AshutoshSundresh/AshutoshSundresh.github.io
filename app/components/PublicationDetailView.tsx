"use client";

import type { PublicationDetailViewProps } from '../types';
import Image from 'next/image';
import { getBlurDataURL } from '../constants/blurPlaceholder';

export default function PublicationDetailView({ publication, onClose, isMobile }: PublicationDetailViewProps) {
  return (
    <div
      data-detail-view
      className={`
        ${isMobile
          ? 'fixed inset-0 z-20 bg-[#f5f6fa] dark:bg-[#0f1115]'
          : 'absolute right-0 top-0 h-full w-72 z-20 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181818]'}
        overflow-y-auto font-['Raleway'] transition-colors
      `}
    >
      {isMobile ? (
        <div className="sticky top-0 z-20 border-b border-black/5 bg-white/88 px-5 pb-3 pt-12 backdrop-blur-xl dark:border-white/8 dark:bg-[#101319]/82">
          <div className="flex min-h-6 items-center">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[0.95rem] font-medium text-[#007aff] dark:text-[#4da3ff]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 18l-6-6 6-6" />
              </svg>
              <span>Publications</span>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Close details">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={`${isMobile ? 'px-5 pb-10 pt-5 space-y-5' : `p-4 space-y-6 ${!isMobile ? 'pt-12' : ''}`}`}>
        <div className={`flex flex-col items-center text-center ${isMobile ? 'rounded-[22px] border border-black/5 bg-white px-5 py-6 dark:border-white/8 dark:bg-[#151922]' : ''}`}>
          <div className={`${isMobile ? 'w-24 h-24 mb-4' : 'w-32 h-32 mb-4'} relative transition-transform duration-[8s] group-hover:scale-105 rounded-[20px] overflow-hidden`}>
            <Image 
              src={publication.icon} 
              alt="" 
              fill 
              sizes="128px" 
              placeholder="blur"
              blurDataURL={getBlurDataURL(publication.icon)}
              className="object-contain"
            />
          </div>
          <h2 className={`${isMobile ? 'text-[1.35rem] tracking-[-0.03em]' : 'text-lg'} font-semibold text-gray-900 dark:text-gray-200 break-words`}>
            {publication.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{publication.year}</p>
        </div>

        <div className="space-y-4 text-sm">
          {publication.authors && (
            <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Authors</h3>
              <p className="text-gray-600 dark:text-gray-400 break-words">{publication.authors.join(", ")}</p>
            </div>
          )}

          {publication.journal && (
            <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Journal</h3>
              <p className="text-gray-600 dark:text-gray-400 break-words">{publication.journal}</p>
            </div>
          )}

          {publication.abstract && (
            <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Abstract</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">{publication.abstract}</p>
            </div>
          )}

          {publication.status && (
            <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922]' : ''}>
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Status</h3>
              <p className="text-gray-600 dark:text-gray-400 break-words">{publication.status}</p>
            </div>
          )}

          {publication.extraDetails && publication.extraDetails.length > 0 && (
            <div className={isMobile ? 'rounded-[20px] border border-black/5 bg-white p-4 dark:border-white/8 dark:bg-[#151922] space-y-2' : 'pt-2 space-y-2'}>
              {publication.extraDetails.map((detail, index) => (
                <a key={index} href={detail.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 mr-4">
                  <span>{detail.label} →</span>
                </a>
              ))}
            </div>
          )}

          {publication.link && (
            <div className={isMobile ? 'pt-1' : 'pt-2'}>
              <a
                href={publication.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isMobile
                  ? 'inline-flex w-full items-center justify-center rounded-2xl bg-[#007aff] px-4 py-3 text-sm font-semibold text-white'
                  : 'inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300'}`
                }
              >
                View Publication {isMobile ? '' : '→'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


