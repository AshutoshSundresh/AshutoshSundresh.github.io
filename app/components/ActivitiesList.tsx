import React from 'react';
import Image from 'next/image';
import type { ActivitiesListProps } from '../types';

export default function ActivitiesList({ activities }: ActivitiesListProps) {
  return (
    <div className="mt-4 space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white dark:bg-[#2b2b2b] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="bg-gray-50 dark:bg-[#202020] p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              {activity.icon && (
                <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                  <Image src={activity.icon} alt={activity.title} fill sizes="48px" className="object-contain rounded-lg" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">{activity.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">{activity.period}</div>
              </div>
            </div>
          </div>
          <div className="p-4">
            {activity.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{activity.description}</p>
            )}
            {activity.stats && (
              <div className="grid grid-cols-2 gap-2">
                {activity.stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-[#202020] rounded-lg p-2 text-center">
                    <div className="text-base font-medium text-gray-900 dark:text-gray-200">{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            {activity.highlights && (
              <ul className={`space-y-2 ${activity.stats || activity.description ? 'mt-3' : ''}`}>
                {activity.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="flex-1 min-w-0">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
            {activity.links && (
              <div className={`flex gap-2 justify-end flex-wrap ${activity.highlights || activity.stats || activity.description ? 'mt-3' : ''}`}>
                {activity.links!.map((l, idx) => (
                  <a key={idx} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50/0 dark:bg-blue-900/0 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                    <span>{l.text}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


