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
    <div className="flex bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <button
          onClick={() => onViewChange('calendar')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            view === 'calendar'
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Calendar
        </button>
        <div className="w-px bg-gray-200 dark:bg-gray-700" />
        <button
          onClick={() => onViewChange('list')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            view === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          List
        </button>
      </div>
  );
}

