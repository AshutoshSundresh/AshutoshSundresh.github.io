/**
 * Hook for managing coursework data (years, quarters, filtered courses)
 */

import { useMemo, useEffect, useState, useDeferredValue } from 'react';
import type { Course } from '../types';
import { courseColors } from '../utils/courseUtils';

export interface UseCourseworkDataReturn {
  years: number[];
  quartersByYear: Record<number, string[]>;
  filteredCourses: Course[];
  coursesWithColors: Course[];
  selectedYear: number | null;
  selectedQuarter: string | null;
  setSelectedYear: (year: number) => void;
  setSelectedQuarter: (quarter: string) => void;
}

export function useCourseworkData(courses: Course[]): UseCourseworkDataReturn {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);

  // Extract years and quarters from courses
  const { years, quartersByYear } = useMemo(() => {
    const yearSet = new Set<number>();
    const quartersMap: Record<number, Set<string>> = {};

    courses.forEach(course => {
      const year = course.year || (course.quarter?.includes('2024') ? 2024 : course.quarter?.includes('2025') ? 2025 : null);
      if (year) {
        yearSet.add(year);
        if (!quartersMap[year]) quartersMap[year] = new Set();
        if (course.quarter) {
          const quarterName = course.quarter.replace(/\d{4}/g, '').trim();
          quartersMap[year].add(quarterName);
        }
      }
    });

    return {
      years: Array.from(yearSet).sort(),
      quartersByYear: Object.fromEntries(
        Object.entries(quartersMap).map(([year, quarters]) => [
          year,
          Array.from(quarters).sort((a, b) => {
            const order: Record<string, number> = { 'Winter': 1, 'Spring': 2, 'Fall': 3, 'Summer': 4 };
            return (order[a] || 999) - (order[b] || 999);
          })
        ])
      )
    };
  }, [courses]);

  // Auto-select latest year and quarter on mount
  useEffect(() => {
    if (selectedYear === null && years.length > 0) {
      const latestYear = years[years.length - 1];
      setSelectedYear(latestYear);
      const latestYearQuarters = quartersByYear[latestYear];
      if (latestYearQuarters && latestYearQuarters.length > 0) {
        const latestQuarter = latestYearQuarters[latestYearQuarters.length - 1];
        setSelectedQuarter(latestQuarter);
      }
    }
  }, [years, quartersByYear, selectedYear]);

  // Defer heavy filtering operations to avoid blocking the UI
  const deferredSelectedYear = useDeferredValue(selectedYear);
  const deferredSelectedQuarter = useDeferredValue(selectedQuarter);

  // Filter courses by selected year and quarter (deferred for better performance)
  const filteredCourses = useMemo(() => {
    if (!deferredSelectedYear || !deferredSelectedQuarter) return [];
    return courses.filter(course => {
      const courseYear = course.year || (course.quarter?.includes('2024') ? 2024 : course.quarter?.includes('2025') ? 2025 : null);
      const courseQuarter = course.quarter?.replace(/\d{4}/g, '').trim();
      return courseYear === deferredSelectedYear && courseQuarter === deferredSelectedQuarter;
    });
  }, [courses, deferredSelectedYear, deferredSelectedQuarter]);

  // Assign colors to courses (lightweight operation)
  const coursesWithColors = useMemo(() => {
    return filteredCourses.map((course, index) => ({
      ...course,
      color: course.color || courseColors[index % courseColors.length]
    }));
  }, [filteredCourses]);

  return {
    years,
    quartersByYear,
    filteredCourses,
    coursesWithColors,
    selectedYear,
    selectedQuarter,
    setSelectedYear,
    setSelectedQuarter,
  };
}

