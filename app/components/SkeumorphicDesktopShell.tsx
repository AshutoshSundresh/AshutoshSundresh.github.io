"use client";

import { useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import WindowHeader from './WindowHeader';
import TabsBar from './TabsBar';
import ProjectDetailView from './ProjectDetailView';
import PublicationDetailView from './PublicationDetailView';
import type { Project, Publication } from '../types';
import type { SkeumorphicTab } from './skeumorphic/shared';
import {
  HAIRLINE,
  STATUS_MATERIAL,
  UI_FONT_STACK,
  WINDOW_RADIUS,
  WINDOW_SHADOW,
  WINDOW_SHADOW_DARK,
} from './skeumorphic/macos';

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
  onBack,
  onCloseDetailView,
  onContainerClick,
  onForward,
  onOpenSearch,
  onOpenTerminal,
  onTabChange,
  onToggleLockscreen,
  projectsCount,
  publicationsCount,
  renderActiveTabContent,
  searchOverlay,
  selectedProject,
  selectedPublication,
  tabs,
  terminalOverlay,
}: SkeumorphicDesktopShellProps) {
  const [isZoomed, setIsZoomed] = useState(false);

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
      className="relative flex min-h-screen w-full items-start justify-center p-4 pb-28 sm:items-center sm:p-8 sm:pb-32"
      style={backgroundStyle}
    >
      {!bgLoaded && <div className="fixed inset-0 z-0 bg-gray-200 dark:bg-[#1a1b26]" />}
      <div
        className={`relative z-10 mx-auto flex w-full flex-col overflow-hidden transition-[max-width] duration-300 ease-out dark:shadow-[var(--win-shadow-dark)] ${
          isZoomed ? 'max-w-6xl' : 'max-w-3xl md:max-w-4xl lg:max-w-4xl'
        }`}
        style={
          {
            borderRadius: WINDOW_RADIUS,
            boxShadow: WINDOW_SHADOW,
            '--win-shadow-dark': WINDOW_SHADOW_DARK,
          } as CSSProperties
        }
      >
        <WindowHeader
          onToggleLockscreen={onToggleLockscreen}
          onOpenTerminal={onOpenTerminal}
          onOpenSearch={onOpenSearch}
          onBack={onBack}
          onForward={onForward}
          canBack={canBack}
          canForward={canForward}
          onZoom={() => setIsZoomed((z) => !z)}
          isZoomed={isZoomed}
          showArchive={activeTab === 5}
        />

        <TabsBar tabs={tabs} activeTab={activeTab} onSelect={onTabChange} />

        <div className="relative flex" style={{ height: isZoomed ? '72vh' : contentHeight }}>
          <div
            ref={contentRef}
            className={`flex-1 overflow-y-auto bg-white px-5 py-4 transition-all duration-300 dark:bg-[#1e1e1e] ${
              selectedProject ? 'pr-72' : ''
            }`}
            onClick={onContainerClick}
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

        <div
          className={`flex h-[28px] shrink-0 items-center justify-between border-t px-4 text-[11px] text-[#3c3c43]/60 dark:text-white/45 ${HAIRLINE} ${STATUS_MATERIAL}`}
          style={{ fontFamily: UI_FONT_STACK }}
        >
          <span>{itemCountLabel}</span>
          <span className="tabular-nums">
            &copy; {new Date().getFullYear()} Ashutosh Sundresh
          </span>
        </div>
      </div>

      {lockscreenOverlay}
      {terminalOverlay}
      {searchOverlay}
    </div>
  );
}
