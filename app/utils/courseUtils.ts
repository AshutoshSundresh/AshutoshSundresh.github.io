/**
 * Course utility functions for coursework calendar
 */

import type { Course } from '../types';
import { timeToMinutes } from './timeUtils';

// Major filter constants
export const DEFAULT_MAJOR_FILTER = 'All';
export const ALL_MAJORS_LABEL = 'All Majors';

/**
 * Extracts the major code from a course code (e.g., "CS 31" -> "CS")
 */
export function extractMajorFromCode(courseCode: string): string | null {
  const major = courseCode.split(' ')[0];
  return major || null;
}

/**
 * Filters courses by major code prefix
 * @param courses - Array of courses to filter
 * @param major - Major code to filter by, or DEFAULT_MAJOR_FILTER for all courses
 * @returns Filtered array of courses
 */
export function filterCoursesByMajor(courses: Course[], major: string): Course[] {
  if (major === DEFAULT_MAJOR_FILTER) {
    return courses;
  }
  return courses.filter(course => course.code.startsWith(major));
}

// Default colors for courses
export const courseColors = [
  '#007AFF', // Blue
  '#FF3B30', // Red
  '#34C759', // Green
  '#FF9500', // Orange
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#5AC8FA', // Light Blue
  '#FFCC00', // Yellow
];

// Generate time slots dynamically based on course times
export const generateTimeSlots = (courses: Course[]): { slots: string[]; startMinutes: number } => {
  if (courses.length === 0 || !courses.some(c => c.schedule && c.schedule.length > 0)) {
    // Default to 8 AM - 8 PM if no courses
    const slots: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return { slots, startMinutes: 8 * 60 };
  }

  // Find earliest start time and latest end time
  let earliestStart = Infinity;
  let latestEnd = -Infinity;

  courses.forEach(course => {
    course.schedule?.forEach(schedule => {
      const start = timeToMinutes(schedule.startTime);
      const end = timeToMinutes(schedule.endTime);
      if (start < earliestStart) earliestStart = start;
      if (end > latestEnd) latestEnd = end;
    });
  });

  // Add 10 minute buffer
  const startMinutes = earliestStart - 10;
  const endMinutes = latestEnd + 10;

  // Round down start to nearest hour
  const startHour = Math.floor(startMinutes / 60);
  
  // Round down end to nearest hour, but subtract 1 if endMinutes is exactly on the hour boundary
  // This ensures 5:50 PM + 10 min = 6:00 PM doesn't show the 6:00 PM slot
  const endHourRaw = endMinutes / 60;
  const endHour = endMinutes % 60 === 0 
    ? Math.floor(endHourRaw) - 1  // If exactly on hour boundary, don't include that hour
    : Math.floor(endHourRaw);     // Otherwise, round down normally

  // Generate slots (inclusive of endHour)
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return { slots, startMinutes: startHour * 60 };
};



