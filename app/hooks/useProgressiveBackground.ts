'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function useProgressiveBackground(
  lightLowResUrl: string,
  lightHighResUrl: string,
  darkLowResUrl?: string,
  darkHighResUrl?: string,
  lightBlurDataUrl?: string,
  darkBlurDataUrl?: string,
) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [highResBgLoaded, setHighResBgLoaded] = useState(false);
  const { isDark } = useTheme();

  // Select URLs based on theme
  const lowResUrl = isDark && darkLowResUrl ? darkLowResUrl : lightLowResUrl;
  const highResUrl = isDark && darkHighResUrl ? darkHighResUrl : lightHighResUrl;
  const blurDataUrl = isDark && darkBlurDataUrl ? darkBlurDataUrl : lightBlurDataUrl;

  useEffect(() => {
    // Reset loading states when theme changes
    setBgLoaded(false);
    setHighResBgLoaded(false);
    
    const lowResImg = new window.Image();
    lowResImg.src = lowResUrl;
    lowResImg.onload = () => {
      setBgLoaded(true);
      const highResImg = new window.Image();
      highResImg.src = highResUrl;
      highResImg.onload = () => setHighResBgLoaded(true);
    };
  }, [lowResUrl, highResUrl, isDark]);

  const backgroundStyle = useMemo(() => ({
    backgroundImage: highResBgLoaded
      ? `url("${highResUrl}")`
      : bgLoaded
        ? `url("${lowResUrl}")`
        : blurDataUrl
          ? `url("${blurDataUrl}")`
          : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    transition: 'background-image 0.5s ease-in-out'
  }), [bgLoaded, highResBgLoaded, lowResUrl, highResUrl, blurDataUrl]);

  return { bgLoaded, highResBgLoaded, backgroundStyle };
}


