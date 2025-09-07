'use client';

import { useEffect, useState, useMemo } from 'react';

export default function useProgressiveBackground(lowResUrl: string, highResUrl: string) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [highResBgLoaded, setHighResBgLoaded] = useState(false);

  useEffect(() => {
    const lowResImg = new window.Image();
    lowResImg.src = lowResUrl;
    lowResImg.onload = () => {
      setBgLoaded(true);
      const highResImg = new window.Image();
      highResImg.src = highResUrl;
      highResImg.onload = () => setHighResBgLoaded(true);
    };
  }, [lowResUrl, highResUrl]);

  const backgroundStyle = useMemo(() => ({
    backgroundImage: highResBgLoaded
      ? `url("${highResUrl}")`
      : bgLoaded
        ? `url("${lowResUrl}")`
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
  }), [bgLoaded, highResBgLoaded, lowResUrl, highResUrl]);

  return { bgLoaded, highResBgLoaded, backgroundStyle };
}


