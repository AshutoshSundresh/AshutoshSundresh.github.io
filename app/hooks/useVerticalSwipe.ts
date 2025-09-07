"use client";

import { useCallback, useState } from 'react';

export default function useVerticalSwipe() {
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const onTouchStart = useCallback((y: number) => {
    setSwipeStartY(y);
  }, []);

  const onTouchMove = useCallback((y: number, allowUp: boolean, allowDown: boolean) => {
    if (swipeStartY === null) return;
    const distance = swipeStartY - y;
    if (allowUp && distance > 0) setSwipeDistance(Math.min(distance, 150));
    if (allowDown && distance < 0) setSwipeDistance(Math.max(distance, -150));
  }, [swipeStartY]);

  const onTouchEnd = useCallback(() => {
    const finalDistance = swipeDistance;
    setSwipeStartY(null);
    setSwipeDistance(0);
    return finalDistance;
  }, [swipeDistance]);

  return { swipeStartY, swipeDistance, onTouchStart, onTouchMove, onTouchEnd };
}


