import { useResumeStore } from "@/store/useResumeStore";
import type { ResumeData } from "@/types/resume";

export const useCurrentResume = (): ResumeData | null =>
  useResumeStore((state) => state.resumes.find((r) => r.id === state.currentResumeId) ?? null);

export const useCurrentResumeId = () => useResumeStore((state) => state.currentResumeId);
