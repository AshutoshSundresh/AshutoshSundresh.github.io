import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import rawData from '../data/skeumorphicData.json';
import type {
  SkeumorphicDataRoot,
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
  const [now, setNow] = useState(() => new Date());
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
      if (command === 'ls projects') return projects.map(project => `- ${project.name}`);
      if (command === 'ls education') return educationData.map(edu => `- ${edu.institution || ''} ${edu.degree || ''}`);
      if (command === 'ls experience') return experienceData.map(exp => `- ${exp.company}: ${exp.position}`);
      if (command === 'ls awards') return awardsData.flatMap(category => category.awards.map(award => `- ${award.title}`));
      if (command === 'ls publications') return publications.map(pub => `- ${pub.title}`);
      if (command === 'ls activities') return activitiesData.map(activity => `- ${activity.title}`);
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

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useClickOutside(contentRef as React.RefObject<HTMLElement | null>, (event) => {
    const detailView = document.querySelector('[data-detail-view]');
    if (detailView && detailView.contains(event.target as Node)) return;
    setSelectedItem(null);
  });
  useClickOutside(mobileMenuRef as React.RefObject<HTMLElement | null>, () => setShowMobileMenu(false));

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

  const data: SkeumorphicDataRoot = rawData as SkeumorphicDataRoot;
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
  const effectiveSelectedItem = windowHeight.isMobile ? routeSelectedItem ?? selectedItem : selectedItem;
  const effectiveMobileActiveApp = windowHeight.isMobile ? routeMobileActiveApp ?? mobileActiveApp : null;

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

    router.replace(`${pathname}?tab=${name}`, { scroll: false });
  }, [activeTab, router, pathname, windowHeight.isMobile, windowHeight.isReady, effectiveMobileActiveApp, searchParams]);

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
    setLockscreenVisible(v => !v);
  }, []);

  const openMobileApp = useCallback(
    (tabId: number) => {
      onTabChange(tabId);
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
      {resolvedActiveTab === 0 && <ExperienceList experienceData={experienceData} />}
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
        now={now}
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
