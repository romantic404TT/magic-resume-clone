import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BasicInfo,
  Certificate,
  CustomItem,
  Education,
  Experience,
  GlobalSettings,
  Project,
  ResumeData,
} from "@/types/resume";
import { createDemoResume, createEmptyResume } from "@/config/initialResumeData";
import { buildMenuSections, nowISO, uid } from "@/lib/utils";

interface ResumeFilters {
  keyword: string;
  templateId: string | "all";
}

interface ResumeState {
  resumes: ResumeData[];
  currentResumeId: string | null;
  filters: ResumeFilters;
  /** 撤销/重做栈（不写入 localStorage） */
  past: ResumeData[];
  future: ResumeData[];
  lastCommitAt: number;

  addResume: (title?: string, seed?: Partial<ResumeData>) => string;
  importResume: (data: ResumeData) => string;
  duplicateResume: (id: string) => string | null;
  updateResume: (id: string, data: Partial<ResumeData>) => void;
  deleteResume: (id: string) => void;
  setCurrentResume: (id: string | null) => void;
  setFilters: (filters: Partial<ResumeFilters>) => void;
  clearAllResumes: () => void;
  restoreDemo: () => void;

  undo: (id: string) => void;
  redo: (id: string) => void;

  setActiveSection: (section: string) => void;
  updateBasicInfo: (patch: Partial<BasicInfo>) => void;
  setTemplate: (templateId: string) => void;
  updateSettings: (patch: Partial<GlobalSettings>) => void;
  reorderMenuSections: (ids: string[]) => void;
  toggleModule: (id: string) => void;

  addExperience: (item?: Partial<Experience>) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  sortExperience: (sourceId: string, targetId: string) => void;

  addEducation: (item?: Partial<Education>) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  sortEducation: (sourceId: string, targetId: string) => void;

