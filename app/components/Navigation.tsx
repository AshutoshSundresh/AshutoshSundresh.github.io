'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';  // Check if we're on home page
  const isAboutActive = pathname === '/' || pathname === '/about';
  const isExperienceActive = pathname === '/experience';
  const isContactActive = pathname === '/contact';
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
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
  
  // Reset timer on any user interaction with the nav
  const handleInteraction = () => {
    if (isDesktop && !isHomePage) { // Don't handle interaction on home page
      showNavigation();
    }
  };

  useEffect(() => {
    // ... existing code ...
  }, [showNavigation]); // Add showNavigation to dependency array

  return (
    <nav 
      className={`