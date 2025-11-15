"use client";

import { useRef } from 'react';
import type { CourseworkModalProps } from '../types';
import { useCourseworkData } from '../hooks/useCourseworkData';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { useModalKeyboard } from '../hooks/useModalKeyboard';
import CourseworkModalHeader from './coursework/CourseworkModalHeader';
import CourseworkSidebar from './coursework/CourseworkSidebar';
import CalendarGrid from './coursework/CalendarGrid';
import EmptyState from './coursework/EmptyState';

export default function CourseworkModal({ open, onClose, courses, institution: _institution }: CourseworkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    years,
    quartersByYear,
    filteredCourses,
    coursesWithColors,
    selectedYear,
    selectedQuarter,
    setSelectedYear,
    setSelectedQuarter,
  } = useCourseworkData(courses);

  const { slots: timeSlots, startMinutes: calendarStartMinutes } = useTimeSlots(filteredCourses);

  useModalKeyboard(open, onClose);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-white dark:bg-[#1e1e1e] flex flex-col"
      ref={modalRef}
    >
      <CourseworkModalHeader onClose={onClose} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <CourseworkSidebar
          years={years}
          quartersByYear={quartersByYear}
          selectedYear={selectedYear}
          selectedQuarter={selectedQuarter}
          onYearQuarterChange={(year, quarter) => {
            setSelectedYear(year);
            setSelectedQuarter(quarter);
          }}
        />

        {/* Right Side - Calendar Grid */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1e1e1e] transition-colors">
          {selectedYear && selectedQuarter ? (
            <CalendarGrid
              coursesWithColors={coursesWithColors}
              timeSlots={timeSlots}
              calendarStartMinutes={calendarStartMinutes}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
