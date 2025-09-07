import React from 'react';
import type { Activity } from '../types';

interface ActivitiesListProps {
  activities: Activity[];
}

export default function ActivitiesList({ activities }: ActivitiesListProps) {
  return (
    <div className="mt-4 space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-start">
              {activity.icon && (
                <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                  <img src={activity.icon} alt={activity.title} className="w-full h-full object-contain rounded-lg" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                <div className="text-sm text-gray-500">{activity.period}</div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600">{activity.description}</p>
            {activity.stats && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {activity.stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-base font-medium text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            {activity.highlights && (
              <ul className="mt-3 space-y-2">
                {activity.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="flex-1 min-w-0">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
            {(activity as Activity).links && (
              <div className="mt-3 flex gap-2 justify-end flex-wrap">
                {(activity as Activity).links!.map((l, idx) => (
                  <a key={idx} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50/0 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
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


