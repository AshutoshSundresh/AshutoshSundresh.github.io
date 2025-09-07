"use client";

import { useEffect, useState } from 'react';
import { format as formatDate } from 'date-fns';

export default function useClock(formatString: string) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return formatDate(time, formatString);
}


