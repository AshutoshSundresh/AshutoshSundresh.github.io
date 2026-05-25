import experienceData from "@/app/data/skeumorphicExperienceData.json";
import interestsData from "@/app/data/skeumorphicInterests.json";
import topFilms from "@/app/data/topFilms.json";
import { CONTACT } from "@/app/constants/contact";

export const dynamic = "force-static";

const BASE_URL = "https://ashutoshsundresh.com";
const QUARTER_ORDER: Record<string, number> = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

function addField(lines: string[], label: string, value?: string) {
  if (value) {
    lines.push(`- **${label}**: ${value}`);
  }
}

function getCourseSortKey(course: { quarter: string }) {
  const [term, year] = course.quarter.split(" ");
  return [Number(year) || 0, QUARTER_ORDER[term] ?? 99] as const;
}

export function GET() {
  const { projects, educationData, experienceData: workHistory, awardsData } =
    experienceData as {
      projects: {
        name: string;
        caption: string;
        techstack: string;
        description: string;
        link: string;
        stats?: { label: string; value: string }[];
      }[];
      educationData: {
        institution: string;
        degree?: string;
        gpa?: string;
        period: string;
        details: {
          achievements?: string[];
          courses?: { code: string; name: string; quarter: string }[];
          subjects?: string[];
        };
      }[];
      experienceData: {
        company: string;
        position: string;
        period: string;
        description: string[];
        companyLink?: string;
      }[];
      awardsData: {
        category: string;
        awards: {
          title: string;
          subtitle?: string;
          year: string;
          highlight?: string;
          stats?: string;
          description?: string;
        }[];
      }[];
    };

  const lines: string[] = [];

  lines.push("# Ashutosh Sundresh");
  lines.push("");
  lines.push(
    "> Computer Science student at UCLA, open-source developer, and Kleiner Perkins Fellow. Building at the intersection of systems programming, mobile OS, and developer tooling."
  );
  lines.push("");

  // About
  lines.push("## About");
  lines.push("");
  lines.push(
    "Ashutosh Sundresh is a BS Computer Science student at the University of California, Los Angeles (2024–2028)."
  );
  lines.push("");
  lines.push(`- Email: ${CONTACT.email}`);
  lines.push(`- GitHub: ${CONTACT.github}`);
  lines.push(`- LinkedIn: ${CONTACT.linkedin}`);
  lines.push(`- Twitter/X: ${CONTACT.x}`);
  lines.push(`- Website: ${BASE_URL}`);
  lines.push("");
  lines.push("## Website Map");
  lines.push("");
  lines.push(`- [Home](${BASE_URL}/): Overview, current work, and contact links.`);
  lines.push(
    `- [Experience & Projects](${BASE_URL}/experience): Work history, projects, education, awards, publications, and activities.`
  );
  lines.push(
    `- [Coursework](${BASE_URL}/experience/coursework): UCLA course history and academic planning.`
  );
  lines.push("");

  // Work Experience
  lines.push("## Work Experience");
  lines.push("");
  for (const job of workHistory) {
    lines.push(`### ${job.position} at ${job.company}`);
    lines.push(`- **Period**: ${job.period}`);
    if (job.companyLink) lines.push(`- **Link**: ${job.companyLink}`);
    for (const bullet of job.description) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }

  // Awards & Recognition
  lines.push("## Awards & Recognition");
  lines.push("");
  for (const category of awardsData) {
    lines.push(`### ${category.category}`);
    for (const award of category.awards) {
      const highlight = award.highlight ? ` (${award.highlight})` : "";
      const stat = award.stats ? ` — ${award.stats}` : "";
      const subtitle = award.subtitle ? `, ${award.subtitle}` : "";
      lines.push(`- **${award.title}** (${award.year})${subtitle}${highlight}${stat}`);
    }
    lines.push("");
  }

  // Education
  lines.push("## Education");
  lines.push("");
  for (const edu of educationData) {
    lines.push(`### ${edu.institution}`);
    addField(lines, "Degree", edu.degree);
    addField(lines, "Period", edu.period);
    addField(lines, "GPA", edu.gpa);
    if (edu.details.achievements?.length) {
      lines.push(`- **Honors**: ${edu.details.achievements.join(", ")}`);
    }
    if (edu.details.courses?.length) {
      const courseList = edu.details.courses
        .toSorted((a, b) => {
          const [yearA, quarterA] = getCourseSortKey(a);
          const [yearB, quarterB] = getCourseSortKey(b);
          return yearA - yearB || quarterA - quarterB;
        })
        .map((c) => `${c.code} ${c.name} (${c.quarter})`)
        .join("; ");
      lines.push(`- **Courses**: ${courseList}`);
    }
    if (edu.details.subjects?.length) {
      lines.push(`- **Topics**: ${edu.details.subjects.join(", ")}`);
    }
    lines.push("");
  }

  // Projects
  lines.push("## Projects");
  lines.push("");
  for (const project of projects) {
    lines.push(`### ${project.name}`);
    lines.push(`- **Tech**: ${project.techstack}`);
    lines.push(`- **Link**: ${project.link}`);
    if (project.stats) {
      const statStr = project.stats.map((s) => `${s.label}: ${s.value}`).join(", ");
      lines.push(`- **Stats**: ${statStr}`);
    }
    lines.push(`- ${project.description}`);
    lines.push("");
  }

  // Interests
  lines.push("## Interests");
  lines.push("");
  const interests = (interestsData as { interests: Record<string, string> }).interests;
  for (const [topic, desc] of Object.entries(interests)) {
    lines.push(`### ${topic}`);
    lines.push(desc);
    lines.push("");
  }

  // Top Films
  const filmTitles = (topFilms as { title: string; filmUrl: string }[])
    .map((f) => f.title)
    .join(", ");
  lines.push("### Films");
  lines.push(`Favourite films: ${filmTitles}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
