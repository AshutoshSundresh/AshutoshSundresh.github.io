/**
 * Plain text view component displaying courses by year and quarter
 * Card-based grid layout
 */

import type { Course } from '../../types';

interface PlainTextViewProps {
  courses: Course[];
}

export default function PlainTextView({ courses }: PlainTextViewProps) {
  // Group courses by year and quarter
  const groupedCourses: Record<number, Record<string, Course[]>> = {};

  courses.forEach(course => {
    const year = course.year || (course.quarter?.includes('2024') ? 2024 : course.quarter?.includes('2025') ? 2025 : null);
    if (!year) return;

    const quarter = course.quarter?.replace(/\d{4}/g, '').trim() || 'Unknown';
    
    if (!groupedCourses[year]) {
      groupedCourses[year] = {};
    }
    if (!groupedCourses[year][quarter]) {
      groupedCourses[year][quarter] = [];
    }
    groupedCourses[year][quarter].push(course);
  });

  // Sort years and quarters
  const sortedYears = Object.keys(groupedCourses)
    .map(Number)
    .sort((a, b) => a - b);

  const quarterOrder: Record<string, number> = { 'Winter': 1, 'Spring': 2, 'Fall': 3, 'Summer': 4 };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto py-10 px-6">
        {sortedYears.map((year, yearIndex) => {
          const quarters = Object.keys(groupedCourses[year]).sort((a, b) => {
            return (quarterOrder[a] || 999) - (quarterOrder[b] || 999);
          });

          return (
            <div key={year} className={yearIndex > 0 ? 'mt-12' : ''}>
              {/* Year Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {year}
                </h2>
              </div>
              
              {/* Quarters Grid */}
              <div className="space-y-8">
                {quarters.map((quarter) => {
                  const quarterCourses = groupedCourses[year][quarter];
                  return (
                    <div key={quarter}>
                      {/* Quarter Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {quarter}
                        </h3>
                      </div>
                      
                      {/* Courses Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quarterCourses.map((course, index) => {
                          const courseColor = course.color || '#007AFF';

                          return (
                            <a
                              key={`${course.code}-${index}`}
                              href={course.catalogLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg transition-all cursor-pointer"
                              style={{
                                borderLeftWidth: '4px',
                                borderLeftColor: courseColor,
                                '--hover-color': courseColor,
                              } as React.CSSProperties & { '--hover-color': string }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderTopColor = courseColor;
                                e.currentTarget.style.borderRightColor = courseColor;
                                e.currentTarget.style.borderBottomColor = courseColor;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderTopColor = '';
                                e.currentTarget.style.borderRightColor = '';
                                e.currentTarget.style.borderBottomColor = '';
                              }}
                            >
                              <div className="flex flex-col gap-2">
                                <div 
                                  className="text-sm font-bold transition-colors"
                                  style={{ color: courseColor }}
                                >
                                  {course.code}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                  {course.name}
                                </div>
                                {course.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                                    {course.description}
                                  </div>
                                )}
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

