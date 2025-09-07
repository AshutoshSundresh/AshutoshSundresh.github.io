"use client";

import { useEffect, useState } from 'react';

export default function useIntroVisibility() {
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const section = document.getElementById('intro-text');
    if (!section) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
        if (firstLaunch && entry.isIntersecting) setFirstLaunch(false);
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [firstLaunch]);

  return { show, firstLaunch };
}


