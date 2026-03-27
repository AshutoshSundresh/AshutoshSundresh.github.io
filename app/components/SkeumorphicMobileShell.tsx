"use client";

import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CourseworkPage from './coursework/CourseworkPage';
import ProjectDetailView from './ProjectDetailView';
import PublicationDetailView from './PublicationDetailView';
import type { Course, Project, Publication } from '../types';
import type { IosIconName, MobileAppDefinition, SkeumorphicTab } from './skeumorphic/shared';
import { IOS_ICON_MAP, LIQUID_GLASS_DOCK_DISPLACEMENT_MAP } from './skeumorphic/shared';

interface SkeumorphicMobileShellProps {
  activeTab: number;
  backgroundStyle: CSSProperties;
  bgLoaded: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  courseworkCourses: Course[];
  isCourseworkDetail: boolean;
  isDark: boolean;
  lockscreenOverlay: ReactNode;
  mobileActiveApp: number | null;
  mobileApps: MobileAppDefinition[];
  onBackToEducation: () => void;
  onCloseApp: () => void;
  onCloseDetailView: () => void;
  onContainerClick: () => void;
  onOpenSearch: () => void;
  onOpenTerminal: () => void;
  onToggleLockscreen: () => void;
  renderActiveTabContent: () => ReactNode;
  searchOverlay: ReactNode;
  selectedProject: Project | null;
  selectedPublication: Publication | null;
  tabs: SkeumorphicTab[];
  terminalOverlay: ReactNode;
}

type AppLaunchFrame = {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
};

