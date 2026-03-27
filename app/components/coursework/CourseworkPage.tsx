"use client";

import { useEffect, useCallback, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCourseworkData } from '../../hooks/useCourseworkData';
import { useMajorFilter } from '../../hooks/useMajorFilter';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import useWindowInfo from '../../hooks/useWindowInfo';
import CourseworkModalHeader from './CourseworkModalHeader';
import CourseworkSidebar from './CourseworkSidebar';
import MobileQuarterSelector from './MobileQuarterSelector';
import CalendarGrid from './CalendarGrid';
import PlainTextView from './PlainTextView';
import ViewToggle from './ViewToggle';
import MajorFilter from './MajorFilter';
import EmptyState from './EmptyState';
import type { Course } from '../../types';

interface CourseworkPageProps {
  courses: Course[];
}

export default function CourseworkPage({ courses }: CourseworkPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const windowInfo = useWindowInfo();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

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

  // Major filter hook
  const {
    majors,
    selectedMajor,
    setSelectedMajor,
    filterCoursesByMajor,
  } = useMajorFilter({
    courses,
    filteredCourses,
    view,
    resetDependencies: [selectedYear, selectedQuarter],
  });

  // Initialize from URL query parameters (runs before auto-select)
  useEffect(() => {
    const yearParam = searchParams?.get('year');
    const quarterParam = searchParams?.get('quarter');
    
    if (yearParam && quarterParam && years.length > 0) {
      const year = parseInt(yearParam, 10);
      const quarter = decodeURIComponent(quarterParam);
      
      if (!isNaN(year) && years.includes(year)) {
        const validQuarters = quartersByYear[year] || [];
        if (validQuarters.includes(quarter)) {
          setSelectedYear(year);
          setSelectedQuarter(quarter);
          return; // Exit early if URL params are set
        }
      }
    }
  }, [searchParams, years, quartersByYear, setSelectedYear, setSelectedQuarter]);

  // Filter calendar courses based on selected major
  const displayedCoursesWithColors = useMemo(() => {
    return filterCoursesByMajor(coursesWithColors);
  }, [coursesWithColors, filterCoursesByMajor]);

  const { slots: timeSlots, startMinutes: calendarStartMinutes } = useTimeSlots(displayedCoursesWithColors);


  const handleExit = useCallback(() => {
    if (searchParams?.get('detail') === 'coursework') {
      router.back();
      return;
    }
    router.push('/experience?tab=education');
  }, [router, searchParams]);

  // Handle Escape key to navigate back
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleExit]);

  const isEmbeddedMobile = windowInfo.isMobile && searchParams?.get('detail') === 'coursework';

  if (isEmbeddedMobile) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[#f5f6fa] dark:bg-[#0f1115]">
        <div className="flex-shrink-0 bg-[#f5f6fa] px-0 pb-3 pt-1 dark:bg-[#0f1115]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <ViewToggle view={view} onViewChange={setView} />
            <MajorFilter
              majors={majors}
              selectedMajor={selectedMajor}
              onMajorChange={setSelectedMajor}
            />
          </div>
        </div>

        {view === 'calendar' && (
          <div className="mb-3 -mx-1">
            <MobileQuarterSelector
              years={years}
              quartersByYear={quartersByYear}
              selectedYear={selectedYear}
              selectedQuarter={selectedQuarter}
              onYearQuarterChange={(year, quarter) => {
                setSelectedYear(year);
                setSelectedQuarter(quarter);
              }}
            />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#151922] dark:shadow-none">
          {view === 'calendar' ? (
            selectedYear && selectedQuarter ? (
              <CalendarGrid
                coursesWithColors={displayedCoursesWithColors}
                timeSlots={timeSlots}
                calendarStartMinutes={calendarStartMinutes}
              />
            ) : (
              <EmptyState />
            )
          ) : (
            <PlainTextView courses={courses} selectedMajor={selectedMajor} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-white dark:bg-[#1e1e1e] flex flex-col">
      <CourseworkModalHeader onClose={handleExit}>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onViewChange={setView} />
          <MajorFilter
            majors={majors}
            selectedMajor={selectedMajor}
            onMajorChange={setSelectedMajor}
          />
        </div>
      </CourseworkModalHeader>

      {/* Mobile Quarter Selector */}
      {view === 'calendar' && (
        <MobileQuarterSelector
          years={years}
          quartersByYear={quartersByYear}
          selectedYear={selectedYear}
          selectedQuarter={selectedQuarter}
          onYearQuarterChange={(year, quarter) => {
            setSelectedYear(year);
            setSelectedQuarter(quarter);
          }}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {view === 'calendar' && (
          <div className="hidden md:block">
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
          </div>
        )}

        {/* Right Side - Calendar Grid or Plain Text View */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] transition-colors">
          {view === 'calendar' ? (
            selectedYear && selectedQuarter ? (
              <CalendarGrid
                coursesWithColors={displayedCoursesWithColors}
                timeSlots={timeSlots}
                calendarStartMinutes={calendarStartMinutes}
              />
            ) : (
              <EmptyState />
            )
          ) : (
            <PlainTextView courses={courses} selectedMajor={selectedMajor} />
          )}
        </div>
      </div>
    </div>
  );
}

