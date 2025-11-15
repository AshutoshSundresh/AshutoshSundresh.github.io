/**
 * Calendar day column component
 */

import type { Course, DayScheduleItem } from '../../types';
import { timeToMinutes } from '../../utils/timeUtils';
import { useOverlapDetection } from '../../hooks/useOverlapDetection';
import CourseBlock from './CourseBlock';

interface CalendarDayColumnProps {
  day: string;
  coursesWithColors: Course[];
  timeSlots: string[];
  calendarStartMinutes: number;
}

export default function CalendarDayColumn({
  day,
  coursesWithColors,
  timeSlots,
  calendarStartMinutes,
}: CalendarDayColumnProps) {
  // Collect all schedule items for this day
  const daySchedules: DayScheduleItem[] = [];

  coursesWithColors.forEach(course => {
    course.schedule
      ?.filter(s => s.day === day)
      .forEach((schedule, idx) => {
        const startMinutes = timeToMinutes(schedule.startTime);
        const endMinutes = timeToMinutes(schedule.endTime);
        daySchedules.push({
          course,
          schedule,
          idx,
          startMinutes,
          endMinutes,
        });
      });
  });

  const columnInfoMap = useOverlapDetection(daySchedules);

  return (
    <div className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0 relative bg-white dark:bg-[#1e1e1e] h-full min-w-0">
      {/* Hourly grid lines */}
      {timeSlots.map((time) => (
        <div
          key={time}
          className="h-16 border-b border-gray-200 dark:border-gray-700"
        />
      ))}

      {/* Course blocks */}
      {daySchedules.map((item, index) => {
        const info = columnInfoMap.get(index) || { column: 0, maxColumns: 1, hasOverlap: false };
        return (
          <CourseBlock
            key={`${item.course.code}-${item.schedule.type}-${item.idx}`}
            item={item}
            info={info}
            calendarStartMinutes={calendarStartMinutes}
          />
        );
      })}
    </div>
  );
}

