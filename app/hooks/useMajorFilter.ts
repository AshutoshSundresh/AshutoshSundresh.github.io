/**
 * Hook for managing major filtering logic
 * Extracts unique majors from courses and provides filtering functionality
 */

import { useState, useMemo, useEffect } from 'react';
import type { Course } from '../types';
import { DEFAULT_MAJOR_FILTER, extractMajorFromCode, filterCoursesByMajor as filterByMajorUtil } from '../utils/courseUtils';

export interface UseMajorFilterOptions {
  courses: Course[];
  filteredCourses?: Course[]; // For calendar view - courses already filtered by quarter
  view: 'calendar' | 'list';
  resetDependencies?: unknown[]; // Dependencies that should trigger a reset
}

export interface UseMajorFilterReturn {
  majors: string[];
  selectedMajor: string;
  setSelectedMajor: (major: string) => void;
  filterCoursesByMajor: (courses: Course[]) => Course[];
}

/**
 * Extracts unique majors from course codes
 */
function extractMajors(courses: Course[]): string[] {
  const uniqueMajors = new Set<string>();
  
  courses.forEach(course => {
    const major = extractMajorFromCode(course.code);
    if (major) {
      uniqueMajors.add(major);
    }
  });
  
  return Array.from(uniqueMajors).sort();
}


export function useMajorFilter({
  courses,
  filteredCourses,
  view,
  resetDependencies = [],
}: UseMajorFilterOptions): UseMajorFilterReturn {
  const [selectedMajor, setSelectedMajor] = useState<string>(DEFAULT_MAJOR_FILTER);

  // Determine source courses based on view
  const sourceCourses = view === 'calendar' && filteredCourses 
    ? filteredCourses 
    : courses;

  // Extract unique majors from source courses
  const majors = useMemo(() => {
    return extractMajors(sourceCourses);
  }, [sourceCourses]);

  // Reset selected major when dependencies change
  useEffect(() => {
    setSelectedMajor(DEFAULT_MAJOR_FILTER);
  }, [view, ...resetDependencies]);

  // Filter function for courses
  const filterCoursesByMajor = useMemo(() => {
    return (coursesToFilter: Course[]) => filterByMajorUtil(coursesToFilter, selectedMajor);
  }, [selectedMajor]);

  return {
    majors,
    selectedMajor,
    setSelectedMajor,
    filterCoursesByMajor,
  };
}

