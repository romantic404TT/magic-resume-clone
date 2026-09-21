import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { RichEditor } from "@/components/shared/rich-editor/RichEditor";

export const SkillPanel = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateSkillContent);

  if (!resume) return null;

  return (
    <RichEditor
      html={resume.skillContent}
      fieldLabel={t("module.skills")}
      placeholder="按熟练度分组列出技术栈，例如：React / TypeScript / Vite"
      onChange={update}
    />
  );
};
