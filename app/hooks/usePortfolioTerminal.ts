"use client";

import { useEffect } from 'react';
import useTerminal from './useTerminal';
import useAppOverlayState from './useAppOverlayState';
import type {
  Project,
  Publication,
  Activity,
  EducationEntry,
  ExperienceEntry,
  AwardCategory,
} from '../types';

interface PortfolioData {
  projects: Project[];
  educationData: EducationEntry[];
  experienceData: ExperienceEntry[];
  awardsData: AwardCategory[];
  publications: Publication[];
  activitiesData: Activity[];
}

interface UsePortfolioTerminalProps extends PortfolioData {
  isMobile: boolean;
  isReady: boolean;
  isMobileLayout: boolean;
  pathname: string;
  getMobileOverlayFromHistory: () => 'terminal' | 'lockscreen' | null;
}

export default function usePortfolioTerminal({
  isMobile,
  isReady,
  isMobileLayout,
  pathname,
  getMobileOverlayFromHistory,
  projects,
  educationData,
  experienceData,
  awardsData,
  publications,
  activitiesData,
}: UsePortfolioTerminalProps) {
  const { setTerminalActive } = useAppOverlayState();

  const terminal = useTerminal({
    isMobile,
    getLinesForCommand: (command: string) => {
      // ── ls ───────────────────────────────────────────────────────
      if (command === 'ls') return [
        'total 6',
        'drwxr-xr-x  experience/',
        'drwxr-xr-x  education/',
        'drwxr-xr-x  projects/',
        'drwxr-xr-x  awards/',
        'drwxr-xr-x  publications/',
        'drwxr-xr-x  activities/',
      ];

      if (command === 'ls projects') return [
        `${projects.length} project(s):`,
        '',
        ...projects.flatMap(p => [
          `  ${p.name}`,
          ...(p.techstack ? [`  ├── tech:    ${p.techstack}`] : []),
          `  └── link:    ${p.link || 'N/A'}`,
          '',
        ]),
      ];

      if (command === 'ls education') return [
        `${educationData.length} education entry/entries:`,
        '',
        ...educationData.flatMap(edu => [
          `  ${edu.institution}`,
          ...(edu.degree ? [`  ├── ${edu.degree}`] : []),
          ...(edu.gpa ? [`  ├── GPA: ${edu.gpa}`] : []),
          `  └── ${edu.period}`,
          '',
        ]),
      ];

      if (command === 'ls experience') return [
        `${experienceData.length} experience entry/entries:`,
        '',
        ...experienceData.flatMap(exp => [
          `  ${exp.company}`,
          `  ├── ${exp.position}`,
          `  └── ${exp.period}`,
          '',
        ]),
      ];

      if (command === 'ls awards') return awardsData.flatMap(cat => [
        `[ ${cat.category} ]`,
        ...cat.awards.map(a =>
          `  ${a.title}${a.year ? '  (' + a.year + ')' : ''}${a.highlight ? '  — ' + a.highlight : ''}`
        ),
        '',
      ]);

      if (command === 'ls publications') return [
        `${publications.length} publication(s):`,
        '',
        ...publications.map(p => `  ${p.title}  (${p.year})`),
        '',
      ];

      if (command === 'ls activities') return [
        `${activitiesData.length} activity/activities:`,
        '',
        ...activitiesData.flatMap(a => [
          `  ${a.title}`,
          `  └── ${a.period}`,
          '',
        ]),
      ];

      // ── cat ──────────────────────────────────────────────────────
      if (command === 'cat about.txt') {
        const edu = educationData[0];
        const achievements = edu?.details?.achievements || [];
        const latestJob = experienceData[0];
        const allJobs = experienceData.map(e => `${e.position} @ ${e.company}`);
        const shapeshift = projects.find(p => p.name === 'ShapeShiftOS');
        const downloads = shapeshift?.stats?.find(s => s.label === 'Downloads')?.value;
        const countries = shapeshift?.stats?.find(s => s.label === 'Countries')?.value;
        const allAwards = awardsData.flatMap(c => c.awards);
        const topAwards = allAwards.filter(a => a.highlight).slice(0, 3).map(a =>
          `${a.title}${a.highlight ? ' (' + a.highlight + ')' : ''}`
        );
        return [
          '╔════════════════════════════════════════╗',
          '║           ASHUTOSH SUNDRESH            ║',
          '╚════════════════════════════════════════╝',
          '',
          ...(edu ? [
            `${edu.degree || ''} @ ${edu.institution} (${edu.period})`,
            ...(edu.gpa ? [`GPA: ${edu.gpa}${achievements.length ? '  •  ' + achievements.join(', ') : ''}`] : []),
          ] : []),
          '',
          ...(latestJob ? [`Current: ${latestJob.position} @ ${latestJob.company} (${latestJob.period})`] : []),
          ...(allJobs.length > 1 ? [`Past:    ${allJobs.slice(1, 3).join('  •  ')}`] : []),
          '',
          ...(shapeshift ? [
            `Open source founder: ${shapeshift.name}`,
            ...(downloads ? [`${downloads} downloads across ${countries ?? '?'} countries`] : []),
          ] : []),
          '',
          ...(topAwards.length ? ['Selected awards:', ...topAwards.map(a => `  ${a}`)] : []),
          '',
        ];
      }

      if (command === 'cat resume.txt') {
        const allAwards = awardsData.flatMap(c => c.awards);
        const topAwards = allAwards.filter(a => a.highlight || a.subtitle).slice(0, 4);
        return [
          '╔════════════════════════════════════════╗',
          '║              RESUME SUMMARY            ║',
          '╚════════════════════════════════════════╝',
          '',
          'EDUCATION',
          ...educationData.map(e => `  ${e.institution} — ${e.degree || ''} (${e.period})${e.gpa ? '  GPA: ' + e.gpa : ''}`),
          '',
          'EXPERIENCE',
          ...experienceData.map(e => `  ${e.company} — ${e.position} (${e.period})`),
          '',
          'PROJECTS',
          ...projects.map(p => `  ${p.name}${p.techstack ? '  [' + p.techstack + ']' : ''}`),
          '',
          'SELECTED AWARDS',
          ...topAwards.map(a => `  ${a.title}${a.highlight ? '  (' + a.highlight + ')' : ''}`),
          '',
        ];
      }

      if (command === 'cat skills.txt') {
        const allTech = [...new Set(
          projects
            .filter(p => p.techstack)
            .flatMap(p => p.techstack!.split(/,\s*/).map((t: string) => t.trim()))
        )];
        return [
          'TECH SKILLS  (derived from projects)',
          '',
          ...allTech.map((t: string) => `  ${t}`),
          '',
        ];
      }

      if (command === 'cat contact.txt') {
        const projectLinks = projects.filter(p => p.link).map(p => `  ${p.name.padEnd(20)}${p.link}`);
        const companyLinks = experienceData.filter(e => e.companyLink).map(e => `  ${e.company.padEnd(20)}${e.companyLink}`);
        return [
          '╔════════════════════════════════════════╗',
          '║             CONTACT & LINKS            ║',
          '╚════════════════════════════════════════╝',
          '',
          'SOCIAL',
          '  Email'.padEnd(22) + 'ashutoshsun@g.ucla.edu',
          '  GitHub'.padEnd(22) + 'https://github.com/ashutoshsundresh',
          '  LinkedIn'.padEnd(22) + 'https://linkedin.com/in/asund',
          '  X (Twitter)'.padEnd(22) + 'https://twitter.com/asundresh',
          '',
          ...(projectLinks.length ? ['PROJECT REPOS', ...projectLinks, ''] : []),
          ...(companyLinks.length ? ['COMPANIES', ...companyLinks, ''] : []),
        ];
      }

      // ── whois ────────────────────────────────────────────────────
      if (command === 'whois' || command.startsWith('whois ashutosh')) {
        const edu = educationData[0];
        const allJobs = experienceData;
        const allAwards = awardsData.flatMap(c => c.awards);
        const notable = allAwards.filter(a => a.highlight).slice(0, 4);
        const allTech = [...new Set(
          projects.filter(p => p.techstack).flatMap(p => p.techstack!.split(/,\s*/).map((t: string) => t.trim()))
        )];
        return [
          'ashutosh sundresh',
          '',
          ...(edu ? [
            `  school:    ${edu.institution} (${edu.period})`,
            ...(edu.gpa ? [`  gpa:       ${edu.gpa}`] : []),
          ] : []),
          ...(allJobs.length ? [`  current:   ${allJobs[0].position} @ ${allJobs[0].company}`] : []),
          '',
          '  experience:',
          ...allJobs.map(e => `    ${e.company} — ${e.position}`),
          '',
          ...(notable.length ? [
            '  notable awards:',
            ...notable.map(a => `    ${a.title}${a.highlight ? '  (' + a.highlight + ')' : ''}`),
          ] : []),
          '',
          ...(allTech.length ? [`  tech:      ${allTech.slice(0, 8).join('  ')}`] : []),
          '',
        ];
      }

      // ── neofetch ─────────────────────────────────────────────────
      if (command === 'neofetch') {
        const edu = educationData[0];
        const latestJob = experienceData[0];
        const allTech = [...new Set(
          projects.filter(p => p.techstack).flatMap(p => p.techstack!.split(/,\s*/).map((t: string) => t.trim()))
        )];
        const allAwards = awardsData.flatMap(c => c.awards);
        const L = (label: string, value: string) => `${label.padEnd(13)}${value}`;
        const ascii = [
          '          ___          ',
          '         /\\  \\         ',
          '        /  \\  \\        ',
          '       / /\\ \\  \\       ',
          '      / /  \\ \\  \\      ',
          '     / /__/ \\ \\  \\     ',
          '    /\\       \\ \\  \\    ',
          '   / /\\ \\     \\ \\  \\   ',
          '  / /  \\ \\     \\ \\  \\  ',
          ' /_/__/ \\ \\____ \\ \\__\\ ',
          ' \\ \\  \\  \\/__/ / /  /  ',
          '  \\ \\  \\      / /  /   ',
          '   \\ \\  \\    / /  /    ',
          '    \\ \\__\\  / /__/     ',
          '     \\/__/ /\\__\\       ',
          '           \\/__/       ',
          '                       ',
          '                       ',
          '                       ',
          '                       ',
        ];
        const info: string[] = [
          'ashutosh@portfolio',
          '──────────────────',
          L('OS:', 'Portfolio Darwin 1.0'),
          L('Host:', 'ashutoshsundresh.com'),
          L('Kernel:', 'Next.js 15 (Turbopack)'),
          L('Shell:', 'zsh 5.9'),
          L('Packages:', `${projects.length} projects shipped`),
          L('Uptime:', 'always on'),
          '',
          ...(edu ? [
            L('School:', edu.institution),
            ...(edu.degree ? [L('Degree:', edu.degree + (edu.period ? `  (${edu.period})` : ''))] : []),
            ...(edu.gpa ? [L('GPA:', edu.gpa)] : []),
          ] : []),
          '',
          ...(latestJob ? [L('Role:', `${latestJob.position} @ ${latestJob.company}`)] : []),
          L('Experience:', `${experienceData.length} compan${experienceData.length === 1 ? 'y' : 'ies'}`),
          L('Projects:', `${projects.length} total`),
          L('Awards:', `${allAwards.length} total`),
          ...(publications.length ? [L('Publications:', `${publications.length} paper${publications.length === 1 ? '' : 's'}`)] : []),
          ...(allTech.length ? [L('Languages:', allTech.slice(0, 7).join('  '))] : []),
        ];
        const PAD = 24;
        const rows = Math.max(ascii.length, info.length);
        const lines: string[] = [];
        for (let i = 0; i < rows; i++) {
          const a = (ascii[i] ?? '').padEnd(PAD);
          const d = info[i] ?? '';
          lines.push(d ? `${a}${d}` : a.trimEnd());
        }
        return [...lines, ''];
      }

      // ── grep ─────────────────────────────────────────────────────
      if (command === 'grep') return ['grep: missing search term', 'usage: grep <term>', ''];
      if (command.startsWith('grep ')) {
        const term = command.slice(5).trim();
        if (!term) return ['grep: missing search term', 'usage: grep <term>', ''];
        const results: string[] = [];
        projects.forEach(p => {
          const hay = `${p.name} ${p.techstack || ''} ${p.description} ${p.caption}`.toLowerCase();
          if (hay.includes(term)) results.push(`projects/${p.name}`);
        });
        experienceData.forEach(exp => {
          const hay = `${exp.company} ${exp.position} ${exp.description.join(' ')}`.toLowerCase();
          if (hay.includes(term)) results.push(`experience/${exp.company}: ${exp.position}`);
        });
        educationData.forEach(edu => {
          const hay = `${edu.institution} ${edu.degree || ''} ${edu.gpa || ''}`.toLowerCase();
          if (hay.includes(term)) results.push(`education/${edu.institution}`);
        });
        awardsData.forEach(cat => {
          cat.awards.forEach(award => {
            const hay = `${award.title} ${award.subtitle || ''} ${award.description || ''}`.toLowerCase();
            if (hay.includes(term)) results.push(`awards/${award.title}`);
          });
        });
        publications.forEach(pub => {
          const hay = `${pub.title} ${pub.description} ${pub.journal || ''}`.toLowerCase();
          if (hay.includes(term)) results.push(`publications/${pub.title}`);
        });
        activitiesData.forEach(act => {
          const hay = `${act.title} ${act.description}`.toLowerCase();
          if (hay.includes(term)) results.push(`activities/${act.title}`);
        });
        if (!results.length) return [`grep: no matches for "${term}"`, ''];
        return [...results, '', `${results.length} result(s) for "${term}"`];
      }

      // ── find ─────────────────────────────────────────────────────
      if (command === 'find') return ['find: missing search name', 'usage: find <name>', ''];
      if (command.startsWith('find ')) {
        const term = command.slice(5).trim();
        if (!term) return ['find: missing search name', 'usage: find <name>', ''];
        const results: string[] = [];
        projects.forEach(p => {
          if (p.name.toLowerCase().includes(term)) results.push(`./projects/${p.name}`);
        });
        experienceData.forEach(exp => {
          if (exp.company.toLowerCase().includes(term) || exp.position.toLowerCase().includes(term))
            results.push(`./experience/${exp.company}`);
        });
        educationData.forEach(edu => {
          if (edu.institution.toLowerCase().includes(term)) results.push(`./education/${edu.institution}`);
        });
        awardsData.forEach(cat => {
          cat.awards.forEach(award => {
            if (award.title.toLowerCase().includes(term)) results.push(`./awards/${award.title}`);
          });
        });
        activitiesData.forEach(act => {
          if (act.title.toLowerCase().includes(term)) results.push(`./activities/${act.title}`);
        });
        if (!results.length) return [`find: no entries matching "${term}"`, ''];
        return results;
      }

      // ── cd ───────────────────────────────────────────────────────
      if (command.startsWith('cd ') || command === 'cd') {
        const dir = command.slice(3).trim() || '~';
        return [`cd: this is a web portfolio — use the GUI tabs to navigate to "${dir}"`, ''];
      }

      // ── known commands with bad args ─────────────────────────────
      if (command.startsWith('ls ')) {
        const dir = command.slice(3).trim();
        const valid = ['projects', 'experience', 'education', 'awards', 'publications', 'activities'];
        if (!valid.includes(dir))
          return [`ls: ${dir}: No such file or directory`, `valid sections: ${valid.join('  ')}`, ''];
      }

      if (command === 'cat') return ['cat: missing file operand', 'usage: cat <file>', 'files: about.txt  resume.txt  skills.txt  contact.txt', ''];

      if (command.startsWith('cat ')) {
        const file = command.slice(4).trim();
        const valid = ['about.txt', 'resume.txt', 'skills.txt', 'contact.txt'];
        if (!valid.includes(file))
          return [`cat: ${file}: No such file or directory`, `available files: ${valid.join('  ')}`, ''];
      }

      if (command === 'whois') return null;
      if (command.startsWith('whois ')) {
        const target = command.slice(6).trim();
        return [`whois: ${target}: host not found`, 'try: whois ashutosh', ''];
      }

      return null;
    },
  });

  // Sync terminal active state for global overlay tracking
  useEffect(() => {
    setTerminalActive(terminal.terminalMode);
  }, [terminal.terminalMode, setTerminalActive]);

  // Push/pop terminal history entry so the browser back button closes the terminal
  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    const currentOverlay = getMobileOverlayFromHistory();
    const overlayUrl = isMobileLayout ? pathname : window.location.href;

    if (terminal.terminalMode) {
      if (currentOverlay !== 'terminal') {
        window.history.pushState(
          {
            ...(window.history.state ?? {}),
            __skeuManaged: true,
            __skeuScreen: 'home',
            __skeuTab: null,
            __skeuDetail: null,
            __skeuOverlay: 'terminal',
          },
          '',
          overlayUrl
        );
      }
      return;
    }

    if (currentOverlay === 'terminal') {
      window.history.back();
    }
  }, [terminal.terminalMode, isReady, isMobileLayout, pathname, getMobileOverlayFromHistory]);

  return terminal;
}
