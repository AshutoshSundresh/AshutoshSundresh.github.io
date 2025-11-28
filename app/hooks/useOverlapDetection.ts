/**
 * Hook for detecting overlapping courses and assigning columns
 */

import { useMemo } from 'react';
import type { DayScheduleItem, ColumnInfo } from '../types';

export function useOverlapDetection(
  daySchedules: DayScheduleItem[]
): Map<number, ColumnInfo> {
  return useMemo(() => {
    // Sort by start time first so earlier courses get left positions
    const sortedSchedules = [...daySchedules].sort((a, b) => {
      if (a.startMinutes !== b.startMinutes) {
        return a.startMinutes - b.startMinutes;
      }
      // If same start time, sort by end time (shorter courses first)
      return a.endMinutes - b.endMinutes;
    });

    // Create index mapping from sorted back to original
    const sortedToOriginal = new Map<number, number>();
    sortedSchedules.forEach((sortedItem, sortedIdx) => {
      const originalIdx = daySchedules.findIndex(item =>
        item.course.code === sortedItem.course.code &&
        item.schedule.type === sortedItem.schedule.type &&
        item.idx === sortedItem.idx &&
        item.startMinutes === sortedItem.startMinutes &&
        item.endMinutes === sortedItem.endMinutes
      );
      if (originalIdx !== -1) {
        sortedToOriginal.set(sortedIdx, originalIdx);
      }
    });

    // Detect overlaps and assign columns (process in sorted order)
    // Only courses that overlap with others get split into columns
    const resultMap = new Map<number, ColumnInfo>();
    
    // First, identify which courses have overlaps
    const hasOverlapWithOthers = new Map<number, boolean>();
    sortedSchedules.forEach((item, sortedIndex) => {
      const overlaps = sortedSchedules.some((other, otherIdx) => {
        if (sortedIndex === otherIdx) return false;
        return !(
          item.endMinutes <= other.startMinutes ||
          item.startMinutes >= other.endMinutes
        );
      });
      hasOverlapWithOthers.set(sortedIndex, overlaps);
    });

    // Group overlapping courses together
    const overlappingGroups: Array<Array<number>> = [];
    const processed = new Set<number>();

    sortedSchedules.forEach((item, sortedIndex) => {
      if (processed.has(sortedIndex)) return;
      
      if (hasOverlapWithOthers.get(sortedIndex)) {
        // Find all courses that overlap with this one
        const group = [sortedIndex];
        processed.add(sortedIndex);
        
        const findOverlaps = (idx: number) => {
          sortedSchedules.forEach((other, otherIdx) => {
            if (processed.has(otherIdx)) return;
            const overlaps = !(
              sortedSchedules[idx].endMinutes <= other.startMinutes ||
              sortedSchedules[idx].startMinutes >= other.endMinutes
            );
            if (overlaps) {
              group.push(otherIdx);
              processed.add(otherIdx);
              findOverlaps(otherIdx);
            }
          });
        };
        
        findOverlaps(sortedIndex);
        overlappingGroups.push(group);
      } else {
        processed.add(sortedIndex);
      }
    });

    // Assign columns to overlapping groups
    overlappingGroups.forEach((group) => {
      const groupMaxColumns = group.length;
      group.forEach((sortedIdx, groupIdx) => {
        const originalIdx = sortedToOriginal.get(sortedIdx) ?? sortedIdx;
        resultMap.set(originalIdx, {
          column: groupIdx,
          maxColumns: groupMaxColumns,
          hasOverlap: true
        });
      });
    });

    // Non-overlapping courses get full width
    sortedSchedules.forEach((item, sortedIndex) => {
      if (!hasOverlapWithOthers.get(sortedIndex)) {
        const originalIdx = sortedToOriginal.get(sortedIndex) ?? sortedIndex;
        if (!resultMap.has(originalIdx)) {
          resultMap.set(originalIdx, {
            column: 0,
            maxColumns: 1,
            hasOverlap: false
          });
        }
      }
    });

    return resultMap;
  }, [daySchedules]);
}


