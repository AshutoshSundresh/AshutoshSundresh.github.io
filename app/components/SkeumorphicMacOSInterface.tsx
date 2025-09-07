import React, { useState, useEffect, useRef } from 'react';
import useAppOverlayState from '../hooks/useTerminalState';
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
import rawData from '../data/skeumorphicData.json';
import type { SkeumorphicDataRoot, Project, Publication, Activity, EducationEntry, ExperienceEntry, AwardCategory } from '../types';
import useWindowInfo from '../hooks/useWindowInfo';
import useProgressiveBackground from '../hooks/useProgressiveBackground';
import useTabHistory from '../hooks/useTabHistory';
import useSwipeNavigation from '../hooks/useSwipeNavigation';
import useClickOutside from '../hooks/useClickOutside';
import useRandomStorage from '../hooks/useRandomStorage';

type ProjectDetails = Project;

const MacOSWindow = () => {
  const { activeTab, handleTabChange, handleBack, handleForward, tabHistory, currentHistoryIndex } = useTabHistory(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Add ref array for tab elements
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabs] = useState([
    { id: 0, title: 'Projects', content: 'Git repositories and development projects' },
    { id: 1, title: 'Education', content: 'Academic background and achievements' },
    { id: 2, title: 'Experience', content: 'Professional experience and internships' },
    { id: 3, title: 'Awards', content: 'Honors and recognition' },
    { id: 4, title: 'Publications', content: 'Research papers and publications' },
    { id: 5, title: 'Activities', content: 'Extracurricular and leadership activities' }
  ]);

  const windowHeight = useWindowInfo();

  // Swipe handled by useSwipeNavigation hook

  // Add state for tab position offset
  const [tabOffset, setTabOffset] = useState(0);

  // Swipe thresholds handled in hook

  const { randomStorage } = useRandomStorage([activeTab]);
  const {
    terminalMode,
    setTerminalMode,
    terminalInput,
    setTerminalInput,
    terminalOutput,
    terminalInputRef,
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

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation(
    windowHeight.isMobile && selectedItem === null,
    () => {
      if (activeTab < tabs.length - 1) {
        const tabWidth = getTabWidth();
        const nextTab = activeTab + 1;
        const newOffset = tabOffset - tabWidth;
        setTabOffset(getConstrainedOffset(newOffset));
        handleTabChange(nextTab);
      }
    },
    () => {
      if (activeTab > 0) {
        const tabWidth = getTabWidth();
        const prevTab = activeTab - 1;
        const newOffset = tabOffset + tabWidth;
        setTabOffset(getConstrainedOffset(newOffset));
        handleTabChange(prevTab);
      }
    }
  );

  // Add function to calculate tab width
  const getTabWidth = () => {
    // If tabs are not yet rendered, return a default value
    if (!tabRefs.current.length || !tabRefs.current[0]) return 45;

    // Calculate width of the active tab or the first available tab
    const activeTabRef = tabRefs.current[activeTab] || tabRefs.current[0];
    return activeTabRef ? activeTabRef.offsetWidth : 45;
  };

  // Calculate max scroll and constrained offset
  const getMaxScrollOffset = () => {
    if (!tabRefs.current.length) return 0;
    const tabContainer = document.querySelector('.tab-container') as HTMLElement | null;
    const tabsContainer = document.querySelector('.tabs-container') as HTMLElement | null;
    if (!tabContainer || !tabsContainer) return 0;
    const containerWidth = tabContainer.clientWidth;
    const tabsWidth = tabsContainer.scrollWidth;
    return Math.min(0, containerWidth - tabsWidth);
  };

  const getConstrainedOffset = (proposedOffset: number) => {
    const maxRight = 0;
    const maxLeft = getMaxScrollOffset();
    return Math.max(maxLeft, Math.min(maxRight, proposedOffset));
  };

  // Calculate content height - on mobile take up most of the screen, on desktop use fixed height
  const contentHeight = windowHeight.isMobile
    ? `${Math.max(windowHeight.vh * 0.6, 350)}px`
    : '520px';

  // Parse data with types
  const data: SkeumorphicDataRoot = rawData as SkeumorphicDataRoot;

  // Project data
  const projects: ProjectDetails[] = data.projects.map((p) => ({
    ...p,
    created: new Date(p.created)
  }));

  // Folder icon image URL
  const folderIconUrl = data.folderIconUrl;

  // Update the education data interface and content
  const educationData: EducationEntry[] = data.educationData;

  // Update the experience data
  const experienceData: ExperienceEntry[] = data.experienceData;

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
    'https://c4.wallpaperflare.com/wallpaper/951/295/751/macos-high-sierra-4k-new-hd-wallpaper-preview.jpg',
    'https://512pixels.net/downloads/macos-wallpapers/10-13.jpg'
  );

  // Update the awards data
  const awardsData: AwardCategory[] = data.awardsData;

  // Update the publications data
  const publications: Publication[] = data.publications;

  // Activities data
  const activitiesData: Activity[] = data.activitiesData;

  const toggleLockscreen = () => {
    setLockscreenVisible(!lockscreenVisible);
  };

  return (
    <div
      className={`
        min-h-screen w-full flex items-start sm:items-center justify-center 
        p-4 sm:p-8 relative
      `}
      style={backgroundStyle}
    >
      {!bgLoaded && <div className="fixed inset-0 bg-gray-200 z-0" />}
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white relative z-10">
        <WindowHeader onToggleLockscreen={toggleLockscreen} onOpenTerminal={() => setTerminalMode(true)} />

        <Toolbar
          onBack={handleBack}
          onForward={handleForward}
          canBack={currentHistoryIndex !== 0}
          canForward={currentHistoryIndex < tabHistory.length - 1}
          showArchive={activeTab === 5}
        />

        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          isMobile={windowHeight.isMobile}
          showMobileMenu={showMobileMenu}
          onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
          onSelect={handleTabChange}
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
            flex-1 p-4 bg-white overflow-y-auto
            ${windowHeight.isMobile && selectedItem && activeTab === 0 ? 'hidden' : ''}
          `}
            onClick={handleContainerClick}
            style={{ height: contentHeight }}
          >
            <div className="text-lg mb-2 font-medium text-gray-800 font-['Raleway']">
              {tabs[activeTab].title}
            </div>
            <div className="text-gray-700 mb-4 font-['Raleway'] text-sm">
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
          bg-gray-50 border-t border-gray-200 px-4 py-1 text-xs text-gray-500 
          flex justify-between font-['Raleway']
          ${windowHeight.isMobile && selectedItem && activeTab === 0 ? 'hidden' : ''}
        `}>
          <span>
            {activeTab === 0 ? `${projects.length} items` :
              activeTab === 1 ? `${educationData.length} items` :
                activeTab === 2 ? `${experienceData.length} items` :
                  activeTab === 3 ? `${awardsData.reduce((sum, { awards }) => sum + awards.length, 0)} items` :
                    activeTab === 4 ? `${publications.length} items` :
                      `${activitiesData.length} items`}, {randomStorage} GB available <br /> &copy; {new Date().getFullYear()} Ashutosh Sundresh
          </span>
          <span>{new Date().toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
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
        />
      )}
    </div>
  );
};

export default MacOSWindow;
