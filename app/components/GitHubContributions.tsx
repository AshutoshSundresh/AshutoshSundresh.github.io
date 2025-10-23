"use client";

import { useEffect, useState } from 'react';
import ContributionsGraph from './ContributionsGraph';
import type { ContributionsCanvasData, ContributionDay, ContributionWeek, Contribution, YearData } from '../types';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const USERNAME = 'AshutoshSundresh';

type ContributionsData = ContributionsCanvasData;

const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export default function GitHubContributions() {
  const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables: { username: USERNAME } }),
        });

        const data = await response.json();
        const calendar = data.data.user.contributionsCollection.contributionCalendar;
        
        // Transform data into the format expected by github-contributions-canvas
        const contributions: Contribution[] = calendar.weeks.flatMap((week: ContributionWeek) => 
          week.contributionDays.map((day: ContributionDay) => ({
            date: day.date,
            count: day.contributionCount,
            color: day.color,
            intensity: Math.min(4, Math.ceil(day.contributionCount / 2))
          }))
        );

        // Group by year
        const yearMap = new Map<string, YearData>();
        contributions.forEach((contribution: Contribution) => {
          const year = contribution.date.split('-')[0];
          if (!yearMap.has(year)) {
            yearMap.set(year, {
              year,
              total: 0,
              range: {
                start: `${year}-01-01`,
                end: `${year}-12-31`
              },
              contributions: []
            });
          }
          const yearData = yearMap.get(year)!;
          yearData.contributions.push(contribution);
          yearData.total += contribution.count;
        });

        setContributionsData({
          years: Array.from(yearMap.values()),
          contributions,
          total: calendar.totalContributions
        });
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
      <div className={`bg-black text-white p-1.5 rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[360px] xl:w-[420px] h-[200px] relative flex items-center justify-center opacity-0 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-300/40 text-white p-0.5  rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[360px] xl:w-[420px] relative ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-900`}>
      {contributionsData && (
        <div className="overflow-hidden rounded-3xl">
          <ContributionsGraph 
            data={contributionsData}
            username="AshutoshSundresh"
          />
        </div>
      )}
    </div>
  );
} 