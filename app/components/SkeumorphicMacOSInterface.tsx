import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useAppOverlayState from '../hooks/useAppOverlayState';
import IOSLockscreen from './IOSLockscreen';
import DesktopLockscreen from './DesktopLockscreen';
import WindowHeader from './WindowHeader';
import Toolbar from './Toolbar';
import TabsBar from './TabsBar';
import PublicationsGrid from './PublicationsGrid';
import ActivitiesList from './ActivitiesList';
import ProjectDetailView from './ProjectDetailView';
import PublicationDetailView from './PublicationDetailView';
import ProjectsGrid from './ProjectsGrid';
import AwardsMasonry from './AwardsMasonry';
import EducationList from './EducationList';
import ExperienceList from './ExperienceList';
import useTerminal from '../hooks/useTerminal';
import TerminalOverlay from './TerminalOverlay';
import SearchOverlay from './SearchOverlay';
import rawData from '../data/skeumorphicData.json';
import type { SkeumorphicDataRoot, Project, Publication, Activity, EducationEntry, ExperienceEntry, AwardCategory } from '../types';
import useWindowInfo from '../hooks/useWindowInfo';
import useProgressiveBackground from '../hooks/useProgressiveBackground';
import useTabHistory from '../hooks/useTabHistory';
import useSwipeNavigation from '../hooks/useSwipeNavigation';
import useClickOutside from '../hooks/useClickOutside';

type ProjectDetails = Project;

