"use client";

import type { Publication } from '../types';
import Image from 'next/image';

interface Props {
  publication: Publication;
  onClose: () => void;
  isMobile: boolean;
}

export default function PublicationDetailView({ publication, onClose, isMobile }: Props) {
  return (
    <div
      data-detail-view
      className={`
        ${isMobile
          ? 'fixed inset-0 z-50 bg-white'
          : 'absolute right-0 top-0 h-full w-72 z-20 border-l border-gray-200 bg-gray-50'}
        overflow-y-auto font-['Raleway']
      `}
    >
      {isMobile ? (
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full" aria-label="Close details">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={`p-4 space-y-6 ${!isMobile ? 'pt-12' : ''}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 mb-4 relative transition-transform duration-[8s] group-hover:scale-105">
            <Image src={publication.icon} alt="" fill sizes="128px" className="object-contain" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 break-words">{publication.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{publication.year}</p>
        </div>

        <div className="space-y-4 text-sm">
          {publication.authors && (
            <div>
              <h3 className="font-medium text-gray-900">Authors</h3>
              <p className="text-gray-600 break-words">{publication.authors.join(", ")}</p>
            </div>
          )}

          {publication.journal && (
            <div>
              <h3 className="font-medium text-gray-900">Journal</h3>
              <p className="text-gray-600 break-words">{publication.journal}</p>
            </div>
          )}

          {publication.abstract && (
            <div>
              <h3 className="font-medium text-gray-900">Abstract</h3>
              <p className="text-gray-600 whitespace-pre-wrap break-words">{publication.abstract}</p>
            </div>
          )}

          {publication.status && (
            <div>
              <h3 className="font-medium text-gray-900">Status</h3>
              <p className="text-gray-600 break-words">{publication.status}</p>
            </div>
          )}

          {publication.extraDetails && publication.extraDetails.length > 0 && (
            <div className="pt-2 space-y-2">
              {publication.extraDetails.map((detail, index) => (
                <a key={index} href={detail.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:text-blue-600 mr-4">
                  <span>{detail.label} →</span>
                </a>
              ))}
            </div>
          )}

          {publication.link && (
            <div className="pt-2">
              <a href={publication.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:text-blue-600">
                View Publication →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


