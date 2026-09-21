import * as React from "react";
import type { ResumeData } from "@/types/resume";
import { resolveSettings } from "@/lib/utils";
import { buildModuleViews } from "@/components/templates/views";

export interface TemplateProps {
  resume: ResumeData;
  t: (key: string) => string;
}

export const usePageStyle = (resume: ResumeData) => {
  const settings = resolveSettings(resume.globalSettings);
  const style: React.CSSProperties & Record<string, string | number> = {
    padding: settings.pagePadding,
    fontSize: settings.baseFontSize,
    lineHeight: settings.lineHeight,
    fontFamily: settings.fontFamily,
    "--resume-color": settings.themeColor ?? "#000000",
    "--resume-font": settings.fontFamily ?? "sans-serif",
    "--section-gap": `${settings.sectionSpacing}px`,
    "--paragraph-spacing": `${settings.paragraphSpacing}px`,
  };
  return { settings, style };
};

export const useSections = (resume: ResumeData) => buildModuleViews(resume);

export const SectionShell = ({
  id,
  gap,
  children,
}: {
  id: string;
  gap: number;
  children: React.ReactNode;
}) => (
  <section data-module={id} style={{ marginBottom: gap }}>
    {children}
  </section>
);
