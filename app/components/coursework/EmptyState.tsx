/**
 * Empty state component when no quarter is selected
 */

export default function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-1">
          Select a quarter
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-600">
          Choose a year and quarter from the sidebar
        </div>
      </div>
    </div>
  );
}

