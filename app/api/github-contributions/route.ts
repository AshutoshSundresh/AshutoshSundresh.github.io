import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'AshutoshSundresh';

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface Contribution {
  date: string;
  count: number;
  color: string;
  intensity: number;
}

interface YearData {
  year: string;
  total: number;
  range: {
    start: string;
    end: string;
  };
  contributions: Contribution[];
}

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

export async function GET() {
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

    return NextResponse.json({
      years: Array.from(yearMap.values()),
      contributions,
      total: calendar.totalContributions
    });
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
} 