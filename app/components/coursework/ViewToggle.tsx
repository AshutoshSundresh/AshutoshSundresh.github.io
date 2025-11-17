/**
 * View toggle component for switching between calendar and list views
 * Clean macOS-style button group
 */

interface ViewToggleProps {
  view: 'calendar' | 'list';
  onViewChange: (view: 'calendar' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg p-1 shadow-inner">
      <button
        onClick={() => onViewChange('calendar')}
        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
          view === 'calendar'
            ? 'bg-white dark:bg-[#2b2b2b] text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        Calendar
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
          view === 'list'
            ? 'bg-white dark:bg-[#2b2b2b] text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        List
      </button>
    </div>
  );
}

