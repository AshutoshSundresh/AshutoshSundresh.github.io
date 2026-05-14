import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useAppOverlayState from '../hooks/useAppOverlayState';
import IOSLockscreen from './IOSLockscreen';
import DesktopLockscreen from './DesktopLockscreen';
import PublicationsGrid from './PublicationsGrid';
import ActivitiesList from './ActivitiesList';
import ProjectsGrid from './ProjectsGrid';
import AwardsMasonry from './AwardsMasonry';
import EducationList from './EducationList';
import ExperienceList from './ExperienceList';
import useTerminal from '../hooks/useTerminal';
import TerminalOverlay from './TerminalOverlay';
import SearchOverlay from './SearchOverlay';
import SkeumorphicDesktopShell from './SkeumorphicDesktopShell';
import SkeumorphicMobileShell from './SkeumorphicMobileShell';
import rawData from '../data/skeumorphicExperienceData.json';
import type {
  SkeumorphicExperienceData,
  Project,
  Publication,
  Activity,
  EducationEntry,
  ExperienceEntry,
  AwardCategory,
} from '../types';
import useWindowInfo from '../hooks/useWindowInfo';
import useProgressiveBackground from '../hooks/useProgressiveBackground';
import { getBlurDataURL } from '../constants/blurPlaceholder';
import useTabHistory from '../hooks/useTabHistory';
import useClickOutside from '../hooks/useClickOutside';
import { useTheme } from '../contexts/ThemeContext';
import {
  MOBILE_APP_GRADIENTS,
  TAB_INDEX_TO_NAME,
  TAB_NAME_TO_INDEX,
  type MobileAppDefinition,
  type SkeumorphicTab,
} from './skeumorphic/shared';

type ProjectDetails = Project;

const TABS: SkeumorphicTab[] = [
  { id: 0, title: 'Experience', content: 'Professional experience and internships' },
  { id: 1, title: 'Awards', content: 'Honors and recognition' },
  { id: 2, title: 'Education', content: 'Academic background and achievements' },
  { id: 3, title: 'Projects', content: 'Git repositories and development projects' },
  { id: 4, title: 'Publications', content: 'Research papers and publications' },
  { id: 5, title: 'Activities', content: 'Extracurricular and leadership activities' },
];

type MobileOverlayKind = 'terminal' | 'lockscreen';

