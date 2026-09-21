import type { ComponentType } from "react";
import { useI18n } from "@/i18n";
import type { ModuleId } from "@/types/resume";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { STANDARD_MODULES } from "@/config/modules";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BasicPanel } from "@/components/editor/basic/BasicPanel";
import { ExperiencePanel } from "@/components/editor/experience/ExperiencePanel";
import { EducationPanel } from "@/components/editor/education/EducationPanel";
import { ProjectPanel } from "@/components/editor/project/ProjectPanel";
import { SkillPanel } from "@/components/editor/skills/SkillPanel";
import { SelfEvaluationPanel } from "@/components/editor/self-evaluation/SelfEvaluationPanel";
import { CertificatesPanel } from "@/components/editor/certificates/CertificatesPanel";
import { CustomPanel } from "@/components/editor/custom/CustomPanel";
import { ModuleSortList } from "@/components/editor/ModuleSortList";

const PANELS: Record<ModuleId, ComponentType> = {
  skills: SkillPanel,
  experience: ExperiencePanel,
  projects: ProjectPanel,
  education: EducationPanel,
  selfEvaluation: SelfEvaluationPanel,
  certificates: CertificatesPanel,
};

export const EditPanel = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const setActiveSection = useResumeStore((s) => s.setActiveSection);

  if (!resume) return null;

  const sections = [...resume.menuSections]
    .sort((a, b) => a.order - b.order)
    .filter((section) => section.enabled);

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <Accordion
          type="single"
          collapsible
          value={resume.activeSection}
          onValueChange={(value) => value && setActiveSection(value)}
        >
          <AccordionItem value="basic">
            <AccordionTrigger icon={<span>👤</span>}>{t("editor.basic")}</AccordionTrigger>
            <AccordionContent>
              <BasicPanel />
            </AccordionContent>
          </AccordionItem>

          {sections.map((section) => {
            const isCustom = section.id.startsWith("custom-");
            const Panel = PANELS[section.id as ModuleId];
            const label = isCustom
              ? section.title
              : t(STANDARD_MODULES[section.id as ModuleId]?.titleKey ?? section.title);
            return (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger icon={<span>{section.icon}</span>}>{label}</AccordionTrigger>
                <AccordionContent>
                  {isCustom ? <CustomPanel sectionId={section.id} /> : Panel ? <Panel /> : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}

          <AccordionItem value="modules">
            <AccordionTrigger icon={<span>⚙️</span>}>{t("editor.modules")}</AccordionTrigger>
            <AccordionContent>
              <ModuleSortList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
