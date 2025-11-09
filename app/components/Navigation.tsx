'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import useAppOverlayState from '../hooks/useAppOverlayState';
import { SEMANTIC_COLORS } from '../constants/colors';

/* eslint-disable react-hooks/exhaustive-deps */

const Navigation = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';  // Check if we're on home page
  const isAboutActive = pathname === '/' || pathname === '/about';
  const isExperienceActive = pathname === '/experience';
  const isContactActive = pathname === '/contact';
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false); // State to track if detail view is open
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get app overlay state
  const { isTerminalActive, isLockscreenActive, isSearchActive } = useAppOverlayState();
  
  // Function to show navigation
  const showNavigation = () => {
    if (isHomePage) return; // Don't auto-hide on home page
    if (isTerminalActive || isLockscreenActive || isSearchActive) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to hide the navigation after 2.5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
  };
  
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    
    if (isTerminalActive || isLockscreenActive || isSearchActive) {
      setIsVisible(false);
    }

    // Only set initial timeout if not on home page 
    if (isDesktop && !isHomePage) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      // Don't handle mouse move on home page, when detail view is open, or when terminal or lockscreen is active
      if (!isDesktop || isHomePage || isDetailViewOpen || isTerminalActive || isLockscreenActive || isSearchActive) return;
      
      if (e.clientY > window.innerHeight - 100) {
        showNavigation();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('resize', checkIfDesktop);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDesktop, isHomePage, isDetailViewOpen, isTerminalActive, isLockscreenActive, isSearchActive]);
  
  // useEffect to check if a detail view is open
  useEffect(() => {
    const checkForDetailView = () => {
      const detailViewElement = document.querySelector('[data-detail-view]');
      setIsDetailViewOpen(!!detailViewElement);
    };

    if (isTerminalActive || isLockscreenActive) {
      setIsVisible(false);
    }
    
    // Check initially
    checkForDetailView();
    
    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(checkForDetailView);
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
    
    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, [isTerminalActive, isLockscreenActive]); // Add isTerminalActive and isLockscreenActive as dependencies
  
  // Add a dedicated effect for app overlay state changes
  useEffect(() => {
    // If terminal or lockscreen becomes active, force hide the navigation
    if (isTerminalActive || isLockscreenActive || isSearchActive) {
      setIsVisible(false);
    }
  }, [isTerminalActive, isLockscreenActive, isSearchActive]);
  
  // Reset timer on any user interaction with the nav
  const handleInteraction = () => {
    if (isDesktop && !isHomePage && !isTerminalActive && !isLockscreenActive && !isSearchActive) { 
      showNavigation();
    }
  };

  // Determine proper visibility classes
  const visibilityClasses = () => {
    // Always hide if terminal or lockscreen is active (regardless of desktop or mobile)
    if (isTerminalActive || isLockscreenActive || isSearchActive) {
      return 'opacity-0 translate-y-20 pointer-events-none';
    }
    
    if (isDesktop) {
      // Desktop behavior - fade up/down based on timeout
      return !isVisible && !isHomePage 
        ? 'opacity-0 translate-y-20 pointer-events-none' 
        : 'opacity-100 translate-y-0';
    } else {
      // Mobile behavior - slide down out of view when detail view is open
      return isDetailViewOpen 
        ? 'opacity-0 translate-y-32 pointer-events-none' 
        : 'opacity-100 translate-y-0';
    }
  };

  return (
    <nav 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 md:px-8 md:py-4 px-3 py-2 rounded-full shadow-lg z-[9999] transition-all duration-500 ease-in-out ${visibilityClasses()}`}
      onMouseOver={handleInteraction}
      onClick={handleInteraction}
      style={{ backgroundColor: SEMANTIC_COLORS.navBackground, color: SEMANTIC_COLORS.navText }}
    >
      <ul className="flex items-center gap-2 md:gap-8" style={{ color: SEMANTIC_COLORS.navText }}>
        <li className="relative">
          <Link href="/" className={`nav-link ${isAboutActive ? 'nav-active-pressed text-white' : ''}`}>
              <span className="p-2 md:px-1">Home</span>  
          </Link>
        </li>
        <li className="nav-dot">·</li>
        <li className="relative">
          <Link href="/experience" className={`nav-link ${isExperienceActive ? 'nav-active-pressed text-white' : ''}`}>
              <span className="p-2 md:px-1">Explore</span>  
          </Link>
        </li>
        <li className="nav-dot">|</li>
        <li className="relative">
          <Link href="mailto:ashutoshsun@g.ucla.edu" className={`nav-link contact-btn ${isContactActive ? 'text-white' : ''}`}>
            <span className="p-0.5 md:px-1">Contact</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
