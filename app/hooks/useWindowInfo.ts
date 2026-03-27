'use client';

import { useEffect, useState } from 'react';
import type { WindowInfo } from '../types';

export default function useWindowInfo(): WindowInfo {
  const hasWindow = typeof window !== 'undefined';
  const [windowInfo, setWindowInfo] = useState<WindowInfo>({
    vh: hasWindow ? window.innerHeight : 0,
    isMobile: hasWindow ? window.innerWidth < 768 : false,
    isReady: hasWindow,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowInfo({
        vh: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isReady: true,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowInfo;
}

