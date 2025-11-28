/**
 * Hook for generating time slots for the calendar
 */

import { useMemo } from 'react';
import type { Course } from '../types';
import { generateTimeSlots } from '../utils/courseUtils';

export function useTimeSlots(courses: Course[]) {
  return useMemo(() => {
    return generateTimeSlots(courses);
  }, [courses]);
}


