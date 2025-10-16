// ============================================================================
// Types and Interfaces for the Application
// Centralized, descriptive, and clearly demarcated by concern
// ============================================================================

// ============================================================================
// Domain Models (Core app data used across features)
// ============================================================================
export interface ProjectInput {
  id: number;
  name: string;
  image: string;
  caption: string;
  description: string;
  created: string; // ISO date string in JSON
  kind?: string;
  size?: string;
  link?: string;
  stats?: Array<{ label: string; value: string | number }>;
}

export interface Project {
  id: number;
  name: string;
  image: string;
  caption: string;
  description: string;
  created: Date;
  kind?: string;
  size?: string;
  link?: string;
  stats?: Array<{ label: string; value: string | number }>;
}

export interface Publication {
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
  extraDetails?: Array<{ label: string; value: string }>;
}

export interface Award {
  title: string;
  subtitle?: string;
  year: string;
  icon: string;
  description?: string;
  highlight?: string;
  stats?: string;
  link?: string;
  extraDetails?: string;
}

export interface AwardCategory {
  id: number;
  category: string;
  awards: Award[];
}

export interface EducationGrade {
  grade: string;
  score: string;
}

export interface EducationDetails {
  coursework?: string[];
  grades?: EducationGrade[];
  achievements?: string[];
  subjects?: string[];
}

export interface EducationEntry {
  id: number;
  institution: string;
  degree?: string;
  school?: string;
  period: string;
  icon: string;
  institutionLink?: string;
  courseLink?: string;
  archiveLink?: string;
  gpa?: string;
  location?: string;
  curriculum?: string;
  details: EducationDetails;
}

export interface ExperienceEntry {
  id: number;
  company: string;
  position: string;
  location: string;
  period: string;
  icon: string;
  companyLink: string;
  description: string[];
}

export interface ActivityLink {
  text: string;
  url: string;
}

export interface ActivityStat {
  value: string;
  label: string;
}

export interface Activity {
  id: number;
  title: string;
  period: string;
  description: string;
  highlights?: string[];
  link?: ActivityLink;
  links?: ActivityLink[];
  stats?: ActivityStat[];
  icon?: string;
}

export interface SkeumorphicDataRoot {
  folderIconUrl: string;
  projects: ProjectInput[];
  educationData: EducationEntry[];
  experienceData: ExperienceEntry[];
  awardsData: AwardCategory[];
  publications: Publication[];
  activitiesData: Activity[];
}

// ============================================================================
// External API Models (Data formats from 3rd-party services)
// ============================================================================
export interface NowPlayingTrack {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: { size: string; "#text": string }[];
  "@attr"?: { nowplaying: string };
  date?: { uts: string; "#text": string };
  url: string;
}

export interface LastFmResponse {
  recenttracks: { track: NowPlayingTrack[] };
}

export interface ContributionsCanvasData {
  years: Array<{
    year: string;
    total: number;
    range: { start: string; end: string };
    contributions: Array<{ date: string; count: number; color: string }>;
  }>;
  contributions: Array<{ date: string; count: number; color: string; intensity: number }>;
  total: number;
}

// GitHub contributions (internal shaping before canvas)
export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface Contribution {
  date: string;
  count: number;
  color: string;
  intensity: number;
}

export interface YearData {
  year: string;
  total: number;
  range: { start: string; end: string };
  contributions: Contribution[];
}

export type ContributionsData = ContributionsCanvasData;

// ============================================================================
// App State & Hooks Types (State shapes and reusable hook contracts)
// ============================================================================
export interface WindowInfo {
  vh: number;
  isMobile: boolean;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface AppOverlayState {
  isTerminalActive: boolean;
  isLockscreenActive: boolean;
  isSearchActive?: boolean;
  setTerminalActive: (active: boolean) => void;
  setLockscreenActive: (active: boolean) => void;
  setSearchActive?: (active: boolean) => void;
}

// ============================================================================
// UI / Component Props (Props contracts used by components)
// ============================================================================
export interface IOSLockscreenProps {
  onUnlock: () => void;
}

export interface NowPlayingProps {
  onStatusChange?: (status: 'playing' | 'recent' | null) => void;
  onTrackChange?: (track: { name: string; artist: string } | null) => void;
}

export interface DragPosition { x: number; y: number }

export interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  position: DragPosition;
  isDraggingDisabled?: boolean;
}

export interface TerminalOverlayProps {
  isMobile: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  outputLines: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  outputRef?: React.RefObject<HTMLDivElement | null>;
}

export interface WindowHeaderProps {
  onToggleLockscreen: () => void;
  onOpenTerminal: () => void;
}

export interface ToolbarProps {
  onBack: () => void;
  onForward: () => void;
  canBack: boolean;
  canForward: boolean;
  showArchive: boolean;
  onOpenSearch?: () => void;
}

export interface Tab { id: number; title: string }

export interface TabsBarProps {
  tabs: Tab[];
  activeTab: number;
  isMobile: boolean;
  showMobileMenu: boolean;
  onToggleMobileMenu: () => void;
  onSelect: (id: number) => void;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
}

export interface PublicationsGridProps {
  publications: Publication[];
  selectedId: number | null;
  onItemClick: (e: React.MouseEvent, id: number) => void;
}

export interface ActivitiesListProps { activities: Activity[] }

export interface ProjectsGridProps {
  projects: Project[];
  selectedItem: number | null;
  onItemClick: (e: React.MouseEvent, id: number) => void;
  folderIconUrl: string;
}

export interface PublicationDetailViewProps {
  publication: Publication;
  onClose: () => void;
  isMobile: boolean;
}

export interface ProjectDetailViewProps {
  project: Project;
  onClose: () => void;
  isMobile: boolean;
}

export interface AwardsMasonryProps { awardsData: AwardCategory[] }

export interface EducationListProps { educationData: EducationEntry[] }

export interface ExperienceListProps { experienceData: ExperienceEntry[] }

export interface ContributionsGraphProps {
  data: ContributionsCanvasData;
  username: string;
}

// ============================================================================
// Internal / Misc Models (Local-only helpers)
// ============================================================================
export interface Cell { x: number; y: number }

// ============================================================================
// Search Types (client-side search overlay)
// ============================================================================
export interface SearchRecord {
  id: string;
  path: string;
  title: string;
  text: string;
  textLower: string;
  titleLower: string;
  acronymMappings: Map<string, string[]>;
}

