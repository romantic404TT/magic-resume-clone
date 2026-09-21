import { useI18n } from "@/i18n";
import type { ResumeData } from "@/types/resume";
import { getTemplateComponent } from "@/components/templates/registry";
import { cn } from "@/lib/utils";

export const TemplateRenderer = ({
  resume,
  className,
  printId,
}: {
  resume: ResumeData;
  className?: string;
  printId?: boolean;
}) => {
  const { t } = useI18n();
  const Component = getTemplateComponent(resume.templateId);
  return (
    <div id={printId ? "resume-print-area" : undefined} className={cn(className)}>
      <Component resume={resume} t={t} />
    </div>
  );
};
