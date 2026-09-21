import type { ModuleId, ResumeData } from "@/types/resume";
import { STANDARD_MODULES } from "@/config/modules";
import { htmlToText } from "@/lib/utils";

export interface EntryView {
  id: string;
  heading: string;
  subheading?: string;
  date?: string;
  meta?: string[];
  html?: string;
}

export interface ModuleView {
  id: ModuleId | string;
  title: string;
  icon: string;
  kind: "entries" | "richtext" | "certificates";
  entries: EntryView[];
  html?: string;
  certificates?: { id: string; url: string; width: number }[];
}

/**
 * 简历数据 → 视图模型：4 套模板共用这一层，
 * 模板之间只差排版，不再各自解析一遍 ResumeData。
 */
export const buildModuleViews = (resume: ResumeData): ModuleView[] => {
  const views: ModuleView[] = [];

  for (const section of [...resume.menuSections].sort((a, b) => a.order - b.order)) {
    if (!section.enabled) continue;
    const id = section.id as ModuleId;

    if (id === "skills") {
      if (resume.skillContent.trim())
        views.push({
          id,
          title: STANDARD_MODULES[id]?.titleKey ?? section.title,
          icon: section.icon,
          kind: "richtext",
          entries: [],
          html: resume.skillContent,
        });
      continue;
    }

    if (id === "selfEvaluation") {
      if (resume.selfEvaluationContent.trim())
        views.push({
          id,
          title: STANDARD_MODULES[id]?.titleKey ?? section.title,
          icon: section.icon,
          kind: "richtext",
          entries: [],
          html: resume.selfEvaluationContent,
        });
      continue;
    }

    if (id === "certificates") {
      if (resume.certificates.length)
        views.push({
          id,
          title: STANDARD_MODULES[id]?.titleKey ?? section.title,
          icon: section.icon,
          kind: "certificates",
          entries: [],
          certificates: resume.certificates,
        });
      continue;
    }

    if (id === "experience") {
      const entries = resume.experience.filter((item) => item.visible !== false).map<EntryView>((item) => ({
        id: item.id,
        heading: item.company,
        subheading: item.position,
        date: item.date,
        html: item.details,
      }));
      if (entries.length)
        views.push({
          id,
          title: STANDARD_MODULES[id].titleKey,
          icon: section.icon,
          kind: "entries",
          entries,
        });
      continue;
    }

    if (id === "projects") {
      const entries = resume.projects.filter((item) => item.visible !== false).map<EntryView>((item) => ({
        id: item.id,
        heading: item.name,
        subheading: item.role,
        date: item.date,
        meta: item.link ? [item.linkLabel || item.link] : [],
        html: item.description,
      }));
      if (entries.length)
        views.push({
          id,
          title: STANDARD_MODULES[id].titleKey,
          icon: section.icon,
          kind: "entries",
          entries,
        });
      continue;
    }

    if (id === "education") {
      const entries = resume.education.filter((item) => item.visible !== false).map<EntryView>((item) => ({
        id: item.id,
        heading: item.school,
        subheading: [item.major, item.degree].filter(Boolean).join(" · "),
        date: [item.startDate, item.endDate].filter(Boolean).join(" - "),
        meta: item.gpa ? [`GPA ${item.gpa}`] : [],
        html: item.description ? `<p>${item.description}</p>` : undefined,
      }));
      if (entries.length)
        views.push({
          id,
          title: STANDARD_MODULES[id].titleKey,
          icon: section.icon,
          kind: "entries",
          entries,
        });
      continue;
    }

    const custom = resume.customData[section.id] ?? [];
    const entries = custom.filter((item) => item.visible !== false).map<EntryView>((item) => ({
      id: item.id,
      heading: item.title,
      subheading: item.subtitle,
      date: item.dateRange,
      html: item.description,
    }));
    if (entries.length)
      views.push({
        id: section.id,
        title: section.title || section.id,
        icon: section.icon,
        kind: "entries",
        entries,
      });
  }

  return views;
};

export const resumeWordCount = (resume: ResumeData) => {
  const modules = buildModuleViews(resume).reduce(
    (sum, view) =>
      sum +
      htmlToText(view.html ?? "").length +
      view.entries.reduce((s, e) => s + htmlToText(e.html ?? "").length + e.heading.length, 0),
    0,
  );
  return modules + resume.basic.name.length;
};
