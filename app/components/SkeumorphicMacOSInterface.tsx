/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import useAppOverlayState from '../hooks/useTerminalState';
import IOSLockscreen from './IOSLockscreen';
import data from '../data/skeumorphicData.json';

interface ProjectDetails {
  id: number;
  name: string;
  image: string;  // URL to project image/screenshot
  caption: string; // Short caption for the image
  description: string; // Full description
  created: Date;
  kind?: string;
  size?: string;
  link?: string; // Optional project URL
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
}

// Add new interface for publications
interface Publication {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  icon: string;
  description: string;
  authors?: string[];
  journal?: string;
  doi?: string;
  abstract?: string;
  link?: string;
  citations?: number;
  status?: string;
  extraDetails?: Array<{
    label: string;
    value: string;
  }>;
}

// Add interface for award type
interface Award {
  title: string;
  subtitle?: string;  // Make subtitle optional
  year: string;
  icon: string;
  description?: string;
  highlight?: string;
  stats?: string;
  link?: string;
  extraDetails?: string;
}

const MacOSWindow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Add ref array for tab elements
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabs, setTabs] = useState([
    { id: 0, title: 'Projects', content: 'Git repositories and development projects' },
    { id: 1, title: 'Education', content: 'Academic background and achievements' },
    { id: 2, title: 'Experience', content: 'Professional experience and internships' },
    { id: 3, title: 'Awards', content: 'Honors and recognition' },
    { id: 4, title: 'Publications', content: 'Research papers and publications' },
    { id: 5, title: 'Activities', content: 'Extracurricular and leadership activities' }
  ]);

  const [windowHeight, setWindowHeight] = useState({
    vh: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  });

  const [tabHistory, setTabHistory] = useState<number[]>([0]); // Start with first tab
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Add state for tracking touch events
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  // Add state for tab position offset
  const [tabOffset, setTabOffset] = useState(0);

  // Minimum distance required for a swipe
  const minSwipeDistance = 50;

  // Maximum angle (in degrees) from horizontal for a valid swipe
  const maxSwipeAngle = 30;

  const [randomStorage, setRandomStorage] = useState('');
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const [lockscreenVisible, setLockscreenVisible] = useState(false);

  const { setTerminalActive, setLockscreenActive } = useAppOverlayState();

  useEffect(() => {
    setTerminalActive(terminalMode);
  }, [terminalMode, setTerminalActive]);

  useEffect(() => {
    setLockscreenActive(lockscreenVisible);
  }, [lockscreenVisible, setLockscreenActive]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight({
        vh: window.innerHeight,
        isMobile: window.innerWidth < 768
      });
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset selected item when tab changes
  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  // Update the useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        // Check if the click was inside the detail view
        const detailView = document.querySelector('[data-detail-view]');
        if (detailView && detailView.contains(event.target as Node)) {
          return; // Don't deselect if clicking inside detail view
        }
        setSelectedItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Calculate horizontal and vertical distances
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    // Calculate the absolute horizontal distance
    const horizontalDistance = Math.abs(deltaX);

    // Calculate the angle of the swipe in degrees
    const angleInRadians = Math.atan2(Math.abs(deltaY), horizontalDistance);
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    // Check if the swipe meets both the distance and angle requirements
    const isValidHorizontalSwipe =
      horizontalDistance > minSwipeDistance &&
      angleInDegrees < maxSwipeAngle;

    // Don't process swipes if detail view is open or if not a valid horizontal swipe
    if (selectedItem !== null || !isValidHorizontalSwipe) {
      // Reset touch coordinates and return
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    // Determine swipe direction (left or right)
    const isLeftSwipe = deltaX > 0;
    const isRightSwipe = deltaX < 0;

    // Get the width of a single tab
    const tabWidth = getTabWidth();

    // Navigate based on swipe direction
    if (isLeftSwipe) {
      // Only proceed if not on the last tab
      if (activeTab < tabs.length - 1) {
        // Swipe left to go to next tab
        const nextTab = activeTab + 1;
        // Calculate new offset and constrain it
        const newOffset = tabOffset - tabWidth;
        setTabOffset(getConstrainedOffset(newOffset));
        handleTabChange(nextTab);
      }
    } else if (isRightSwipe) {
      // Only proceed if not on the first tab
      if (activeTab > 0) {
        // Swipe right to go to previous tab
        const prevTab = activeTab - 1;
        // Calculate new offset and constrain it
        const newOffset = tabOffset + tabWidth;
        setTabOffset(getConstrainedOffset(newOffset));
        handleTabChange(prevTab);
      }
    }

    // Reset touch coordinates
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Add function to calculate tab width
  const getTabWidth = () => {
    // If tabs are not yet rendered, return a default value
    if (!tabRefs.current.length || !tabRefs.current[0]) return 45;

    // Calculate width of the active tab or the first available tab
    const activeTabRef = tabRefs.current[activeTab] || tabRefs.current[0];
    return activeTabRef ? activeTabRef.offsetWidth : 45;
  };

  // Add function to calculate maximum scroll offset
  const getMaxScrollOffset = () => {
    if (!tabRefs.current.length) return 0;

    // Calculate total width of all tabs
    const tabContainer = document.querySelector('.tab-container');
    const tabsContainer = document.querySelector('.tabs-container');

    if (!tabContainer || !tabsContainer) return 0;

    // Get the width of the visible tab container and the total width of all tabs
    const containerWidth = tabContainer.clientWidth;
    const tabsWidth = tabsContainer.scrollWidth;

    // Calculate maximum offset (0 or negative value)
    // When all tabs can fit, max is 0 (no scrolling needed)
    // When tabs overflow, max is (container width - total tabs width)
    return Math.min(0, containerWidth - tabsWidth);
  };

  // Function to ensure offset stays within bounds
  const getConstrainedOffset = (proposedOffset: number) => {
    // Don't allow scrolling to the right beyond starting point (0)
    const maxRight = 0;

    // Don't allow scrolling to the left beyond the last tab
    const maxLeft = getMaxScrollOffset();

    // Constrain the offset within the allowed range
    return Math.max(maxLeft, Math.min(maxRight, proposedOffset));
  };

  // Calculate content height - on mobile take up most of the screen, on desktop use fixed height
  const contentHeight = windowHeight.isMobile
    ? `${Math.max(windowHeight.vh * 0.6, 350)}px`
    : '520px';

  // Create a separate clock component to isolate time updates
  const Clock = ({ formatString }: { formatString: string }) => {
    const [time, setTime] = useState(new Date());
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000);
      
      return () => clearInterval(intervalId);
    }, []);
  
    return <>{format(time, formatString)}</>;
  };

  // Format current date for status bar - static version that doesn't cause re-renders
  const currentDate = format(new Date(), 'MMMM d, yyyy h:mm a');

  // Effect to initialize random storage on mount
  useEffect(() => {
    // Generate initial random storage value
    updateRandomStorage();
  }, []);

  // Function to update random storage
  const updateRandomStorage = () => {
    const newStorage = (Math.floor(Math.random() * 990) / 10).toFixed(1);
    setRandomStorage(newStorage);
  };

  // Project data
  const projects: ProjectDetails[] = (data as any).projects.map((p: any) => ({
    ...p,
    created: new Date(p.created as string)
  }));

  // Folder icon image URL
  const folderIconUrl = (data as any).folderIconUrl;

  // Update the education data interface and content
  const educationData = (data as any).educationData;

  // Update the experience data
  const experienceData = (data as any).experienceData;

  // Add this state for tracking expanded items
  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([]);

  // Add this function to handle expansion
  const toggleExperienceExpansion = (id: number) => {
    setExpandedExperiences(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

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

  const DetailView = ({ project, onClose }: { project: ProjectDetails; onClose: () => void }) => {
    return (
      <div
        data-detail-view
        className={`
          ${windowHeight.isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-72 border-l border-gray-200 bg-gray-50'}
          overflow-y-auto
        `}
      >
        {/* Header with close button on mobile */}
        {windowHeight.isMobile && (
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 className="text-sm font-medium font-['Raleway']">Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Project Image */}
          <div className="mb-4">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-auto rounded-lg shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-2 italic font-['Raleway']">{project.caption}</p>
          </div>

          {/* Project Title */}
          <h3 className="text-lg font-medium mb-2 font-['Raleway']">{project.name}</h3>

          {/* Project Stats if available */}
          {project.stats && project.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
              {project.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Description</p>
              <p className="font-['Raleway'] leading-relaxed">
                {project.description.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Created</p>
              <p className="font-['Raleway']">{format(project.created, 'MMM d, yyyy')}</p>
            </div>

            {project.link && (
              <div>
                <p className="text-gray-500 mb-1">Project Link</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 font-['Raleway']"
                >
                  View Project →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // State for background image loading
  const [bgLoaded, setBgLoaded] = useState(false);
  const [highResBgLoaded, setHighResBgLoaded] = useState(false);

  // Update the backgroundStyle object
  const backgroundStyle = {
    backgroundImage: highResBgLoaded 
      ? 'url("https://512pixels.net/downloads/macos-wallpapers/10-13.jpg")' 
      : bgLoaded 
        ? 'url("https://c4.wallpaperflare.com/wallpaper/951/295/751/macos-high-sierra-4k-new-hd-wallpaper-preview.jpg")' 
        : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed' as const,  // Type assertion needed for position property
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    transition: 'background-image 0.5s ease-in-out'
  };

  // Lazy load the background image progressively
  useEffect(() => {
    // Load low-res image first
    const lowResImg = new window.Image();
    lowResImg.src = "https://c4.wallpaperflare.com/wallpaper/951/295/751/macos-high-sierra-4k-new-hd-wallpaper-preview.jpg";
    lowResImg.onload = () => {
      setBgLoaded(true);
      
      // Then load high-res image
      const highResImg = new window.Image();
      highResImg.src = "https://512pixels.net/downloads/macos-wallpapers/10-13.jpg";
      highResImg.onload = () => {
        setHighResBgLoaded(true);
      };
    };
  }, []);

  // Update the awards data
  const awardsData: { id: number; category: string; awards: Award[] }[] = (data as any).awardsData;

  // Update the publications data
  const publications: Publication[] = (data as any).publications;

  // Update the PublicationDetailView component
  const PublicationDetailView = ({
    publication,
    onClose
  }: {
    publication: Publication;
    onClose: () => void;
  }) => {
    return (
      <div
        data-detail-view
        className={`
          ${windowHeight.isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-72 border-l border-gray-200 bg-gray-50'}
          overflow-y-auto font-['Raleway']
        `}
      >
        {/* Close button for mobile */}
        {windowHeight.isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="p-4 space-y-6">
          {/* Large centered icon and title */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 mb-4 relative transition-transform duration-[8s] group-hover:scale-105">
              <img
                src={publication.icon}
                alt=""
                className="w-32 h-32 object-contain"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 break-words">
              {publication.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {publication.year}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-4 text-sm">
            {publication.authors && (
              <div>
                <h3 className="font-medium text-gray-900">Authors</h3>
                <p className="text-gray-600 break-words">
                  {publication.authors.join(", ")}
                </p>
              </div>
            )}

            {publication.journal && (
              <div>
                <h3 className="font-medium text-gray-900">Journal</h3>
                <p className="text-gray-600 break-words">
                  {publication.journal}
                </p>
              </div>
            )}

            {publication.abstract && (
              <div>
                <h3 className="font-medium text-gray-900">Abstract</h3>
                <p className="text-gray-600 whitespace-pre-wrap break-words">
                  {publication.abstract}
                </p>
              </div>
            )}

            {publication.status && (
              <div>
                <h3 className="font-medium text-gray-900">Status</h3>
                <p className="text-gray-600 break-words">
                  {publication.status}
                </p>
              </div>
            )}

            {/* Extra Details */}
            {publication.extraDetails && publication.extraDetails.length > 0 && (
              <div className="pt-2 space-y-2">
                {publication.extraDetails.map((detail, index) => (
                  <a
                    key={index}
                    href={detail.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 mr-4"
                  >
                    <span>{detail.label} →</span>
                  </a>
                ))}
              </div>
            )}

            {/* Main Link */}
            {publication.link && (
              <div className="pt-2">
                <a
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                  View Publication →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add activities data
  interface Activity {
    id: number;
    title: string;
    period: string;
    description: string;
    highlights?: string[];
    link?: {
      text: string;
      url: string;
    };
    links?: {
      text: string;
      url: string;
    }[];
    stats?: {
      value: string;
      label: string;
    }[];
    icon?: string;
  }

  const activitiesData: Activity[] = (data as any).activitiesData;

  // Add function to handle tab changes
  const handleTabChange = (tabId: number) => {
    // Only add to history if we're changing to a different tab
    if (tabId !== activeTab) {
      // If we're not at the end of the history, remove all forward history
      const newHistory = tabHistory.slice(0, currentHistoryIndex + 1);
      setTabHistory([...newHistory, tabId]);
      setCurrentHistoryIndex(newHistory.length);
      setActiveTab(tabId);

      // Update the random storage size only when tab changes
      updateRandomStorage();
    }
  };

  // Add navigation functions
  const handleBack = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setActiveTab(tabHistory[currentHistoryIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentHistoryIndex < tabHistory.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setActiveTab(tabHistory[currentHistoryIndex + 1]);
    }
  };

  const toggleTerminalMode = () => {
    const newTerminalMode = !terminalMode;
    setTerminalMode(newTerminalMode);

    if (newTerminalMode) {
      setTerminalInput('');
      setTerminalOutput([
        'Welcome to Ashutosh Terminal v1.0.0',
        '---------------------------------',
        'Available commands:',
        '  ls projects     - List all projects',
        '  ls education    - List all education entries',
        '  ls experience   - List all experience entries',
        '  ls awards       - List all awards',
        '  ls publications - List all publications',
        '  ls activities   - List all activities',
        '  q               - Exit terminal',
        '---------------------------------',
        'Type a command and press Enter:'
      ]);

      // Focus the input field when terminal opens
      setTimeout(() => {
        if (terminalInputRef.current) {
          terminalInputRef.current.focus();

          // For mobile devices - attempt to show keyboard
          if (windowHeight.isMobile && terminalInputRef.current) {
            terminalInputRef.current.focus();
            // Some mobile browsers require a user interaction to show keyboard
            // We can try to simulate a click
            terminalInputRef.current.click();
          }
        }
      }, 100);
    }
  };

  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = terminalInput.trim().toLowerCase();

      // Add the command to the terminal output
      setTerminalOutput(prev => [...prev, `ashutosh@portfolio:~$ ${terminalInput}`]);

      // Process command
      if (command === 'q') {
        setTerminalMode(false);
      } else if (command === 'ls projects') {
        const projectLines = projects.map(project => `- ${project.name}`);
        setTerminalOutput(prev => [...prev, ...projectLines]);
      } else if (command === 'ls education') {
        const educationLines = educationData.map((edu: any) =>
          `- ${edu.institution || ''} ${edu.degree || ''}`
        );
        setTerminalOutput(prev => [...prev, ...educationLines]);
      } else if (command === 'ls experience') {
        const experienceLines = experienceData.map((exp: any) =>
          `- ${exp.company}: ${exp.position}`
        );
        setTerminalOutput(prev => [...prev, ...experienceLines]);
      } else if (command === 'ls awards') {
        const awardLines = awardsData.flatMap(category =>
          category.awards.map(award => `- ${award.title}`)
        );
        setTerminalOutput(prev => [...prev, ...awardLines]);
      } else if (command === 'ls publications') {
        const publicationLines = publications.map(pub =>
          `- ${pub.title}`
        );
        setTerminalOutput(prev => [...prev, ...publicationLines]);
      } else if (command === 'ls activities') {
        const activityLines = activitiesData.map(activity =>
          `- ${activity.title}`
        );
        setTerminalOutput(prev => [...prev, ...activityLines]);
      } else {
        setTerminalOutput(prev => [
          ...prev,
          `Command not found: ${command}`
        ]);
      }

      // Clear input
      setTerminalInput('');
    }
  };

  // Auto-scroll to the bottom of the terminal output whenever it changes
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Add keyboard event listener for escape key to close terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && terminalMode) {
        setTerminalMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [terminalMode]);

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
      {!bgLoaded && (
        <div className="fixed inset-0 bg-gray-200 z-0" />
      )}
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white relative z-10">
        {/* Window header with traffic lights */}
        <div className="bg-gray-200 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <Link href="/">
              <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"></div>
            </Link>
            <div
              className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
              onClick={toggleLockscreen}
            ></div>
            <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" onClick={toggleTerminalMode}></div>
          </div>

          {/* Window title - centered */}
          <div className="flex-1 text-center text-sm text-gray-700 font-medium font-['Raleway']">Finder</div>

          {/* Placeholder for right side controls */}
          <div className="w-16"></div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-100 px-2 py-1 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              disabled={currentHistoryIndex === 0}
              className={`text-xs px-2 py-1 rounded hover:bg-gray-200 font-['Raleway'] flex items-center
              ${currentHistoryIndex === 0 ? 'text-gray-400 hover:bg-transparent cursor-not-allowed' : 'text-gray-700'}
            `}
            >
              <svg
                className="w-3 h-3 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <button
              onClick={handleForward}
              disabled={currentHistoryIndex >= tabHistory.length - 1}
              className={`text-xs px-2 py-1 rounded hover:bg-gray-200 font-['Raleway'] flex items-center
              ${currentHistoryIndex >= tabHistory.length - 1 ? 'text-gray-400 hover:bg-transparent cursor-not-allowed' : 'text-gray-700'}
            `}
            >
              <svg
                className="w-3 h-3 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Forward
            </button>
          </div>

          {/* Archive link - only show on Activities tab */}
          {activeTab === 5 && (
            <a
              href="https://ashutoshsundresh.com/archive.html#extracurriculars"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded hover:bg-gray-200 font-['Raleway'] text-gray-600 hover:text-gray-800"
            >
              View High School Archive →
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="flex items-center">
            {/* Visible tabs - show only 3 on mobile */}
            <div className="flex-1 flex">
              {tabs.slice(0, windowHeight.isMobile ? 3 : undefined).map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    px-4 py-2 text-sm font-medium whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Hamburger menu for mobile */}
            {windowHeight.isMobile && (
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16" 
                      className={activeTab === 3 ? 'text-blue-500' : ''}
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 12h16" 
                      className={activeTab === 4 ? 'text-blue-500' : ''}
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 18h16" 
                      className={activeTab === 5 ? 'text-blue-500' : ''}
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showMobileMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-gray-200 py-1 z-50">
                    {tabs.slice(3).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          handleTabChange(tab.id);
                          setShowMobileMenu(false);
                        }}
                        className={`
                          w-full px-4 py-2 text-sm text-left
                          ${activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar and content */}
        <div className="flex" style={{ height: contentHeight }}>

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
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex flex-col items-center group cursor-pointer p-2 rounded-md ${selectedItem === project.id ? 'bg-[#0069d9]' : 'hover:bg-gray-100'
                      }`}
                    onClick={(e) => handleItemClick(e, project.id)}
                  >
                    <div className="w-16 h-16 mb-1 relative transition-transform duration-[8s] group-hover:scale-105">
                      <img
                        src={folderIconUrl}
                        alt="Folder"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center max-w-[100px]">
                      <p className={`text-xs font-['Raleway'] text-center break-words leading-tight mb-1 ${selectedItem === project.id ? 'text-white' : 'text-gray-800'
                        }`}>
                        {project.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 1 && (
              <div className="mt-4 space-y-6">
                {educationData.map((edu: any) => (
                  <div
                    key={edu.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 mr-4 relative">
                          <img
                            src={edu.icon}
                            alt={edu.institution}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <a
                              href={edu.institutionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              {edu.institution}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-500">{edu.period}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      {edu.degree && (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.school}</p>
                        </div>
                      )}

                      {edu.gpa && (
                       <p className="text-sm font-medium text-gray-900">{edu.gpa}</p>
                      )}
                      
                      {edu.details.grades && (
                        <div className="space-y-2">
                          {edu.details.grades.map((grade: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{grade.grade}</span>
                              <span className="font-medium">{grade.score}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {edu.details.achievements && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">Achievements</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                             {edu.details.achievements.map((achievement: string, index: number) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {edu.details.subjects && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">Subjects</p>
                          <div className="flex flex-wrap gap-2">
                             {edu.details.subjects.map((subject: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add links at the bottom */}
                      <div className="pt-2 flex gap-4">
                        {edu.courseLink && (
                          <a
                            href={edu.courseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            View Coursework →
                          </a>
                        )}
                        {edu.archiveLink && (
                          <a
                            href={edu.archiveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            View Archive →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 2 && (
              <div className="mt-4 space-y-6">
                {experienceData.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-start">
                        <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                          <img
                            src={exp.icon}
                            alt={exp.company}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <a
                              href={exp.companyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              {exp.company}
                            </a>
                          </h3>
                          <p className="text-sm font-medium text-gray-800">{exp.position}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{exp.location}</span>
                            <span className="mx-2">•</span>
                            <span>{exp.period}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Updated Content section */}
                    <div className="p-4">
                      <ul className="space-y-2 text-sm text-gray-600">
                        {(exp.company === "Manav Rachna International Institute of Research and Studies"
                          ? exp.description
                          : exp.description.slice(0, expandedExperiences.includes(exp.id) ? undefined : 1)
                        ).map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {exp.description.length > 1 && exp.company !== "Manav Rachna International Institute of Research and Studies" && (
                        <button
                          onClick={() => toggleExperienceExpansion(exp.id)}
                          className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center"
                        >
                          {expandedExperiences.includes(exp.id) ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              Show less
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Show more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Awards Tab */}
            {activeTab === 3 && (
              <div className="mt-4 space-y-8">
                {awardsData.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 font-['Raleway']">
                      {category.category}
                    </h3>
                    <div className="columns-1 md:columns-2 gap-3 [column-fill:_balance]">
                      {category.awards.map((award, index) => {
                        const CardInner = (
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              {/* Logo */}
                               <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                 <img src={award.icon} alt={award.title} className="w-full h-full object-contain rounded-lg" />
                              </div>
                              {/* Text */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-base font-medium text-gray-900">{award.title}</h3>
                                </div>
                                {award.subtitle && (
                                  <div className="text-xs text-gray-500">{award.subtitle}</div>
                                )}
                              </div>
                              {/* Metrics */}
                              {((award as Award).highlight || (award as Award).stats) && (
                                <div className="text-right ml-2 shrink-0 w-32 sm:w-40 whitespace-normal break-words leading-tight">
                                  {(award as Award).highlight && (
                                    <div className="text-base font-medium text-gray-900">{(award as Award).highlight}</div>
                                  )}
                                  {(award as Award).stats && (
                                    <div className="text-xs text-gray-500">{(award as Award).stats}</div>
                                  )}
                                </div>
                              )}
                            </div>
                            {award.description && (
                              <p className="mt-2 text-sm text-gray-600">{award.description}</p>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">{award.year}</span>
                              {(award as Award).link && (
                                <a
                                  href={(award as Award).link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-blue-600 bg-blue-50/0 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                                >
                                  <span>View</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        );

                        return (
                          <div
                            key={index}
                            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors break-inside-avoid mb-2 last:mb-0"
                          >
                            {CardInner}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Publications Tab */}
            {activeTab === 4 && (
              <div className="p-4" onClick={handleContainerClick}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {publications.map((pub) => (
                    <div
                      key={pub.id}
                      onClick={(e) => handleItemClick(e, pub.id)}
                      className={`
                      relative group cursor-pointer p-4 rounded-lg
                      ${selectedItem === pub.id ? 'bg-blue-600' : 'hover:bg-gray-50'}
                    `}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 flex items-center justify-center mb-2">
                          <img
                            src={pub.icon}
                            alt=""
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <span className={`
                        text-base font-['Raleway'] font-light w-full text-center break-words
                        ${selectedItem === pub.id ? 'text-white' : 'text-gray-900'}
                      `}>
                          {pub.title}
                        </span>
                        <span className={`
                        text-sm mt-0.5
                        ${selectedItem === pub.id ? 'text-blue-100' : 'text-gray-500'}
                      `}>
                          {pub.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 5 && (
              <div className="mt-4 space-y-6">
                {activitiesData.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-start">
                        {activity.icon && (
                          <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                            <img
                              src={activity.icon}
                              alt={activity.title}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                          <div className="text-sm text-gray-500">{activity.period}</div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Description */}
                      <p className="text-sm text-gray-600">{activity.description}</p>

                      {/* Stats */}
                      {activity.stats && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {activity.stats.map((stat, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
                              <div className="text-base font-medium text-gray-900">{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Highlights */}
                      {activity.highlights && (
                        <ul className="mt-3 space-y-2">
                          {activity.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              <span className="flex-1 min-w-0">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Links */}
                      {(activity as Activity).links && (
                        <div className="mt-3 flex gap-2 justify-end flex-wrap">
                          {(activity as Activity).links!.map((l, idx) => (
                            <a
                              key={idx}
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50/0 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                            >
                              <span>{l.text}</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail View */}
          {selectedItem && activeTab === 0 && (
            <DetailView
              project={projects.find(p => p.id === selectedItem) as ProjectDetails}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {/* Add Publication Detail View */}
          {selectedItem && activeTab === 4 && (
            <PublicationDetailView
              publication={publications.find(p => p.id === selectedItem) as Publication}
              onClose={() => setSelectedItem(null)}
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
          <span><Clock formatString="MMMM d, yyyy h:mm a" /></span>
        </div>
      </div>
      {lockscreenVisible && !windowHeight.isMobile && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <div className="flex flex-col items-center">
            {/* Time */}
            <div className="text-6xl font-light mb-2">
              <Clock formatString="h:mm" />
            </div>
            {/* Date */}
            <div className="text-xl mb-8">
              <Clock formatString="EEEE, MMMM d" />
            </div>

            {/* User profile */}
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden">
              <Image
                src="https://raw.githubusercontent.com/AshutoshSundresh/AshutoshSundresh.github.io/main/pages/ashutosh.jpeg"
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xl mb-3">Ashutosh Sundresh</div>

            <div className="text-sm text-gray-400 mb-4 text-center">
            What is the number of ways you can arrange the letters in the word Ashutosh?
            </div>
            {/* Password field */}
            <div className="w-64 mb-4">
              <input
                type="text"
                className="w-full bg-black/40 border border-gray-600 rounded-md py-2 px-3 text-white text-center"
                placeholder="Enter password"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const answer = parseInt(input.value, 10);
                    if (answer === 10080) { 
                      toggleLockscreen();
                    } else {
                      alert("Incorrect answer. Try again!");
                      input.value = ""; 
                    }
                  }
                }}
                autoFocus
              />
            </div>

            <div className="text-sm text-gray-400">
              Press Enter to unlock
            </div>
          </div>
        </div>
      )}
      {lockscreenVisible && windowHeight.isMobile && (
        <IOSLockscreen onUnlock={toggleLockscreen} />
      )}
      {terminalMode && (
        <div className="terminal-container">
          <style jsx>{`
            .terminal-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.9);
              color: #33ff33;
              font-family: monospace;
              padding: 1rem;
              z-index: 9999;
              display: flex;
              flex-direction: column;
            }
            .terminal-header {
              padding-bottom: 0.5rem;
              margin-bottom: 0.5rem;
              border-bottom: 1px solid #33ff33;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .terminal-hint {
              font-size: 0.8rem;
              opacity: 0.7;
              margin-left: 1rem;
              font-weight: normal;
            }
            .terminal-output {
              overflow-y: auto;
              height: auto;
              max-height: 80vh;
              margin-bottom: 0.5rem;
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE and Edge */
            }
            .terminal-output::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
            .terminal-output-line {
              margin-bottom: 0.25rem;
              line-height: 1.4;
            }
            .terminal-prompt {
              display: flex;
              align-items: center;
            }
            .terminal-prompt-text {
              margin-right: 0.5rem;
            }
            .terminal-input {
              background: transparent;
              border: none;
              color: #33ff33;
              font-family: monospace;
              font-size: 1rem;
              flex-grow: 1;
              outline: none;
            }
            @media (max-width: 768px) {
              .terminal-container {
                padding: 0.5rem;
              }
              .terminal-output {
                height: auto;
                max-height: 70vh;
              }
              .terminal-input {
                font-size: 16px; /* Prevent zoom on mobile */
              }
            }
          `}</style>
          <div className="terminal-header">
            <div>Ashutosh Terminal v1.0.0 {!windowHeight.isMobile && (
              <span className="terminal-hint">(Press ESC to exit)</span>
            )}</div>
          </div>
          <div className="terminal-output" ref={terminalOutputRef}>
            {terminalOutput.map((line, index) => (
              <div key={index} className="terminal-output-line">
                {line}
              </div>
            ))}
          </div>
          <div className="terminal-prompt">
            <span className="terminal-prompt-text">ashutosh@portfolio:~$</span>
            <input
              type="text"
              className="terminal-input"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalInput}
              ref={terminalInputRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MacOSWindow;
