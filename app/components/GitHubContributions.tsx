"use client";

import { useEffect, useState } from 'react';
import ContributionsGraph from './ContributionsGraph';

export default function GitHubContributions() {
  const [contributionsData, setContributionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch('/api/github-contributions');
        const data = await response.json();
        setContributionsData(data);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black text-white p-1.5 rounded-3xl w-[360px] h-[200px] relative cursor-move touch-none shadow-lg hover:shadow-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-1.5 rounded-3xl w-[360px] relative cursor-move touch-none shadow-lg hover:shadow-xl">
      {contributionsData && (
        <div className="overflow-hidden rounded-2xl">
          <ContributionsGraph 
            data={contributionsData}
            username="AshutoshSundresh"
          />
        </div>
      )}
    </div>
  );
} 