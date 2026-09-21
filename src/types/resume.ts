export interface PhotoConfig {
  width: number;
  height: number;
  aspectRatio: "1:1" | "4:3" | "3:4" | "16:9";
  borderRadius: "none" | "medium" | "full";
  visible?: boolean;
}

export const DEFAULT_PHOTO_CONFIG: PhotoConfig = {
  width: 90,
  height: 120,
  aspectRatio: "3:4",
  borderRadius: "none",
  visible: true,
};

export const getRatioMultiplier = (ratio: PhotoConfig["aspectRatio"]) => {
  switch (ratio) {
    case "4:3":
      return 3 / 4;
    case "3:4":
      return 4 / 3;
    case "16:9":
      return 9 / 16;
    default:
      return 1;
  }
};

export const getBorderRadiusValue = (config?: PhotoConfig) => {
  if (!config) return "0";
  switch (config.borderRadius) {
    case "medium":
      return "0.5rem";
    case "full":
      return "9999px";
    default:
      return "0";
  }
};

export interface CustomFieldType {
  id: string;
  label: string;
  value: string;
  icon?: string;
  visible?: boolean;
  custom?: boolean;
  displayLabel?: boolean;
}

export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  employementStatus: string;
  photo: string;
  photoConfig: PhotoConfig;
  icons: Record<string, string>;
  customFields: CustomFieldType[];
  githubKey: string;
  githubUseName: string;
  githubContributionsVisible: boolean;
  layout?: "left" | "center" | "right";
}

export interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
  visible?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  date: string;
  details: string;
  visible?: boolean;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  date: string;
  description: string;
  visible: boolean;
  link?: string;
  linkLabel?: string;
}

export interface Certificate {
  id: string;
  url: string;
  width: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description: string;
  visible: boolean;
}

export type ModuleId =
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "selfEvaluation"
  | "certificates";

export interface MenuSection {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface GlobalSettings {
  themeColor?: string;
  fontFamily?: string;
  baseFontSize?: number;
  pagePadding?: number;
  paragraphSpacing?: number;
  lineHeight?: number;
  sectionSpacing?: number;
  headerSize?: number;
  subheaderSize?: number;
  useIconMode?: boolean;
  centerSubtitle?: boolean;
  autoOnePage?: boolean;
}

export interface ResumeData {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  templateId: string | null | undefined;
  basic: BasicInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  customData: Record<string, CustomItem[]>;
  skillContent: string;
  selfEvaluationContent: string;
  activeSection: string;
  menuSections: MenuSection[];
  globalSettings: GlobalSettings;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  layout: "single-column" | "two-column" | "sidebar-left" | "timeline";
  accentBar: boolean;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    contentPadding: number;
  };
}
