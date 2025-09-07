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


// General purpose types consolidated from components
export interface NowPlayingTrack {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: { size: string; "#text": string }[];
  "@attr"?: { nowplaying: string };
  date?: { uts: string; "#text": string };
  url: string;
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

export interface IOSLockscreenProps {
  onUnlock: () => void;
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
}

export interface WindowInfo {
  vh: number;
  isMobile: boolean;
}

export interface Dimensions {
  width: number;
  height: number;
}


