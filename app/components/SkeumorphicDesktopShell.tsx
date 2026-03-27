"use client";

import type { CSSProperties, ReactNode, RefObject } from 'react';
import WindowHeader from './WindowHeader';
import Toolbar from './Toolbar';
import TabsBar from './TabsBar';
import ProjectDetailView from './ProjectDetailView';
import PublicationDetailView from './PublicationDetailView';
import type { Project, Publication } from '../types';
import type { SkeumorphicTab } from './skeumorphic/shared';

interface SkeumorphicDesktopShellProps {
  activeTab: number;
  activitiesCount: number;
  awardsCount: number;
  backgroundStyle: CSSProperties;
  bgLoaded: boolean;
  canBack: boolean;
  canForward: boolean;
  contentHeight: string;
  contentRef: RefObject<HTMLDivElement | null>;
  educationCount: number;
  experienceCount: number;
  lockscreenOverlay: ReactNode;
  mobileMenuRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onCloseDetailView: () => void;
  onContainerClick: () => void;
  onForward: () => void;
  onOpenSearch: () => void;
  onOpenTerminal: () => void;
  onTabChange: (index: number) => void;
  onToggleLockscreen: () => void;
  onToggleMobileMenu: () => void;
  projectsCount: number;
  publicationsCount: number;
  renderActiveTabContent: () => ReactNode;
  searchOverlay: ReactNode;
  selectedProject: Project | null;
  selectedPublication: Publication | null;
  showMobileMenu: boolean;
  tabs: SkeumorphicTab[];
  terminalOverlay: ReactNode;
}

export default function SkeumorphicDesktopShell({
  activeTab,
  activitiesCount,
  awardsCount,
  backgroundStyle,
  bgLoaded,
  canBack,
  canForward,
  contentHeight,
  contentRef,
  educationCount,
  experienceCount,
  lockscreenOverlay,
  mobileMenuRef,
  onBack,
  onCloseDetailView,
  onContainerClick,
  onForward,
  onOpenSearch,
  onOpenTerminal,
  onTabChange,
  onToggleLockscreen,
  onToggleMobileMenu,
  projectsCount,
  publicationsCount,
  renderActiveTabContent,
  searchOverlay,
  selectedProject,
  selectedPublication,
  showMobileMenu,
  tabs,
  terminalOverlay,
}: SkeumorphicDesktopShellProps) {
  const itemCountLabel =
    activeTab === 0
      ? `${experienceCount} items`
      : activeTab === 1
        ? `${awardsCount} items`
        : activeTab === 2
          ? `${educationCount} items`
          : activeTab === 3
            ? `${projectsCount} items`
            : activeTab === 4
              ? `${publicationsCount} items`
              : `${activitiesCount} items`;

  return (
    <div
      className="relative flex min-h-screen w-full items-start justify-center p-4 sm:items-center sm:p-8"
      style={backgroundStyle}
    >
      {!bgLoaded && <div className="fixed inset-0 z-0 bg-gray-200 dark:bg-[#1a1b26]" />}
      <div className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-colors dark:border-gray-700 dark:bg-[#1e1e1e] md:max-w-4xl lg:max-w-4xl">
        <WindowHeader onToggleLockscreen={onToggleLockscreen} onOpenTerminal={onOpenTerminal} />

        <Toolbar
          onBack={onBack}
          onForward={onForward}
          canBack={canBack}
          canForward={canForward}
          showArchive={activeTab === 5}
          onOpenSearch={onOpenSearch}
        />

        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          isMobile={false}
          showMobileMenu={showMobileMenu}
          onToggleMobileMenu={onToggleMobileMenu}
          onSelect={onTabChange}
          mobileMenuRef={mobileMenuRef}
        />

        <div className="relative flex" style={{ height: contentHeight }}>
          <div
            ref={contentRef}
            className={`flex-1 overflow-y-auto bg-white p-4 transition-all duration-300 dark:bg-[#1e1e1e] ${
              selectedProject ? 'pr-72' : ''
            }`}
            onClick={onContainerClick}
            style={{ height: contentHeight }}
          >
            {renderActiveTabContent()}
          </div>

          {selectedProject && (
            <ProjectDetailView
              project={selectedProject}
              onClose={onCloseDetailView}
              isMobile={false}
            />
          )}

          {selectedPublication && (
            <PublicationDetailView
              publication={selectedPublication}
              onClose={onCloseDetailView}
              isMobile={false}
            />
          )}
        </div>

        <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-4 py-1 font-['Raleway'] text-xs text-gray-500 transition-colors dark:border-gray-700 dark:bg-[#181818] dark:text-gray-400">
          <span>
            {itemCountLabel} <br /> &copy; {new Date().getFullYear()} Ashutosh Sundresh
          </span>
          <span className="flex flex-col items-end">
            <span>{new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
            <span>{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </span>
        </div>
      </div>

      {lockscreenOverlay}
      {terminalOverlay}
      {searchOverlay}
    </div>
  );
}
