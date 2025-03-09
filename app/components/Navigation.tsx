'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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
  
  // Function to show navigation
  const showNavigation = () => {
    if (isHomePage) return; // Don't auto-hide on home page
    
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
    
    // Only set initial timeout if not on home page
    if (isDesktop && !isHomePage) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktop || isHomePage) return; // Don't handle mouse move on home page
      
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
  }, [isDesktop, isHomePage]); // Add isHomePage to dependencies
  
  // useEffect to check if a detail view is open
  useEffect(() => {
    const checkForDetailView = () => {
      const detailViewElement = document.querySelector('[data-detail-view]');
      setIsDetailViewOpen(!!detailViewElement);
    };
    
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
  }, []);
  
  // Reset timer on any user interaction with the nav
  const handleInteraction = () => {
    if (isDesktop && !isHomePage) { // Don't handle interaction on home page
      showNavigation();
    }
  };

  // Determine proper visibility classes
  const visibilityClasses = () => {
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
          <Link href="/contact" className={`nav-link contact-btn ${isContactActive ? 'text-white' : ''}`}>
            Contact
            <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-opacity duration-[1s] ${isContactActive ? 'opacity-100' : 'opacity-0'}`}></span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
