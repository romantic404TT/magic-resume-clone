import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { RichEditor } from "@/components/shared/rich-editor/RichEditor";

export const SelfEvaluationPanel = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateSelfEvaluation);

  if (!resume) return null;

  return (
    <RichEditor
      html={resume.selfEvaluationContent}
      fieldLabel={t("module.selfEvaluation")}
      placeholder="3-4 句总结你的核心优势，避免空泛形容词"
      onChange={update}
    />
  );
};
