'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import useAppOverlayState from '../hooks/useTerminalState';

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
  const { isTerminalActive, isLockscreenActive } = useAppOverlayState();
  
  // Function to show navigation
  const showNavigation = () => {
    if (isHomePage) return; // Don't auto-hide on home page
    if (isTerminalActive || isLockscreenActive) {
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
    
    if (isTerminalActive || isLockscreenActive) {
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
      if (!isDesktop || isHomePage || isDetailViewOpen || isTerminalActive || isLockscreenActive) return;
      
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
  }, [isDesktop, isHomePage, isDetailViewOpen, isTerminalActive, isLockscreenActive]); // Add isTerminalActive and isLockscreenActive to dependencies
  
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
    if (isTerminalActive || isLockscreenActive) {
      setIsVisible(false);
    }
  }, [isTerminalActive, isLockscreenActive]);
  
  // Reset timer on any user interaction with the nav
  const handleInteraction = () => {
    if (isDesktop && !isHomePage && !isTerminalActive && !isLockscreenActive) { // Don't handle interaction on home page or when terminal or lockscreen is active
      showNavigation();
    }
  };

  // Determine proper visibility classes
  const visibilityClasses = () => {
    // Always hide if terminal or lockscreen is active (regardless of desktop or mobile)
    if (isTerminalActive || isLockscreenActive) {
      return 'opacity-0 translate-y-20 pointer-events-none';
    }
    
    if (isDesktop) {
      // Desktop behavior - fade up/down based on timeout
      return !isVisible && !isHomePage 
        ? 'opacity-0 translate-y-20 pointer-events-none' 
        : 'opacity-100';
    } else {
      // Mobile behavior - slide down out of view when detail view is open
      return isDetailViewOpen 
        ? 'opacity-0 translate-y-32 pointer-events-none' 
        : 'opacity-100';
    }
  };

  return (
    <nav 
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 ${isExperienceActive ? 'bg-black/50 backdrop-blur-md' : 'bg-[#2A2A2A]'} px-8 py-4 md:px-8 md:py-4 px-3 py-2 rounded-full shadow-lg z-[9999] transition-all duration-500 ${visibilityClasses()}`}
      onMouseOver={handleInteraction}
      onClick={handleInteraction}
    >
      <ul className="flex items-center gap-2 md:gap-8 text-[#CCCCCC]">
        <li className="relative">
          <Link href="/" className={`nav-link ${isAboutActive ? 'text-white' : ''}`}>
              Home  
            <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-opacity duration-[1s] ${isAboutActive ? 'opacity-100' : 'opacity-0'}`}></span>
          </Link>
        </li>
        <li className="nav-dot">·</li>
        <li className="relative">
          <Link href="/experience" className={`nav-link ${isExperienceActive ? 'text-white' : ''}`}>
              About  
            <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-opacity duration-[1s] ${isExperienceActive ? 'opacity-100' : 'opacity-0'}`}></span>
          </Link>
        </li>
        <li className="nav-dot">|</li>
        <li className="relative">
          <Link href="mailto:ashutoshsun@g.ucla.edu" className={`nav-link contact-btn ${isContactActive ? 'text-white' : ''}`}>
            Contact
            <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-opacity duration-[1s] ${isContactActive ? 'opacity-100' : 'opacity-0'}`}></span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
