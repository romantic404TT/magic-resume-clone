import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "zh" | "en";
export type ThemeMode = "light" | "dark";

interface SettingsState {
  locale: Locale;
  theme: ThemeMode;
  editorZoom: number;
  showPageBreakGuides: boolean;
  aiEnabled: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setEditorZoom: (zoom: number) => void;
  setShowPageBreakGuides: (v: boolean) => void;
  setAiEnabled: (v: boolean) => void;
}

const applyTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: "zh",
      theme: "light",
      editorZoom: 1,
      showPageBreakGuides: false,
      aiEnabled: true,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () =>
        set((s) => {
          const next: ThemeMode = s.theme === "dark" ? "light" : "dark";
          applyTheme(next);
          return { theme: next };
        }),
      setEditorZoom: (editorZoom) => set({ editorZoom }),
      setShowPageBreakGuides: (showPageBreakGuides) => set({ showPageBreakGuides }),
      setAiEnabled: (aiEnabled) => set({ aiEnabled }),
    }),
    {
      name: "magic-resume-clone-settings",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);
