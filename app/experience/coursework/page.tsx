'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import type { Course } from '../../types';

// Lazy load the CourseworkPage component for code splitting
const CourseworkPage = lazy(() => import('../../components/coursework/CourseworkPage'));

// Component that loads data asynchronously
function CourseworkContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic import of JSON data - this will be loaded asynchronously
    async function loadCourseworkData() {
      try {
        const skeumorphicData = await import('../../data/skeumorphicData.json');
        const uclaEducation = skeumorphicData.default.educationData.find(
          (edu: { institution: string }) => edu.institution === 'University of California, Los Angeles'
        );
        const loadedCourses = (uclaEducation?.details.courses || []) as Course[];
        setCourses(loadedCourses);
      } catch (error) {
        console.error('Failed to load coursework data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCourseworkData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[2000] bg-white dark:bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading coursework...</div>
      </div>
    );
  }

  return <CourseworkPage courses={courses} />;
}

export default function Coursework() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[2000] bg-white dark:bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading coursework...</div>
      </div>
    }>
      <CourseworkContent />
    </Suspense>
  );
}

