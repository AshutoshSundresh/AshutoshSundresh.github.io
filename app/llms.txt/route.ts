import experienceData from "@/app/data/skeumorphicExperienceData.json";
import interestsData from "@/app/data/skeumorphicInterests.json";
import topFilms from "@/app/data/topFilms.json";

export const dynamic = "force-static";

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
        degree: string;
        gpa: string;
        period: string;
        details: {
          achievements: string[];
          courses: { code: string; name: string; quarter: string }[];
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
          subtitle: string;
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
  lines.push("- Email: ashutoshsundresh@gmail.com");
  lines.push("- GitHub: https://github.com/AshutoshSundresh");
  lines.push("- LinkedIn: https://linkedin.com/in/ashutoshsundresh");
  lines.push("- Twitter/X: https://x.com/AshutoshSundresh");
  lines.push("- Website: https://ashutoshsundresh.com");
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
      lines.push(`- **${award.title}** (${award.year}), ${award.subtitle}${highlight}${stat}`);
    }
    lines.push("");
  }

  // Education
  lines.push("## Education");
  lines.push("");
  for (const edu of educationData) {
    lines.push(`### ${edu.institution}`);
    lines.push(`- **Degree**: ${edu.degree}`);
    lines.push(`- **Period**: ${edu.period}`);
    lines.push(`- **GPA**: ${edu.gpa}`);
    if (edu.details.achievements.length > 0) {
      lines.push(`- **Honors**: ${edu.details.achievements.join(", ")}`);
    }
    const courseList = edu.details.courses
      .map((c) => `${c.code} ${c.name} (${c.quarter})`)
      .join("; ");
    lines.push(`- **Courses**: ${courseList}`);
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

  // Pages
  lines.push("## Pages");
  lines.push("");
  lines.push("- Home: https://ashutoshsundresh.com/");
  lines.push("- Experience & Projects: https://ashutoshsundresh.com/experience");
  lines.push("- Coursework: https://ashutoshsundresh.com/experience/coursework");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
