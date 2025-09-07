"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { DraggableCardProps } from '../types';

export default function DraggableCard({ id, children, position, isDraggingDisabled }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: isDraggingDisabled });

  const style = isDraggingDisabled
    ? { transform: 'none', touchAction: 'auto' as const }
    : { transform: `translate3d(${position.x + (transform?.x ?? 0)}px, ${position.y + (transform?.y ?? 0)}px, 0)`, touchAction: 'pan-y' as const };

  return (
    <div ref={setNodeRef} style={style} {...(isDraggingDisabled ? {} : { ...listeners, ...attributes })} className={isDraggingDisabled ? '' : 'cursor-move touch-none'}>
      {children}
    </div>
  );
}