  addProject: (item?: Partial<Project>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  sortProjects: (sourceId: string, targetId: string) => void;

  updateSkillContent: (html: string) => void;
  updateSelfEvaluation: (html: string) => void;

  addCertificate: (item: Omit<Certificate, "id">) => void;
  updateCertificate: (id: string, patch: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;

  addCustomModule: (title: string) => string;
  renameCustomModule: (sectionId: string, title: string) => void;
  removeCustomModule: (sectionId: string) => void;
  addCustomItem: (sectionId: string, item?: Partial<CustomItem>) => void;
  updateCustomItem: (
    sectionId: string,
    id: string,
    patch: Partial<CustomItem>,
  ) => void;
  removeCustomItem: (sectionId: string, id: string) => void;
}

const moveTo = <T extends { id: string }>(list: T[], sourceId: string, targetId: string) => {
  const from = list.findIndex((i) => i.id === sourceId);
  const to = list.findIndex((i) => i.id === targetId);
  if (from < 0 || to < 0 || from === to) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => {
      /** 所有会改动的写入都走这里：自动补 updatedAt + 记录撤销快照 */
      const commit = (id: string, mutator: (resume: ResumeData) => ResumeData) => {
        const { resumes, past, lastCommitAt } = get();
        const index = resumes.findIndex((r) => r.id === id);
        if (index < 0) return;
        const previous = resumes[index];
        const nextResume = { ...mutator(previous), updatedAt: nowISO() };
        const coalesce =
          Date.now() - lastCommitAt < 700 && past[past.length - 1]?.id === id;
        set({
          resumes: resumes.map((r, i) => (i === index ? nextResume : r)),
          past: coalesce ? past : [...past.slice(-49), previous],
          future: [],
          lastCommitAt: Date.now(),
        });
      };

      const commitCurrent = (mutator: (resume: ResumeData) => ResumeData) => {
        const id = get().currentResumeId;
        if (id) commit(id, mutator);
      };

      const demo = createDemoResume();

      return {
        resumes: [demo],
        currentResumeId: demo.id,
        filters: { keyword: "", templateId: "all" },
        past: [],
        future: [],
        lastCommitAt: 0,

        addResume: (title, seed) => {
          const resume = { ...createEmptyResume(title ?? "未命名简历"), ...seed };
          set((s) => ({
            resumes: [resume, ...s.resumes],
            currentResumeId: resume.id,
            past: [],
            future: [],
          }));
          return resume.id;
        },

        importResume: (data) => {
          const ts = nowISO();
          const resume: ResumeData = {
            ...createEmptyResume(data.title || "导入的简历"),
            ...data,
            id: uid(),
            createdAt: data.createdAt ?? ts,
            updatedAt: ts,
            menuSections: data.menuSections?.length
              ? data.menuSections
              : buildMenuSections(),
          };
          set((s) => ({
            resumes: [resume, ...s.resumes],
            currentResumeId: resume.id,
          }));
          return resume.id;
        },

        duplicateResume: (id) => {
          const source = get().resumes.find((r) => r.id === id);
          if (!source) return null;
          const ts = nowISO();
          const copy: ResumeData = {
            ...structuredClone(source),
            id: uid(),
            title: `${source.title} (副本)`,
            createdAt: ts,
            updatedAt: ts,
          };
          set((s) => ({ resumes: [copy, ...s.resumes], currentResumeId: copy.id }));
          return copy.id;
        },

        updateResume: (id, data) => commit(id, (r) => ({ ...r, ...data })),

        deleteResume: (id) =>
          set((s) => {
            const resumes = s.resumes.filter((r) => r.id !== id);
            return {
              resumes,
              currentResumeId:
                s.currentResumeId === id ? resumes[0]?.id ?? null : s.currentResumeId,
            };
          }),

        setCurrentResume: (id) => set({ currentResumeId: id, past: [], future: [] }),
        setFilters: (filters) =>
          set((s) => ({ filters: { ...s.filters, ...filters } })),

        clearAllResumes: () =>
          set({ resumes: [], currentResumeId: null, past: [], future: [] }),

        restoreDemo: () => {
          const fresh = createDemoResume();
          set((s) => ({
            resumes: [fresh, ...s.resumes],
            currentResumeId: fresh.id,
          }));
        },

        undo: (id) => {
          const { resumes, past, future } = get();
          const index = resumes.findIndex((r) => r.id === id);
          const previous = [...past].reverse().find((p) => p.id === id);
          if (index < 0 || !previous) return;
          set({
            resumes: resumes.map((r, i) => (i === index ? previous : r)),
            past: past.filter((p) => p !== previous),
            future: [resumes[index], ...future.filter((f) => f.id !== id)].slice(0, 50),
            lastCommitAt: 0,
          });
        },

        redo: (id) => {
          const { resumes, past, future } = get();
          const index = resumes.findIndex((r) => r.id === id);
          const target = future.find((f) => f.id === id);
          if (index < 0 || !target) return;
          set({
            resumes: resumes.map((r, i) => (i === index ? target : r)),
            future: future.filter((f) => f !== target),
            past: [...past.slice(-49), resumes[index]],
            lastCommitAt: 0,
          });
        },

        setActiveSection: (section) =>
          commitCurrent((r) => ({ ...r, activeSection: section })),

        updateBasicInfo: (patch) =>
          commitCurrent((r) => ({ ...r, basic: { ...r.basic, ...patch } })),

        setTemplate: (templateId) =>
          commitCurrent((r) => ({ ...r, templateId })),

        updateSettings: (patch) =>
          commitCurrent((r) => ({
            ...r,
            globalSettings: { ...r.globalSettings, ...patch },
          })),

        reorderMenuSections: (ids) =>
          commitCurrent((r) => ({
            ...r,
            menuSections: ids
              .map((id) => r.menuSections.find((m) => m.id === id))
              .filter((m): m is ResumeData["menuSections"][number] => Boolean(m))
              .map((m, i) => ({ ...m, order: i })),
          })),

        toggleModule: (id) =>
          commitCurrent((r) => ({
            ...r,
            menuSections: r.menuSections.map((m) =>
              m.id === id ? { ...m, enabled: !m.enabled } : m,
            ),
          })),

        addExperience: (item) =>
          commitCurrent((r) => ({
            ...r,
            experience: [
              ...r.experience,
              {
                id: uid(),
                company: "",
                position: "",
                date: "",
                details: "",
                visible: true,
                ...item,
              },
            ],
          })),
        updateExperience: (id, patch) =>
          commitCurrent((r) => ({
            ...r,
            experience: r.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          })),
        removeExperience: (id) =>
          commitCurrent((r) => ({
            ...r,
            experience: r.experience.filter((e) => e.id !== id),
          })),
        sortExperience: (sourceId, targetId) =>
          commitCurrent((r) => ({
            ...r,
            experience: moveTo(r.experience, sourceId, targetId),
          })),

        addEducation: (item) =>
          commitCurrent((r) => ({
            ...r,
            education: [
              ...r.education,
              {
                id: uid(),
                school: "",
                major: "",
                degree: "本科",
                startDate: "",
                endDate: "",
                gpa: "",
                description: "",
                visible: true,
                ...item,
              },
            ],
          })),
        updateEducation: (id, patch) =>
          commitCurrent((r) => ({
            ...r,
            education: r.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          })),
        removeEducation: (id) =>
          commitCurrent((r) => ({
            ...r,
            education: r.education.filter((e) => e.id !== id),
          })),
        sortEducation: (sourceId, targetId) =>
          commitCurrent((r) => ({
            ...r,
            education: moveTo(r.education, sourceId, targetId),
          })),

        addProject: (item) =>
          commitCurrent((r) => ({
            ...r,
            projects: [
              ...r.projects,
              {
                id: uid(),
                name: "",
                role: "",
                date: "",
                description: "",
                visible: true,
                link: "",
                linkLabel: "",
                ...item,
              },
            ],
          })),
        updateProject: (id, patch) =>
          commitCurrent((r) => ({
            ...r,
            projects: r.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          })),
        removeProject: (id) =>
          commitCurrent((r) => ({
            ...r,
            projects: r.projects.filter((p) => p.id !== id),
          })),
        sortProjects: (sourceId, targetId) =>
          commitCurrent((r) => ({
            ...r,
            projects: moveTo(r.projects, sourceId, targetId),
          })),

        updateSkillContent: (html) =>
          commitCurrent((r) => ({ ...r, skillContent: html })),
        updateSelfEvaluation: (html) =>
          commitCurrent((r) => ({ ...r, selfEvaluationContent: html })),

        addCertificate: (item) =>
          commitCurrent((r) => ({
            ...r,
            certificates: [...r.certificates, { id: uid(), ...item }],
          })),
        updateCertificate: (id, patch) =>
          commitCurrent((r) => ({
            ...r,
            certificates: r.certificates.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          })),
        removeCertificate: (id) =>
          commitCurrent((r) => ({
            ...r,
            certificates: r.certificates.filter((c) => c.id !== id),
          })),

        addCustomModule: (title) => {
          const sectionId = `custom-${uid().slice(0, 8)}`;
          commitCurrent((r) => ({
            ...r,
            menuSections: [
              ...r.menuSections,
              {
                id: sectionId,
                title: title.trim() || "自定义模块",
                icon: "📄",
                enabled: true,
                order: r.menuSections.length,
              },
            ],
            customData: { ...r.customData, [sectionId]: [] },
            activeSection: sectionId,
          }));
          return sectionId;
        },
        renameCustomModule: (sectionId, title) =>
          commitCurrent((r) => ({
            ...r,
            menuSections: r.menuSections.map((m) =>
              m.id === sectionId ? { ...m, title } : m,
            ),
          })),
        removeCustomModule: (sectionId) =>
          commitCurrent((r) => {
            const { [sectionId]: _removed, ...customData } = r.customData;
            return {
              ...r,
              customData,
              menuSections: r.menuSections.filter((m) => m.id !== sectionId),
            };
          }),

        addCustomItem: (sectionId, item) =>
          commitCurrent((r) => ({
            ...r,
            customData: {
              ...r.customData,
              [sectionId]: [
                ...(r.customData[sectionId] ?? []),
                {
                  id: uid(),
                  title: "",
                  subtitle: "",
                  dateRange: "",
                  description: "",
                  visible: true,
                  ...item,
                },
              ],
            },
          })),
        updateCustomItem: (sectionId, id, patch) =>
          commitCurrent((r) => ({
            ...r,
            customData: {
              ...r.customData,
              [sectionId]: (r.customData[sectionId] ?? []).map((c) =>
                c.id === id ? { ...c, ...patch } : c,
              ),
            },
          })),
        removeCustomItem: (sectionId, id) =>
          commitCurrent((r) => ({
            ...r,
            customData: {
              ...r.customData,
              [sectionId]: (r.customData[sectionId] ?? []).filter((c) => c.id !== id),
            },
          })),
      };
    },
    {
      name: "magic-resume-clone-storage",
      version: 1,
      partialize: (state) => ({
        resumes: state.resumes,
        currentResumeId: state.currentResumeId,
      }),
    },
  ),
);

export const selectResume = (id: string | null | undefined) => (s: ResumeState) =>
  id ? s.resumes.find((r) => r.id === id) ?? null : null;
