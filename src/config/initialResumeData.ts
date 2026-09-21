import type { BasicInfo, ResumeData } from "@/types/resume";
import { DEFAULT_PHOTO_CONFIG } from "@/types/resume";
import { buildMenuSections, nowISO, uid } from "@/lib/utils";

export const createEmptyBasic = (): BasicInfo => ({
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  birthDate: "",
  employementStatus: "在职",
  photo: "",
  photoConfig: { ...DEFAULT_PHOTO_CONFIG },
  icons: { website: "", blog: "", linkedin: "", github: "" },
  customFields: [],
  githubKey: "contribution-grid",
  githubUseName: "",
  githubContributionsVisible: false,
  layout: "left",
});

export const createEmptyResume = (title = "未命名简历"): ResumeData => {
  const ts = nowISO();
  return {
    id: uid(),
    title,
    createdAt: ts,
    updatedAt: ts,
    templateId: "classic",
    basic: createEmptyBasic(),
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    customData: {},
    skillContent: "",
    selfEvaluationContent: "",
    activeSection: "basic",
    menuSections: buildMenuSections(),
    globalSettings: {},
  };
};

const li = (...items: string[]) =>
  `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

export const createDemoResume = (): ResumeData => {
  return {
    ...createEmptyResume("示例 · 前端工程师简历"),
    templateId: "classic",
    basic: {
      ...createEmptyBasic(),
      name: "张三",
      title: "高级前端工程师",
      email: "zhangsan@example.com",
      phone: "138-0000-0000",
      location: "上海",
      birthDate: "1995-06",
      employementStatus: "离职-随时到岗",
      photo: "/avatar.svg",
      icons: { website: "zhangsan.dev", blog: "", linkedin: "", github: "zhangsan" },
    },
    experience: [
      {
        id: uid(),
        company: "某科技有限公司",
        position: "高级前端工程师",
        date: "2022.03 - 至今",
        details: li(
          "负责简历编辑器（React 18 + TypeScript + Zustand）的架构设计与迭代，首屏 LCP 从 3.4s 优化至 1.1s。",
          "主导组件库建设，沉淀 60+ 业务组件，页面开发效率提升约 40%。",
          "推动前端可观测性：接入错误上报与性能埋点，线上白屏率下降 72%。",
        ),
        visible: true,
      },
      {
        id: uid(),
        company: "某互联网公司",
        position: "前端工程师",
        date: "2019.07 - 2022.02",
        details: li(
          "参与中台低代码平台开发，实现可视化拖拽搭建与 Schema 版本回滚。",
          "负责移动端 H5 活动页性能治理，长列表虚拟滚动方案落地。",
        ),
        visible: true,
      },
    ],
    projects: [
      {
        id: uid(),
        name: "Magic Resume 复刻工程",
        role: "独立开发者",
        date: "2026.01 - 2026.09",
        description: li(
          "Vite + React 18 + TS + React Router + Tailwind + Zustand 的纯前端简历编辑器。",
          "4 套简历模板共用一套 section 渲染层，导出 PDF 与打印样式对齐 A4。",
        ),
        visible: true,
        link: "https://github.com/JOYCEQL/magic-resume",
        linkLabel: "GitHub",
      },
    ],
    education: [
      {
        id: uid(),
        school: "某大学",
        major: "计算机科学与技术",
        degree: "本科",
        startDate: "2015.09",
        endDate: "2019.06",
        gpa: "3.7 / 4.0",
        description: "主修数据结构、编译原理、人机交互；ACM 校赛二等奖。",
        visible: true,
      },
    ],
    skillContent: `<p>React / TypeScript / Vite / Tailwind CSS / Zustand / Node.js</p><p>熟悉浏览器渲染、性能优化与前端工程化。</p>`,
    selfEvaluationContent: `<p>五年前端经验，擅长把复杂需求拆成可验证的小步迭代；对无障碍与渲染性能有持续投入。</p>`,
    certificates: [
      { id: uid(), url: "/certificate-a.svg", width: 48 },
      { id: uid(), url: "/certificate-b.svg", width: 48 },
    ],
    globalSettings: { themeColor: "#0047AB", baseFontSize: 14, lineHeight: 1.65 },
  };
};
