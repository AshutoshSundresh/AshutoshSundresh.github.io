"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalKeyboard } from '../hooks/useModalKeyboard';
import InterestPixelBackground from './InterestPixelBackground';
import type { InterestName } from '../types/interestIcons';

interface InterestPopupProps {
  open: boolean;
  onClose: () => void;
  interestName: InterestName;
  content: string;
}

export default function InterestPopup({ open, onClose, interestName, content }: InterestPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  useModalKeyboard(open, onClose);

  useEffect(() => {
    if (open && popupRef.current) {
      popupRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      console.log('InterestPopup opened:', interestName, content);
    }
  }, [open, interestName, content]);

  if (typeof document === 'undefined') return null;
  
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      data-search-ignore
      style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <InterestPixelBackground interestName={interestName} />
      <div
        ref={popupRef}
        className="w-full max-w-md mx-4 rounded-xl bg-white/95 dark:bg-dark-secondary backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:ring-dark-border-primary relative z-20"
        onClick={(e) => {
          e.stopPropagation();
        }}
        data-search-ignore
        tabIndex={-1}
        style={{ position: 'relative' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-dark-border-secondary bg-white/95 dark:bg-dark-secondary">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-primary font-['Raleway']">
            {interestName}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-dark-tertiary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 bg-white/95 dark:bg-dark-secondary" data-search-ignore>
          <div className="text-gray-700 dark:text-dark-secondary font-['Raleway'] text-sm leading-relaxed whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

