'use client';

import { useEffect, useState } from 'react';
import type { WindowInfo } from '../types';

export default function useWindowInfo(): WindowInfo {
  const [windowInfo, setWindowInfo] = useState<WindowInfo>({
    vh: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowInfo({
        vh: window.innerHeight,
        isMobile: window.innerWidth < 768
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowInfo;
}