const MacOSWindow = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toggleTheme, isDark } = useTheme();
  const initialTab = useMemo(() => {
    const tabParam = searchParams?.get('tab');
    if (!tabParam) return 0;
    const idx = TAB_NAME_TO_INDEX[String(tabParam).toLowerCase()];
    return typeof idx === 'number' ? idx : 0;
  }, [searchParams]);
  const { activeTab, handleTabChange, handleBack, handleForward, tabHistory, currentHistoryIndex } = useTabHistory(initialTab);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileActiveApp, setMobileActiveApp] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInternalMobileNavigationRef = useRef(false);
  const tabs = TABS;

  const windowHeight = useWindowInfo();

  const {
    terminalMode,
    setTerminalMode,
    terminalInput,
    setTerminalInput,
    terminalOutput,
    terminalInputRef,
    terminalOutputRef,
    onKeyDown,
  } = useTerminal({
    isMobile: windowHeight.isMobile,
    getLinesForCommand: (command: string) => {
      // ls with no args
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

      // cat commands
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
        const projectLinks = projects.filter(p => p.link).map(p => `  ${p.name}: ${p.link}`);
        const companyLinks = experienceData.filter(e => e.companyLink).map(e => `  ${e.company}: ${e.companyLink}`);
        return [
          '╔════════════════════════════════════════╗',
          '║             CONTACT & LINKS            ║',
          '╚════════════════════════════════════════╝',
          '',
          'Project repos:',
          ...projectLinks,
          '',
          'Companies:',
          ...companyLinks,
          '',
        ];
      }

      // whois
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

      // neofetch
      if (command === 'neofetch') {
        const edu = educationData[0];
        const latestJob = experienceData[0];
        const allTech = [...new Set(
          projects.filter(p => p.techstack).flatMap(p => p.techstack!.split(/,\s*/).map((t: string) => t.trim()))
        )];
        const topAward = awardsData.flatMap(c => c.awards).find(a => a.highlight);
        const ascii = [
          '         ___',
          '        /\\  \\',
          '       /  \\  \\',
          '      / /\\ \\  \\',
          '     / /  \\ \\  \\',
          '    / /__/ \\ \\  \\',
          '   /\\       \\ \\  \\',
          '  / /\\ \\     \\ \\  \\',
          ' / /  \\ \\     \\ \\  \\',
          '/_/__/ \\ \\____ \\ \\__\\',
          '\\ \\  \\  \\/__/ / /  /',
          ' \\ \\  \\      / /  /',
          '  \\ \\  \\    / /  /',
          '   \\ \\__\\  / /__/',
          '    \\/__/ /\\__\\',
          '          \\/__/',
        ];
        const info = [
          'ashutosh@portfolio',
          '------------------',
          'OS:      Portfolio Darwin',
          'Host:    ashutoshsundresh.com',
          'Kernel:  Next.js 15',
          'Shell:   zsh',
          edu ? `School:  ${edu.institution}` : '',
          edu?.gpa ? `GPA:     ${edu.gpa}` : '',
          latestJob ? `Status:  ${latestJob.position} @ ${latestJob.company}` : '',
          topAward ? `Award:   ${topAward.title}${topAward.highlight ? ' (' + topAward.highlight + ')' : ''}` : '',
          allTech.length ? `Memory:  ${allTech.slice(0, 5).join(' ')}` : '',
          'Github:  AshutoshSundresh',
          'Web:     ashutoshsundresh.com',
        ].filter(Boolean);
        const rows = Math.max(ascii.length, info.length);
        const lines: string[] = [];
        for (let i = 0; i < rows; i++) {
          const a = (ascii[i] || '').padEnd(22);
          const d = info[i] || '';
          lines.push(d ? `${a}  ${d}` : a.trimEnd());
        }
        return [...lines, ''];
      }

      // grep
      if (command.startsWith('grep ')) {
        const term = command.slice(5).trim();
        if (!term) return ['usage: grep <term>'];
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

      // find
      if (command.startsWith('find ')) {
        const term = command.slice(5).trim();
        if (!term) return ['usage: find <name>'];
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

      // cd
      if (command.startsWith('cd ') || command === 'cd') {
        const dir = command.slice(3).trim() || '~';
        return [`cd: this is a web portfolio — use the GUI tabs to navigate to "${dir}"`, ''];
      }

      return null;
    },
  });
  const [lockscreenVisible, setLockscreenVisible] = useState(false);

  const { setTerminalActive, setLockscreenActive } = useAppOverlayState();

  useEffect(() => {
    setTerminalActive(terminalMode);
  }, [terminalMode, setTerminalActive]);

  useEffect(() => {
    setLockscreenActive(lockscreenVisible);
  }, [lockscreenVisible, setLockscreenActive]);

  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  const handleOutsideContentClick = useCallback((event: MouseEvent) => {
    const detailView = document.querySelector('[data-detail-view]');
    if (detailView && detailView.contains(event.target as Node)) return;
    setSelectedItem(null);
  }, []);

  const handleOutsideMobileMenuClick = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  useClickOutside(contentRef as React.RefObject<HTMLElement | null>, handleOutsideContentClick);
  useClickOutside(mobileMenuRef as React.RefObject<HTMLElement | null>, handleOutsideMobileMenuClick);

  const onTabChange = useCallback(
    (index: number) => {
      setSelectedItem(null);
      handleTabChange(index);
    },
    [handleTabChange]
  );

  const contentHeight = windowHeight.isMobile
    ? 'calc(100dvh - 2.5rem)'
    : `${Math.max(windowHeight.vh * 0.6, 400)}px`;

  const data: SkeumorphicExperienceData = rawData as SkeumorphicExperienceData;
  const projects: ProjectDetails[] = useMemo(
    () =>
      data.projects.map((p) => ({
        ...p,
        created: new Date(p.created),
      })),
    [data.projects]
  );
  const folderIconUrl = useMemo(() => data.folderIconUrl, [data.folderIconUrl]);
  const educationData: EducationEntry[] = useMemo(() => data.educationData, [data.educationData]);
  const experienceData: ExperienceEntry[] = useMemo(() => data.experienceData, [data.experienceData]);
  const awardsData: AwardCategory[] = useMemo(() => data.awardsData, [data.awardsData]);
  const publications: Publication[] = useMemo(() => data.publications, [data.publications]);
  const activitiesData: Activity[] = useMemo(() => data.activitiesData, [data.activitiesData]);
  const courseworkCourses = useMemo(
    () => educationData.find((edu) => edu.institution === 'University of California, Los Angeles')?.details.courses || [],
    [educationData]
  );

  const routeSelectedItem = useMemo(() => {
    const detailParam = searchParams?.get('detail');

    if (detailParam?.startsWith('project-')) {
      const id = Number(detailParam.replace('project-', ''));
      return Number.isNaN(id) ? null : id;
    }

    if (detailParam?.startsWith('publication-')) {
      const id = Number(detailParam.replace('publication-', ''));
      return Number.isNaN(id) ? null : id;
    }

    return null;
  }, [searchParams]);

  const routeMobileActiveApp = useMemo(() => {
    return searchParams?.get('tab') ? initialTab : null;
  }, [searchParams, initialTab]);

  const resolvedActiveTab = windowHeight.isMobile ? routeMobileActiveApp ?? activeTab : activeTab;
  const hasRouteTab = Boolean(searchParams?.get('tab'));
  const hasRouteDetail = Boolean(searchParams?.get('detail'));
  const effectiveSelectedItem = windowHeight.isMobile
    ? hasRouteDetail
      ? routeSelectedItem ?? selectedItem
      : null
    : selectedItem;
  const effectiveMobileActiveApp = windowHeight.isMobile
    ? hasRouteTab
      ? routeMobileActiveApp ?? mobileActiveApp
      : null
    : null;

  const getMobileOverlayFromHistory = useCallback((): MobileOverlayKind | null => {
    if (typeof window === 'undefined') return null;

    const overlay = (window.history.state ?? {}).__skeuOverlay;
    return overlay === 'terminal' || overlay === 'lockscreen' ? overlay : null;
  }, []);

  const markCurrentMobileHistoryEntry = useCallback(
    (screen: 'home' | 'app' | 'detail', tab?: string | null, detail?: string | null) => {
      if (typeof window === 'undefined') return;

      const currentState = window.history.state ?? {};
      window.history.replaceState(
        {
          ...currentState,
          __skeuManaged: true,
          __skeuScreen: screen,
          __skeuTab: tab ?? null,
          __skeuDetail: detail ?? null,
          __skeuOverlay: null,
        },
        '',
        window.location.href
      );
    },
    []
  );

  useLayoutEffect(() => {
    if (!windowHeight.isReady || !windowHeight.isMobile || typeof window === 'undefined') return;

    const tab = searchParams?.get('tab');
    const detail = searchParams?.get('detail');
    const currentState = window.history.state ?? {};

    if (!tab) {
      markCurrentMobileHistoryEntry('home');
      return;
    }

    if (isInternalMobileNavigationRef.current) {
      markCurrentMobileHistoryEntry(detail ? 'detail' : 'app', tab, detail);
      isInternalMobileNavigationRef.current = false;
      return;
    }

    if (currentState.__skeuManaged) return;

    const baseState = { ...currentState, __skeuManaged: true };
    const appUrl = `${pathname}?tab=${tab}`;
    const detailUrl = detail ? `${appUrl}&detail=${detail}` : appUrl;

    window.history.replaceState(
      {
        ...baseState,
        __skeuScreen: 'home',
        __skeuTab: null,
        __skeuDetail: null,
        __skeuOverlay: null,
      },
      '',
      pathname
    );

    window.history.pushState(
      {
        ...baseState,
        __skeuScreen: 'app',
        __skeuTab: tab,
        __skeuDetail: null,
        __skeuOverlay: null,
      },
      '',
      appUrl
    );

    if (detail) {
      window.history.pushState(
        {
          ...baseState,
          __skeuScreen: 'detail',
          __skeuTab: tab,
          __skeuDetail: detail,
          __skeuOverlay: null,
        },
        '',
        detailUrl
      );
    }
  }, [windowHeight.isReady, windowHeight.isMobile, searchParams, pathname, markCurrentMobileHistoryEntry]);

  useEffect(() => {
    if (!windowHeight.isReady) return;

    const name = TAB_INDEX_TO_NAME[activeTab] || 'experience';
    const currentTab = searchParams?.get('tab');

    if (windowHeight.isMobile) {
      if (effectiveMobileActiveApp === null && currentTab) {
        router.replace(pathname, { scroll: false });
      }
      return;
    }

    if (typeof window === 'undefined' || currentTab === name) return;

    const params = new URLSearchParams(searchParams?.toString());
    params.set('tab', name);
    params.delete('detail');
    const nextUrl = `${pathname}?${params.toString()}`;

    window.history.replaceState(window.history.state, '', nextUrl);
  }, [activeTab, router, pathname, windowHeight.isMobile, windowHeight.isReady, effectiveMobileActiveApp, searchParams]);

  useEffect(() => {
    if (!windowHeight.isReady || typeof window === 'undefined') return;

    const syncOverlayState = () => {
      const activeOverlay = getMobileOverlayFromHistory();
      setTerminalMode(activeOverlay === 'terminal');
      setLockscreenVisible(activeOverlay === 'lockscreen');
    };

    syncOverlayState();
    window.addEventListener('popstate', syncOverlayState);
    return () => window.removeEventListener('popstate', syncOverlayState);
  }, [windowHeight.isReady, getMobileOverlayFromHistory, setTerminalMode]);

  useEffect(() => {
    if (!windowHeight.isReady || typeof window === 'undefined') return;

    const currentOverlay = getMobileOverlayFromHistory();
    const overlayUrl = windowHeight.isMobile ? pathname : window.location.href;

    if (terminalMode) {
      if (currentOverlay !== 'terminal') {
        const currentState = window.history.state ?? {};
        window.history.pushState(
          {
            ...currentState,
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
  }, [terminalMode, windowHeight.isReady, windowHeight.isMobile, pathname, getMobileOverlayFromHistory]);

  useEffect(() => {
    if (!windowHeight.isReady || typeof window === 'undefined') return;

    const currentOverlay = getMobileOverlayFromHistory();
    const overlayUrl = windowHeight.isMobile ? pathname : window.location.href;

    if (lockscreenVisible) {
      if (currentOverlay !== 'lockscreen') {
        const currentState = window.history.state ?? {};
        window.history.pushState(
          {
            ...currentState,
            __skeuManaged: true,
            __skeuScreen: 'home',
            __skeuTab: null,
            __skeuDetail: null,
            __skeuOverlay: 'lockscreen',
          },
          '',
          overlayUrl
        );
      }
      return;
    }

    if (currentOverlay === 'lockscreen') {
      window.history.back();
    }
  }, [lockscreenVisible, windowHeight.isReady, windowHeight.isMobile, pathname, getMobileOverlayFromHistory]);

  const handleItemClick = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    const nextSelected = id === effectiveSelectedItem ? null : id;

    if (windowHeight.isMobile && effectiveMobileActiveApp !== null && (resolvedActiveTab === 3 || resolvedActiveTab === 4)) {
      if (nextSelected === null) {
        router.back();
        return;
      }

      const tabName = TAB_INDEX_TO_NAME[resolvedActiveTab] || 'experience';
      const detailType = resolvedActiveTab === 3 ? 'project' : 'publication';
      isInternalMobileNavigationRef.current = true;
      router.push(`${pathname}?tab=${tabName}&detail=${detailType}-${id}`, { scroll: false });
    }

    setSelectedItem(nextSelected);
  };

  const handleContainerClick = () => {
    setSelectedItem(null);
  };

  const LIGHT_WALLPAPER_LOW = '/images/macos-mojave-day.jpg';
  const LIGHT_WALLPAPER_HIGH = '/images/macos-mojave-day.jpg';
  const DARK_WALLPAPER_LOW = '/images/macos-mojave-night.jpg';
  const DARK_WALLPAPER_HIGH = '/images/macos-mojave-night.jpg';

  const { bgLoaded, backgroundStyle } = useProgressiveBackground(
    LIGHT_WALLPAPER_LOW,
    LIGHT_WALLPAPER_HIGH,
    DARK_WALLPAPER_LOW,
    DARK_WALLPAPER_HIGH,
    getBlurDataURL(LIGHT_WALLPAPER_LOW),
    getBlurDataURL(DARK_WALLPAPER_LOW)
  );

  const toggleLockscreen = useCallback(() => {
    if (lockscreenVisible && typeof window !== 'undefined' && getMobileOverlayFromHistory() === 'lockscreen') {
      window.history.back();
      return;
    }

    setLockscreenVisible(v => !v);
  }, [lockscreenVisible, getMobileOverlayFromHistory]);

  const openMobileApp = useCallback(
    (tabId: number) => {
      onTabChange(tabId);
      isInternalMobileNavigationRef.current = true;
      router.push(`${pathname}?tab=${TAB_INDEX_TO_NAME[tabId] || 'experience'}`, { scroll: false });
      setMobileActiveApp(tabId);
    },
    [onTabChange, router, pathname]
  );

  const closeMobileApp = useCallback(() => {
    setSelectedItem(null);
    setMobileActiveApp(null);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const closeDetailView = useCallback(() => {
    if (windowHeight.isMobile && searchParams?.get('detail')) {
      router.back();
      return;
    }
    setSelectedItem(null);
  }, [windowHeight.isMobile, searchParams, router]);

  const renderActiveTabContent = () => (
    <>
      {resolvedActiveTab === 0 && <ExperienceList experienceData={experienceData} isMobile={windowHeight.isMobile} />}
      {resolvedActiveTab === 1 && <AwardsMasonry awardsData={awardsData} />}
      {resolvedActiveTab === 2 && (
        <EducationList
          educationData={educationData}
          courseworkHref={windowHeight.isMobile ? '/experience?tab=education&detail=coursework' : '/experience/coursework'}
        />
      )}
      {resolvedActiveTab === 3 && (
        <ProjectsGrid
          projects={projects}
          selectedItem={effectiveSelectedItem}
          onItemClick={handleItemClick}
          folderIconUrl={folderIconUrl}
        />
      )}
      {resolvedActiveTab === 4 && (
        <PublicationsGrid publications={publications} selectedId={effectiveSelectedItem} onItemClick={handleItemClick} />
      )}
      {resolvedActiveTab === 5 && <ActivitiesList activities={activitiesData} />}
    </>
  );

  const selectedProject = useMemo(
    () => (effectiveSelectedItem && resolvedActiveTab === 3 ? projects.find((project) => project.id === effectiveSelectedItem) ?? null : null),
    [resolvedActiveTab, projects, effectiveSelectedItem]
  );

  const selectedPublication = useMemo(
    () => (effectiveSelectedItem && resolvedActiveTab === 4 ? publications.find((publication) => publication.id === effectiveSelectedItem) ?? null : null),
    [resolvedActiveTab, publications, effectiveSelectedItem]
  );

  const mobileApps = useMemo<MobileAppDefinition[]>(
    () => [
      { title: 'Awards', iconName: 'awards', gradient: MOBILE_APP_GRADIENTS[0], action: () => openMobileApp(1) },
      { title: 'Experience', iconName: 'experience', gradient: MOBILE_APP_GRADIENTS[1], action: () => openMobileApp(0) },
      { title: 'Projects', iconName: 'projects', gradient: MOBILE_APP_GRADIENTS[2], action: () => openMobileApp(3) },
      { title: 'Education', iconName: 'education', gradient: MOBILE_APP_GRADIENTS[3], action: () => openMobileApp(2) },
      { title: 'Publications', iconName: 'publications', gradient: MOBILE_APP_GRADIENTS[4], action: () => openMobileApp(4) },
      { title: 'Activities', iconName: 'activities', gradient: MOBILE_APP_GRADIENTS[5], action: () => openMobileApp(5) },
      {
        title: isDark ? 'Light Mode' : 'Dark Mode',
        iconName: 'dark-mode',
        gradient: MOBILE_APP_GRADIENTS[6],
        action: toggleTheme,
      },
    ],
    [openMobileApp, toggleTheme, isDark]
  );
  const isCourseworkDetail = resolvedActiveTab === 2 && searchParams?.get('detail') === 'coursework';

  const terminalOverlay = terminalMode ? (
    <TerminalOverlay
      isMobile={windowHeight.isMobile}
      inputValue={terminalInput}
      onInputChange={setTerminalInput}
      onKeyDown={onKeyDown}
      outputLines={terminalOutput}
      inputRef={terminalInputRef}
      outputRef={terminalOutputRef}
    />
  ) : null;

  if (!windowHeight.isReady) {
    return (
      <div className="relative min-h-[100dvh] w-full" style={backgroundStyle}>
        {!bgLoaded && <div className="fixed inset-0 z-0 bg-gray-200 dark:bg-[#1a1b26]" />}
      </div>
    );
  }

  if (windowHeight.isMobile) {
    return (
      <SkeumorphicMobileShell
        activeTab={resolvedActiveTab}
        backgroundStyle={backgroundStyle}
        bgLoaded={bgLoaded}
        contentRef={contentRef}
        courseworkCourses={courseworkCourses}
        isCourseworkDetail={isCourseworkDetail}
        isDark={isDark}
        lockscreenOverlay={lockscreenVisible ? <IOSLockscreen onUnlock={toggleLockscreen} /> : null}
        mobileActiveApp={effectiveMobileActiveApp}
        mobileApps={mobileApps}
        onBackToEducation={() => router.back()}
        onCloseApp={closeMobileApp}
        onCloseDetailView={closeDetailView}
        onContainerClick={handleContainerClick}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTerminal={() => setTerminalMode(true)}
        onToggleLockscreen={toggleLockscreen}
        renderActiveTabContent={renderActiveTabContent}
        searchOverlay={
          <SearchOverlay
            open={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            navigateInSkeumorphic={(tabName: string) => {
              const idx = TAB_NAME_TO_INDEX[String(tabName).toLowerCase()];
              if (typeof idx === 'number') {
                openMobileApp(idx);
              }
            }}
          />
        }
        selectedProject={selectedProject}
        selectedPublication={selectedPublication}
        tabs={tabs}
        terminalOverlay={terminalOverlay}
      />
    );
  }

  return (
    <SkeumorphicDesktopShell
      activeTab={resolvedActiveTab}
      activitiesCount={activitiesData.length}
      awardsCount={awardsData.reduce((sum, { awards }) => sum + awards.length, 0)}
      backgroundStyle={backgroundStyle}
      bgLoaded={bgLoaded}
      canBack={currentHistoryIndex !== 0}
      canForward={currentHistoryIndex < tabHistory.length - 1}
      contentHeight={contentHeight}
      contentRef={contentRef}
      educationCount={educationData.length}
      experienceCount={experienceData.length}
      lockscreenOverlay={lockscreenVisible ? <DesktopLockscreen onUnlock={toggleLockscreen} /> : null}
      mobileMenuRef={mobileMenuRef}
      onBack={handleBack}
      onCloseDetailView={closeDetailView}
      onContainerClick={handleContainerClick}
      onForward={handleForward}
      onOpenSearch={() => setIsSearchOpen(true)}
      onOpenTerminal={() => setTerminalMode(true)}
      onTabChange={onTabChange}
      onToggleLockscreen={toggleLockscreen}
      onToggleMobileMenu={() => setShowMobileMenu((current) => !current)}
      projectsCount={projects.length}
      publicationsCount={publications.length}
      renderActiveTabContent={renderActiveTabContent}
      searchOverlay={
        <SearchOverlay
          open={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          navigateInSkeumorphic={(tabName: string) => {
            const idx = TAB_NAME_TO_INDEX[String(tabName).toLowerCase()];
            if (typeof idx === 'number') onTabChange(idx);
          }}
        />
      }
      selectedProject={selectedProject}
      selectedPublication={selectedPublication}
      showMobileMenu={showMobileMenu}
      tabs={tabs}
      terminalOverlay={terminalOverlay}
    />
  );
};

export default MacOSWindow;
