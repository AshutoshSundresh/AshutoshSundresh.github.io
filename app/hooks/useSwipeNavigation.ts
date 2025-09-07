'use client';

import { useState } from 'react';

export default function useSwipeNavigation(enabled: boolean, onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  const minSwipeDistance = 50;
  const maxSwipeAngle = 30;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enabled) return;
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enabled) return;
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = () => {
    if (!enabled || !touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const horizontalDistance = Math.abs(deltaX);
    const angleInRadians = Math.atan2(Math.abs(deltaY), horizontalDistance);
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    const isValidHorizontalSwipe = horizontalDistance > minSwipeDistance && angleInDegrees < maxSwipeAngle;
    if (!isValidHorizontalSwipe) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    if (deltaX > 0) onSwipeLeft();
    if (deltaX < 0) onSwipeRight();

    setTouchStart(null);
    setTouchEnd(null);
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}