function MobileStatusBarClock({
  mobileActiveApp,
  isDark,
}: {
  mobileActiveApp: number | null;
  isDark: boolean;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-13 px-12">
      <div
        className={`flex h-full items-end justify-between pb-3 text-[0.82rem] font-semibold tracking-[0.01em] ${
          mobileActiveApp === null ? 'text-white/95' : isDark ? 'text-white/95' : 'text-black/90'
        }`}
      >
        <span>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
        <span>{now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  );
}

export default function SkeumorphicMobileShell({
  activeTab,
  backgroundStyle,
  bgLoaded,
  contentRef,
  courseworkCourses,
  isCourseworkDetail,
  isDark,
  lockscreenOverlay,
  mobileActiveApp,
  mobileApps,
  onBackToEducation,
  onCloseApp,
  onCloseDetailView,
  onContainerClick,
  onOpenSearch,
  onOpenTerminal,
  onToggleLockscreen,
  renderActiveTabContent,
  searchOverlay,
  selectedProject,
  selectedPublication,
  tabs,
  terminalOverlay,
}: SkeumorphicMobileShellProps) {
  const [appLaunchFrame, setAppLaunchFrame] = useState<AppLaunchFrame | null>(null);

  useEffect(() => {
    if (mobileActiveApp === null) {
      setAppLaunchFrame(null);
    }
  }, [mobileActiveApp]);

  const renderIosIcon = (iconName: IosIconName, className: string) => {
    const icon = IOS_ICON_MAP[iconName];

    return (
      <svg
        aria-hidden="true"
        viewBox={icon.viewBox}
        className={className}
        fill="currentColor"
        dangerouslySetInnerHTML={{ __html: icon.markup }}
      />
    );
  };

  const shouldRenderHome = mobileActiveApp === null || appLaunchFrame !== null;

  const renderMobileHome = () => (
    <div
      className={`relative min-h-[100dvh] w-full overflow-hidden text-white transition-[transform,opacity,filter] duration-300 ${
        mobileActiveApp === null ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-100'
      }`}
      style={{
        transform: mobileActiveApp === null ? 'scale(1)' : 'scale(0.985)',
        filter: mobileActiveApp === null ? 'blur(0px)' : 'blur(0.35px)',
      }}
    >
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <filter id="iosLiquidGlassDock" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage href={LIQUID_GLASS_DOCK_DISPLACEMENT_MAP} x="0" y="0" width="100%" height="100%" result="displacementMap" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
            <feGaussianBlur in="refracted" stdDeviation="0.15" result="softened" />
            <feColorMatrix in="softened" type="saturate" values="1.12" result="glass" />
            <feBlend in="glass" in2="SourceGraphic" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/25 dark:from-black/30 dark:via-black/20 dark:to-black/45" />
      <div className="absolute -top-20 -left-10 h-52 w-52 rounded-full bg-cyan-300/25 blur-3xl dark:bg-blue-500/20" />
      <div className="absolute top-1/3 -right-12 h-60 w-60 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-violet-500/20" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-5 pb-6 pt-11">
        <div className="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
          {mobileApps.map((app) => (
            <button
              key={app.title}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setAppLaunchFrame({
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  borderRadius: 22,
                });
                app.action();
              }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className={`relative flex h-18 w-18 items-center justify-center rounded-[22px] bg-gradient-to-br ${app.gradient}`}>
                {renderIosIcon(app.iconName, 'relative z-10 h-8 w-8 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]')}
              </span>
              <span className="text-[0.72rem] font-medium leading-tight text-white/92">{app.title}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="flex justify-center pb-5">
            <button
              type="button"
              onClick={onOpenSearch}
              className="relative flex items-center gap-1.5 overflow-hidden rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[0.72rem] font-medium text-white/90 shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-colors"
              style={{
                WebkitBackdropFilter: 'url(#iosLiquidGlassDock) blur(16px) saturate(180%) brightness(1.05)',
                backdropFilter: 'url(#iosLiquidGlassDock) blur(16px) saturate(180%) brightness(1.05)',
              }}
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.09)_42%,rgba(255,255,255,0.03)_100%)]" />
              <span className="pointer-events-none absolute inset-[1px] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.08)]" />
              <span className="pointer-events-none absolute left-3 right-3 top-0.5 h-3 rounded-full bg-white/22 blur-sm dark:bg-white/10" />
              <Search className="relative z-10 h-3.5 w-3.5 opacity-80" strokeWidth={2.2} />
              <span className="relative z-10">Search</span>
            </button>
          </div>
          <div
            className="relative mx-auto flex w-full items-center justify-between overflow-hidden rounded-[32px] border border-white/30 bg-white/10 px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.16)] dark:border-white/15 dark:bg-white/[0.06]"
            style={{
              WebkitBackdropFilter: 'url(#iosLiquidGlassDock) blur(20px) saturate(185%) brightness(1.06)',
              backdropFilter: 'url(#iosLiquidGlassDock) blur(20px) saturate(185%) brightness(1.06)',
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.10)_38%,rgba(255,255,255,0.04)_100%)]" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[31px] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-1px_0_rgba(255,255,255,0.08)]" />
            <div className="pointer-events-none absolute left-3 right-3 top-1 h-8 rounded-full bg-white/28 blur-md dark:bg-white/14" />
            <div className="pointer-events-none absolute left-8 top-0 h-10 w-16 rounded-full bg-white/22 blur-lg dark:bg-white/10" />
            <div className="pointer-events-none absolute bottom-0 left-6 right-6 h-6 rounded-full bg-black/8 blur-xl dark:bg-black/16" />
            <Link href="/" className="relative z-10 flex flex-1 items-center justify-center text-white/95">
              <span className="relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-sky-300/95 via-blue-500/95 to-indigo-600/95">
                {renderIosIcon('home', 'h-8 w-8 text-white')}
              </span>
            </Link>
            <button
              type="button"
              onClick={onOpenTerminal}
              className="relative z-10 flex flex-1 items-center justify-center text-white/95"
              aria-label="Open terminal"
            >
              <span className="relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-zinc-200/95 via-zinc-500/95 to-zinc-800/95">
                {renderIosIcon('terminal', 'h-8 w-8 text-white')}
              </span>
            </button>
            <button
              type="button"
              onClick={onToggleLockscreen}
              className="relative z-10 flex flex-1 items-center justify-center text-white/95"
              aria-label="Lock screen"
            >
              <span className="relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-amber-200/95 via-orange-400/95 to-rose-500/95">
                {renderIosIcon('lock', 'h-8 w-8 text-white')}
              </span>
            </button>
            <a href="mailto:ashutoshsun@g.ucla.edu" className="relative z-10 flex flex-1 items-center justify-center text-white/95">
              <span className="relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-emerald-300/95 via-teal-400/95 to-cyan-500/95">
                {renderIosIcon('contact', 'h-8 w-8 text-white')}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileAppView = () => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1;
    const initialMotion = appLaunchFrame
      ? {
          x: appLaunchFrame.left - (viewportWidth - appLaunchFrame.width) / 2,
          y: appLaunchFrame.top - (viewportHeight - appLaunchFrame.height) / 2,
          scaleX: appLaunchFrame.width / viewportWidth,
          scaleY: appLaunchFrame.height / viewportHeight,
          borderRadius: appLaunchFrame.borderRadius,
          opacity: 0.92,
        }
      : {
          opacity: 0,
          scale: 0.985,
        };
    const exitMotion = appLaunchFrame
      ? {
          x: appLaunchFrame.left - (viewportWidth - appLaunchFrame.width) / 2,
          y: appLaunchFrame.top - (viewportHeight - appLaunchFrame.height) / 2,
          scaleX: appLaunchFrame.width / viewportWidth,
          scaleY: appLaunchFrame.height / viewportHeight,
          borderRadius: appLaunchFrame.borderRadius,
          opacity: 0.9,
        }
      : {
          opacity: 0,
          scale: 0.99,
        };

    return (
      <motion.div
        className="absolute inset-0 z-20"
        initial={initialMotion}
        animate={{
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: 0,
          opacity: 1,
          scale: 1,
        }}
        exit={exitMotion}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 34,
          mass: 0.9,
        }}
        onAnimationComplete={() => {
          if (mobileActiveApp !== null) {
            setAppLaunchFrame(null);
          }
        }}
        style={{ position: 'absolute', transformOrigin: 'center center' }}
      >
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden">
          <div className="absolute inset-0 bg-white dark:bg-[#0f1115]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f4f5f8] to-transparent dark:from-[#171b22] dark:to-transparent" />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <div className="absolute inset-x-0 top-0 z-20 border-b border-black/5 bg-white/88 px-5 pb-3 pt-14 backdrop-blur-xl dark:border-white/8 dark:bg-[#101319]/82">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <button
                  type="button"
                  onClick={isCourseworkDetail ? onBackToEducation : onCloseApp}
                  className="flex items-center justify-start gap-1 text-[0.95rem] font-medium text-[#007aff] dark:text-[#4da3ff]"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                  <span>{isCourseworkDetail ? 'Education' : 'Home'}</span>
                </button>
                <div className="font-['Raleway'] text-[0.95rem] font-semibold text-gray-900 dark:text-gray-100">
                  {isCourseworkDetail ? 'Coursework' : tabs[activeTab].title}
                </div>
                <div />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div
                ref={contentRef}
                className={`h-full bg-white transition-colors dark:bg-[#0f1115] ${
                  isCourseworkDetail ? 'overflow-hidden px-5 pb-8 pt-24' : 'overflow-y-auto px-5 pb-8 pt-24'
                } ${selectedProject ? 'hidden' : ''}`}
                onClick={onContainerClick}
              >
                {isCourseworkDetail ? <CourseworkPage courses={courseworkCourses} /> : renderActiveTabContent()}
              </div>

              {selectedProject && <ProjectDetailView project={selectedProject} onClose={onCloseDetailView} isMobile />}

              {selectedPublication && (
                <PublicationDetailView
                  publication={selectedPublication}
                  onClose={onCloseDetailView}
                  isMobile
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-[100dvh] w-full" style={backgroundStyle}>
      {!bgLoaded && <div className="fixed inset-0 z-0 bg-gray-200 dark:bg-[#1a1b26]" />}
      <MobileStatusBarClock mobileActiveApp={mobileActiveApp} isDark={isDark} />
      <div className="relative z-10">
        {shouldRenderHome ? renderMobileHome() : null}
        <AnimatePresence mode="wait">
          {mobileActiveApp !== null ? <div key={`app-${mobileActiveApp}`}>{renderMobileAppView()}</div> : null}
        </AnimatePresence>
      </div>
      {lockscreenOverlay}
      {terminalOverlay}
      {searchOverlay}
    </div>
  );
}
