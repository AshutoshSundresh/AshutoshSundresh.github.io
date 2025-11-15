/**
 * Course block component for displaying individual course schedules
 */

import type { DayScheduleItem, ColumnInfo } from '../../types';
import { formatTime } from '../../utils/timeUtils';

interface CourseBlockProps {
  item: DayScheduleItem;
  info: ColumnInfo;
  calendarStartMinutes: number;
}

export default function CourseBlock({ item, info, calendarStartMinutes }: CourseBlockProps) {
  const widthPercent = 100 / info.maxColumns;
  const leftPercent = info.column * widthPercent;
  const top = ((item.startMinutes - calendarStartMinutes) / 60) * 64;
  const height = ((item.endMinutes - item.startMinutes) / 60) * 64;

  const courseColor = item.course.color || '#007AFF';
  const r = parseInt(courseColor.slice(1, 3), 16);
  const g = parseInt(courseColor.slice(3, 5), 16);
  const b = parseInt(courseColor.slice(5, 7), 16);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.course.catalogLink) {
      window.open(item.course.catalogLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="absolute rounded-lg border-l-[3px] overflow-hidden cursor-pointer transition-colors group"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        borderLeftColor: courseColor,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
        minHeight: '36px',
        marginLeft: '3px',
        marginRight: '3px',
      }}
      onClick={handleClick}
    >
      <div className="p-2 h-full flex flex-col justify-between transition-colors" style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      }}>
        <div>
          <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
            {item.course.code}
          </div>
          <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-tight line-clamp-2 mt-0.5 font-medium">
            {item.course.name}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-1 font-medium">
            {item.schedule.type.charAt(0).toUpperCase() + item.schedule.type.slice(1)}
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-auto leading-tight font-medium">
          {formatTime(item.schedule.startTime)} - {formatTime(item.schedule.endTime)}
        </div>
      </div>
    </div>
  );
}

