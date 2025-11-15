/**
 * Calendar grid component displaying the weekly schedule
 */

import { useEffect, useRef, useState } from 'react';
import type { Course } from '../../types';
import { formatTime } from '../../utils/timeUtils';
import CalendarDayColumn from './CalendarDayColumn';

interface CalendarGridProps {
  coursesWithColors: Course[];
  timeSlots: string[];
  calendarStartMinutes: number;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CalendarGrid({
  coursesWithColors,
  timeSlots,
  calendarStartMinutes,
}: CalendarGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const calculateScrollbarWidth = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollbarWidth = container.offsetWidth - container.clientWidth;
        setScrollbarWidth(scrollbarWidth);
      }
    };

    calculateScrollbarWidth();
    // Recalculate on resize
    window.addEventListener('resize', calculateScrollbarWidth);
    return () => window.removeEventListener('resize', calculateScrollbarWidth);
  }, [timeSlots.length]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="sticky top-0 bg-white dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 z-10 flex-shrink-0">
        <div className="flex w-full" style={{ paddingRight: scrollbarWidth > 0 ? `${scrollbarWidth}px` : '0px' }}>
          {/* Time column header */}
          <div className="w-20 border-r border-gray-200 dark:border-gray-700 flex-shrink-0"></div>
          {/* Day headers */}
          {days.map((day) => (
            <div
              key={day}
              className="flex-1 px-2 md:px-4 py-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-w-0"
            >
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {day.substring(0, 3)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div ref={scrollContainerRef} className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {/* Time slots */}
        <div className="absolute inset-0 flex w-full" style={{ height: `${timeSlots.length * 64}px` }}>
          {/* Time column */}
          <div className="w-20 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] h-full flex-shrink-0">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-start justify-end pr-3 pt-1.5"
              >
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-tight">
                  {formatTime(time)}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => (
            <CalendarDayColumn
              key={day}
              day={day}
              coursesWithColors={coursesWithColors}
              timeSlots={timeSlots}
              calendarStartMinutes={calendarStartMinutes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