const MacOSWindow = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { activeTab, handleTabChange, handleBack, handleForward, tabHistory, currentHistoryIndex } = useTabHistory(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Add ref array for tab elements
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = useMemo(() => ([
    { id: 0, title: 'Projects', content: 'Git repositories and development projects' },
    { id: 1, title: 'Education', content: 'Academic background and achievements' },
    { id: 2, title: 'Experience', content: 'Professional experience and internships' },
    { id: 3, title: 'Awards', content: 'Honors and recognition' },
    { id: 4, title: 'Publications', content: 'Research papers and publications' },
    { id: 5, title: 'Activities', content: 'Extracurricular and leadership activities' }
  ]), []);

  const windowHeight = useWindowInfo();

  // Swipe handled by useSwipeNavigation hook

  // Add state for tab position offset
  const [tabOffset, setTabOffset] = useState(0);

  // Swipe thresholds handled in hook

  const searchParams = useSearchParams();
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
    }
  });
  const [lockscreenVisible, setLockscreenVisible] = useState(false);

  const { setTerminalActive, setLockscreenActive } = useAppOverlayState();

  useEffect(() => {
    setTerminalActive(terminalMode);
  }, [terminalMode, setTerminalActive]);

  useEffect(() => {
    setLockscreenActive(lockscreenVisible);
  }, [lockscreenVisible, setLockscreenActive]);

  // handled by hook

  // Reset selected item when tab changes
  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  // Outside click handling
  useClickOutside(contentRef as React.RefObject<HTMLElement | null>, (event) => {
        const detailView = document.querySelector('[data-detail-view]');
    if (detailView && detailView.contains(event.target as Node)) return;
        setSelectedItem(null);
  });
  useClickOutside(mobileMenuRef as React.RefObject<HTMLElement | null>, () => setShowMobileMenu(false));

  const onTabChange = useCallback((index: number) => {
    setSelectedItem(null);
    handleTabChange(index);
  }, [handleTabChange]);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation(
    windowHeight.isMobile && selectedItem === null,
    () => {
      if (activeTab < tabs.length - 1) {
        const tabWidth = getTabWidth();
        const nextTab = activeTab + 1;
        const newOffset = tabOffset - tabWidth;
        setTabOffset(getConstrainedOffset(newOffset));
        onTabChange(nextTab);
      }
    },
    () => {
      if (activeTab > 0) {
        const tabWidth = getTabWidth();
        const prevTab = activeTab - 1;
        const newOffset = tabOffset + tabWidth;
        setTabOffset(getConstrainedOffset(newOffset));
        onTabChange(prevTab);
      }
    }
  );

  // Sync tab from URL query param `tab` (when landing from search)
  const tabNameToIndex: Record<string, number> = {
    projects: 0,
    education: 1,
    experience: 2,
    awards: 3,
    publications: 4,
    activities: 5,
  };
  const tabIndexToName = ['projects','education','experience','awards','publications','activities'];

  const didInitFromUrl = useRef(false);
  useEffect(() => {
    if (didInitFromUrl.current) return;
    const tabParam = searchParams?.get('tab');
    if (!tabParam) { didInitFromUrl.current = true; return; }
    const wanted = tabNameToIndex[String(tabParam).toLowerCase()];
    if (typeof wanted === 'number') {
      handleTabChange(wanted);
    }
    didInitFromUrl.current = true;
  }, [searchParams, handleTabChange]);

  // Keep URL query in sync with active tab (without adding history entries)
  useEffect(() => {
    const name = tabIndexToName[activeTab] || 'projects';
    router.replace(`${pathname}?tab=${name}`, { scroll: false });
  }, [activeTab, router, pathname]);

  // Add function to calculate tab width
  const getTabWidth = useCallback(() => {
    // If tabs are not yet rendered, return a default value
    if (!tabRefs.current.length || !tabRefs.current[0]) return 45;

    // Calculate width of the active tab or the first available tab
    const activeTabRef = tabRefs.current[activeTab] || tabRefs.current[0];
    return activeTabRef ? activeTabRef.offsetWidth : 45;
  }, [activeTab]);

  // Calculate max scroll and constrained offset
  const getMaxScrollOffset = useCallback(() => {
    if (!tabRefs.current.length) return 0;
    const tabContainer = document.querySelector('.tab-container') as HTMLElement | null;
    const tabsContainer = document.querySelector('.tabs-container') as HTMLElement | null;
    if (!tabContainer || !tabsContainer) return 0;
    const containerWidth = tabContainer.clientWidth;
    const tabsWidth = tabsContainer.scrollWidth;
    return Math.min(0, containerWidth - tabsWidth);
  }, []);

  const getConstrainedOffset = useCallback((proposedOffset: number) => {
    const maxRight = 0;
    const maxLeft = getMaxScrollOffset();
    return Math.max(maxLeft, Math.min(maxRight, proposedOffset));
  }, [getMaxScrollOffset]);

  // Calculate content height - on mobile take up most of the screen, on desktop use fixed height
  const contentHeight = windowHeight.isMobile
    ? `${Math.max(windowHeight.vh * 0.6, 350)}px`
    : `${Math.max(windowHeight.vh * 0.6, 400)}px`;

  // Parse data with types
  const data: SkeumorphicDataRoot = rawData as SkeumorphicDataRoot;

  // Project data
  const projects: ProjectDetails[] = useMemo(() => data.projects.map((p) => ({
    ...p,
    created: new Date(p.created)
  })), [data.projects]);

  // Folder icon image URL
  const folderIconUrl = useMemo(() => data.folderIconUrl, [data.folderIconUrl]);

  // Update the education data interface and content
  const educationData: EducationEntry[] = useMemo(() => data.educationData, [data.educationData]);

  // Update the experience data
  const experienceData: ExperienceEntry[] = useMemo(() => data.experienceData, [data.experienceData]);

  // Handle folder click
  const handleItemClick = (event: React.MouseEvent, id: number) => {
    // Stop propagation to prevent parent div's click handler from firing
    event.stopPropagation();
    setSelectedItem(id === selectedItem ? null : id);
  };

  // Handle container click to deselect
  const handleContainerClick = () => {
    setSelectedItem(null);
  };

 

  const { bgLoaded, backgroundStyle } = useProgressiveBackground(
    'https://images.hdqwalls.com/download/macos-mojave-day-mode-stock-pb-1280x720.jpg',
    'https://images.hdqwalls.com/download/macos-mojave-day-mode-stock-pb-1920x1080.jpg',
    'https://images.hdqwalls.com/download/macos-mojave-night-mode-stock-0y-1280x720.jpg',
    'https://images.hdqwalls.com/download/macos-mojave-night-mode-stock-0y-1920x1080.jpg'
  );

  // Update the awards data
  const awardsData: AwardCategory[] = useMemo(() => data.awardsData, [data.awardsData]);

  // Update the publications data
  const publications: Publication[] = useMemo(() => data.publications, [data.publications]);

  // Activities data
  const activitiesData: Activity[] = useMemo(() => data.activitiesData, [data.activitiesData]);

  const toggleLockscreen = useCallback(() => {
    setLockscreenVisible(v => !v);
  }, []);

  return (
    <div
      className={`
        min-h-screen w-full flex items-start sm:items-center justify-center 
        p-4 sm:p-8 relative
      `}
      style={backgroundStyle}
    >
      {!bgLoaded && <div className="fixed inset-0 bg-gray-200 dark:bg-[#1a1b26] z-0" />}
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] relative z-10 transition-colors">
        <WindowHeader onToggleLockscreen={toggleLockscreen} onOpenTerminal={() => setTerminalMode(true)} />

        <Toolbar
          onBack={handleBack}
          onForward={handleForward}
          canBack={currentHistoryIndex !== 0}
          canForward={currentHistoryIndex < tabHistory.length - 1}
          showArchive={activeTab === 5}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          isMobile={windowHeight.isMobile}
          showMobileMenu={showMobileMenu}
          onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
          onSelect={onTabChange}
          mobileMenuRef={mobileMenuRef}
        />

        {/* Sidebar and content */}
        <div className="flex relative" style={{ height: contentHeight }}>

          {/* Main content */}
          <div
            ref={contentRef}
            onTouchStart={windowHeight.isMobile ? handleTouchStart : undefined}
            onTouchMove={windowHeight.isMobile ? handleTouchMove : undefined}
            onTouchEnd={windowHeight.isMobile ? handleTouchEnd : undefined}
            className={`
            flex-1 p-4 bg-white dark:bg-[#1e1e1e] overflow-y-auto transition-colors
            ${windowHeight.isMobile && selectedItem && activeTab === 0 ? 'hidden' : ''}
          `}
            onClick={handleContainerClick}
            style={{ height: contentHeight }}
          >
            <div className="text-lg mb-2 font-medium text-gray-800 dark:text-gray-200 font-['Raleway']">
              {tabs[activeTab].title}
            </div>
            <div className="text-gray-700 dark:text-gray-400 mb-4 font-['Raleway'] text-sm">
              {tabs[activeTab].content}
            </div>

            {/* Project Folders (MacOS styled) */}
            {activeTab === 0 && (
              <ProjectsGrid
                projects={projects}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
                folderIconUrl={folderIconUrl}
              />
            )}

            {/* Documents Tab */}
            {activeTab === 1 && <EducationList educationData={educationData} />}

            {/* Experience Tab */}
            {activeTab === 2 && <ExperienceList experienceData={experienceData} />}

            {/* Awards Tab */}
            {activeTab === 3 && <AwardsMasonry awardsData={awardsData} />}

            {/* Publications Tab */}
            {activeTab === 4 && (
              <PublicationsGrid publications={publications} selectedId={selectedItem} onItemClick={handleItemClick} />
            )}

            {/* Activities Tab */}
            {activeTab === 5 && <ActivitiesList activities={activitiesData} />}
          </div>

          {/* Detail View */}
          {selectedItem && activeTab === 0 && (
            <ProjectDetailView
              project={projects.find(p => p.id === selectedItem) as ProjectDetails}
              onClose={() => setSelectedItem(null)}
              isMobile={windowHeight.isMobile}
            />
          )}

          {/* Add Publication Detail View */}
          {selectedItem && activeTab === 4 && (
            <PublicationDetailView
              publication={publications.find(p => p.id === selectedItem) as Publication}
              onClose={() => setSelectedItem(null)}
              isMobile={windowHeight.isMobile}
            />
          )}
        </div>

        {/* Status bar */}
        <div className={`
          bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-700 px-4 py-1 text-xs text-gray-500 dark:text-gray-400 
          flex justify-between font-['Raleway'] transition-colors
          ${windowHeight.isMobile && selectedItem && activeTab === 0 ? 'hidden' : ''}
        `}>
          <span>
            {activeTab === 0 ? `${projects.length} items` :
              activeTab === 1 ? `${educationData.length} items` :
                activeTab === 2 ? `${experienceData.length} items` :
                  activeTab === 3 ? `${awardsData.reduce((sum, { awards }) => sum + awards.length, 0)} items` :
                    activeTab === 4 ? `${publications.length} items` :
                      `${activitiesData.length} items`} <br /> &copy; {new Date().getFullYear()} Ashutosh Sundresh
          </span>
          <span className="flex flex-col items-end">
            <span>{new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
            <span>{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </span>
        </div>
      </div>
      {lockscreenVisible && !windowHeight.isMobile && (
        <DesktopLockscreen onUnlock={toggleLockscreen} />
      )}
      {lockscreenVisible && windowHeight.isMobile && (
        <IOSLockscreen onUnlock={toggleLockscreen} />
      )}
      {terminalMode && (
        <TerminalOverlay
          isMobile={windowHeight.isMobile}
          inputValue={terminalInput}
          onInputChange={setTerminalInput}
          onKeyDown={onKeyDown}
          outputLines={terminalOutput}
          inputRef={terminalInputRef}
          outputRef={terminalOutputRef}
        />
      )}
      {/* Reuse search overlay from hero; enable in-component tab navigation when targeting experience */}
      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigateInSkeumorphic={(tabName: string) => {
          const map: Record<string, number> = {
            projects: 0,
            education: 1,
            experience: 2,
            awards: 3,
            publications: 4,
            activities: 5,
          };
          const idx = map[String(tabName).toLowerCase()];
          if (typeof idx === 'number') onTabChange(idx);
        }}
      />
    </div>
  );
};

export default MacOSWindow;
