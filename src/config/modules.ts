import type { ModuleId, ResumeTemplate, GlobalSettings } from "@/types/resume";

export interface ResumeModuleMeta {
  id: ModuleId;
  titleKey: string;
  icon: string;
}

/** 与上游 src/config/modules.ts 的 STANDARD_MODULES 一一对应 */
export const STANDARD_MODULES: Record<ModuleId, ResumeModuleMeta> = {
  skills: { id: "skills", titleKey: "module.skills", icon: "⚡" },
  experience: {
    id: "experience",
    titleKey: "module.experience",
    icon: "💼",
  },
  projects: { id: "projects", titleKey: "module.projects", icon: "🚀" },
  education: { id: "education", titleKey: "module.education", icon: "🎓" },
  selfEvaluation: {
    id: "selfEvaluation",
    titleKey: "module.selfEvaluation",
    icon: "💬",
  },
  certificates: {
    id: "certificates",
    titleKey: "module.certificates",
    icon: "🏆",
  },
};

export const MODULE_ORDER_DEFAULT: ModuleId[] = [
  "skills",
  "experience",
  "projects",
  "education",
  "selfEvaluation",
  "certificates",
];

export const THEME_COLORS = [
  "#000000",
  "#1A1A1A",
  "#333333",
  "#4D4D4D",
  "#666666",
  "#808080",
  "#999999",
  "#0047AB",
  "#8B0000",
  "#FF4500",
  "#4B0082",
  "#2E8B57",
];

export const FONT_OPTIONS = [
  { label: "MiSans / 系统无衬线", value: '"MiSans", "PingFang SC", "Microsoft YaHei", sans-serif' },
  { label: "宋体衬线", value: '"Songti SC", "SimSun", serif' },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
];

export const DEFAULT_GLOBAL_SETTINGS: Required<GlobalSettings> = {
  themeColor: "#000000",
  fontFamily: FONT_OPTIONS[0].value,
  baseFontSize: 14,
  pagePadding: 40,
  paragraphSpacing: 6,
  lineHeight: 1.6,
  sectionSpacing: 18,
  headerSize: 16,
  subheaderSize: 13,
  useIconMode: true,
  centerSubtitle: false,
  autoOnePage: false,
};

export const TEMPLATE_LIST: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic · 经典单栏",
    description: "自上而下的标准中文简历版式，标题带主题色下划线。",
    layout: "single-column",
    accentBar: false,
    colorScheme: {
      primary: "#000000",
      secondary: "#4D4D4D",
      background: "#ffffff",
      text: "#1A1A1A",
    },
    spacing: { sectionGap: 18, itemGap: 10, contentPadding: 40 },
  },
  {
    id: "left-right",
    name: "Left-Right · 左右分栏",
    description: "左侧个人信息与技能栏，右侧经历正文，适合信息量大的简历。",
    layout: "sidebar-left",
    accentBar: false,
    colorScheme: {
      primary: "#0047AB",
      secondary: "#666666",
      background: "#ffffff",
      text: "#1A1A1A",
    },
    spacing: { sectionGap: 16, itemGap: 8, contentPadding: 0 },
  },
  {
    id: "modern",
    name: "Modern · 现代色块",
    description: "顶部主题色横幅 + 圆角分区标题，视觉更年轻。",
    layout: "two-column",
    accentBar: true,
    colorScheme: {
      primary: "#2E8B57",
      secondary: "#4D4D4D",
      background: "#ffffff",
      text: "#1A1A1A",
    },
    spacing: { sectionGap: 20, itemGap: 12, contentPadding: 44 },
  },
  {
    id: "timeline",
    name: "Timeline · 时间轴",
    description: "经历与教育以竖向时间轴呈现，节点用主题色圆点标记。",
    layout: "timeline",
    accentBar: true,
    colorScheme: {
      primary: "#8B0000",
      secondary: "#666666",
      background: "#ffffff",
      text: "#1A1A1A",
    },
    spacing: { sectionGap: 18, itemGap: 12, contentPadding: 40 },
  },
];
