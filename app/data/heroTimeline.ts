/**
 * Dated one-liners for the hero timeline pill (sortKey = ISO date for ordering).
 * navPath matches search destinations (see useSearchIndex / navigateFromSearchPath).
 */
export type HeroTimelineEntry = {
  sortKey: string;
  sentence: string;
  /** Same paths as search results: `/experience?tab=…` or `/#section-id` */
  navPath: string;
};

const TAB = {
  experience: '/experience?tab=experience',
  projects: '/experience?tab=projects',
  awards: '/experience?tab=awards',
  education: '/experience?tab=education',
  activities: '/experience?tab=activities',
  publications: '/experience?tab=publications',
} as const;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function formatTimelineHeading(sortKey: string): string {
  const [y, m] = sortKey.split('-').map(Number);
  if (!y || !m) return sortKey;
  return `${MONTHS[m - 1] ?? '—'} ${y}`;
}

const RAW: HeroTimelineEntry[] = [
  { sortKey: '2026-01-20', sentence: 'Promoted to USACO Gold in the USA Computing Olympiad.', navPath: TAB.awards },
  { sortKey: '2026-02-01', sentence: 'Joined UCLA PSSL under Prof. Kallas researching JVM runtimes and serverless infrastructure.', navPath: TAB.experience },
  { sortKey: '2026-02-15', sentence: 'Got Cathay Pacific Silver status and went to a business class lounge outside India for the first time.', navPath: TAB.activities },
  { sortKey: '2026-04-15', sentence: 'Started hitting the gym for the first time ever.', navPath: TAB.activities },
  { sortKey: '2026-04-20', sentence: 'Organized my second LA Hacks; pulled 2 all-nighters holding down night shifts; nearly doubled participants.', navPath: TAB.activities },
  { sortKey: '2026-05-04', sentence: 'Bought designer boxer briefs for the first time ever.', navPath: TAB.activities },
  { sortKey: '2026-06-22', sentence: 'Starting at Brain Co. as the first early career AI Platform Engineer in San Francisco.', navPath: TAB.experience },
  { sortKey: '2026-06-15', sentence: 'Attend Brown University Systems Week; eBPF, GPU performance, supply-chain security, and Rust privacy tooling.', navPath: TAB.education },
  { sortKey: '2025-07-17', sentence: 'Invited to OpenAI gpt-oss launch day; got to meet Sam Altman.', navPath: TAB.activities },
  { sortKey: '2025-09-01', sentence: 'Spent my first ever paycheck on Diesel jeans.', navPath: TAB.activities },
  { sortKey: '2025-09-07', sentence: 'Went to Japan for the first time; ate octopus, wandered Kyoto temples, got lost in Tokyo.', navPath: TAB.activities },
  { sortKey: '2025-09-11', sentence: 'Wrapped Harvey internship on agentic Word workflows, SSE LLM suggestions, and rubric-based drafting evals.', navPath: TAB.experience },
  { sortKey: '2025-09-27', sentence: 'Began tutoring lower-division CS, math, and physics in Upsilon Pi Epsilon drop-ins at UCLA.', navPath: TAB.activities },
  { sortKey: '2025-11-15', sentence: 'Took a solo flight to NYC; first time outside California since moving to the US.', navPath: TAB.activities },
  { sortKey: '2025-06-15', sentence: 'Interned at Harvey on the Embedded Experience team as their youngest engineer ever.', navPath: TAB.experience },
  { sortKey: '2025-04-01', sentence: 'Selected as a Kleiner Perkins Engineering Fellow; 1 of 30 from more than 3,000 applicants.', navPath: TAB.awards },
  { sortKey: '2025-05-31', sentence: 'Ended ELFIN CubeSat ground-control for UCLA Space Physics Group; built data visualization for TVAC lab.', navPath: TAB.activities },
  { sortKey: '2025-04-28', sentence: 'Organized my first LA Hacks; met Evan Spiegel and tons of other cool people.', navPath: TAB.activities },
  { sortKey: '2025-08-01', sentence: 'Named a William F. Sharpe Technology Fellow through UCLA Alumni programs.', navPath: TAB.awards },
  { sortKey: '2025-12-10', sentence: 'Got 8 world records on speedrun.com for Need for Speed II SE, a game I\'ve been playing since I was 4.', navPath: TAB.activities },
  { sortKey: '2025-12-15', sentence: 'Inducted into Upsilon Pi Epsilon, UCLA\'s CS honors society.', navPath: TAB.awards },
  { sortKey: '2025-01-10', sentence: 'Did my first ever job interview, with Google. Aced both rounds.', navPath: TAB.activities },
  { sortKey: '2025-01-15', sentence: 'Joined ELFIN as a ground software engineer building CubeSat operations tooling.', navPath: TAB.activities },
  { sortKey: '2024-11-01', sentence: 'Published short-term rentals vs. housing analysis in Ceteris Paribus (Shri Ram College of Commerce, Delhi).', navPath: TAB.publications },
  { sortKey: '2024-11-22', sentence: 'Drove a car for the first time, looping a parking lot in San Diego.', navPath: TAB.activities },
  { sortKey: '2024-10-01', sentence: 'Joined LA Hacks technology team for Southern California\'s flagship student hackathon.', navPath: TAB.activities },
  { sortKey: '2024-09-20', sentence: 'Finished Skylow internship as a college pre-frosh having shipped RAG search, LLM social simulations, and Rekognition moderation.', navPath: TAB.experience },
  { sortKey: '2024-09-01', sentence: 'Started the B.S. in Computer Science at UCLA (came to the US for the first time!)', navPath: TAB.education },
  { sortKey: '2024-08-31', sentence: 'Completed SRCC\'s advanced writing mentorship in Delhi; top five of 105 with highest distinction.', navPath: TAB.activities },
  { sortKey: '2024-07-01', sentence: 'Joined Skylow\'s founding engineering team in Berkeley on LLM-native social media simulation.', navPath: TAB.experience },
  { sortKey: '2024-06-01', sentence: 'Graduated Shiv Nadar School (CBSE PCM) valedictorian with AP Scholar with Distinction.', navPath: TAB.education },
  { sortKey: '2024-04-30', sentence: 'Ended daily ShapeShiftOS lead after four years; builds remain downloaded 160K+ times worldwide with 100s of downloads per week.', navPath: TAB.experience },
  { sortKey: '2024-05-01', sentence: 'Earned Grade 12 board scores of 97% with the Education Minister\'s Award (Sahodaya Utkrisht Puraskar).', navPath: TAB.awards },
  { sortKey: '2023-07-01', sentence: 'Scored 1580 SAT (800 Math) and 119/120 TOEFL for U.S. university admissions.', navPath: TAB.awards },
  { sortKey: '2023-10-14', sentence: 'Met a ShapeShiftOS team member in person for the first time; we\'d built a whole OS together over the internet.', navPath: TAB.experience },
  { sortKey: '2022-07-01', sentence: 'ShapeShiftOS got its first download from Greenland.', navPath: TAB.experience },
  { sortKey: '2024-04-19', sentence: 'Gold in Math at Philippine International Math & Science Olympics; world rank 3; Pimsolver\'s Cup; national rank 1.', navPath: TAB.awards },
  { sortKey: '2023-11-12', sentence: 'Bronze at Southeast Asian Mathematical Olympiad (SEAMO), national rank 6; invited to SEAMO X finals in Singapore.', navPath: TAB.awards },
  { sortKey: '2023-10-28', sentence: 'Silver at Fermat Mathematical Olympiad (Vietnam), national rank 7; invited to the final round in Vietnam.', navPath: TAB.awards },
  { sortKey: '2023-10-27', sentence: 'Silver in Math at Asia Science & Maths Olympiad (ASMO) finals in Malaysia.', navPath: TAB.awards },
  { sortKey: '2023-10-27', sentence: 'Gold at Math Day 2023, Department of Mathematics, Shiv Nadar University.', navPath: TAB.awards },
  { sortKey: '2023-07-26', sentence: 'First place at Neerja Modi Mathelogics Symposium; paper on chaos theory and traffic congestion dynamics.', navPath: TAB.awards },
  { sortKey: '2023-06-17', sentence: 'Bronze at Hong Kong International Mathematical Olympiad global finals, team rank 7 (OCEC).', navPath: TAB.awards },
  { sortKey: '2023-06-01', sentence: 'Attended International Linguistics Olympiad (IOL) finalists\' camp at IIIT Hyderabad.', navPath: TAB.awards },
  { sortKey: '2023-04-23', sentence: 'Represented India at the Asia Pacific Linguistics Olympiad (APLO).', navPath: TAB.awards },
  { sortKey: '2022-06-15', sentence: 'Received SourceForge\'s Open Source Excellence award; ShapeShiftOS in the top 0.5% of open-source projects.', navPath: TAB.awards },
  { sortKey: '2022-06-01', sentence: 'Ranked first statewide in CBSE Grade 10 boards with a 99.2% aggregate.', navPath: TAB.awards },
  { sortKey: '2021-06-01', sentence: 'Became the youngest XDA Recognized Developer for Android work at age fifteen.', navPath: TAB.awards },
  { sortKey: '2020-10-01', sentence: 'Someone made a YouTube video about ShapeShiftOS that got thousands of views; without telling me.', navPath: TAB.experience },
  { sortKey: '2020-04-01', sentence: 'Wrote my first line of Android code; changing the color of the brightness slider in quick settings.', navPath: TAB.experience },
  { sortKey: '2020-05-16', sentence: 'Founded ShapeShiftOS; custom Android OS that later reached 160+ countries without paid marketing.', navPath: TAB.experience },
  { sortKey: '2019-12-20', sentence: 'Went to Dubai over winter break and couldn\'t breathe the whole time; probably COVID.', navPath: TAB.activities },
  { sortKey: '2018-08-01', sentence: 'Found a Hot Wheels Super Treasure Hunt 934.5 in a supermarket; now worth over $200.', navPath: TAB.activities },
  { sortKey: '2018-03-01', sentence: 'Made a YouTube video explaining bootloaders and recoveries at age 12. Kinda funny in retrospect.', navPath: TAB.activities },
  { sortKey: '2015-08-01', sentence: 'Got my first phone, a Meizu M2 Note. Bricked it multiple times trying to install custom ROMs.', navPath: TAB.activities },
  { sortKey: '2015-04-01', sentence: 'Wrote my first pieces of code; basic Python scripts.', navPath: TAB.activities },
  { sortKey: '2014-12-01', sentence: 'Flew internationally for the first time: India to Singapore. Cried on day one because of the humidity.', navPath: TAB.activities },
];

/** Newest first */
export const HERO_TIMELINE: HeroTimelineEntry[] = [...RAW].sort((a, b) =>
  a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : 0
);
