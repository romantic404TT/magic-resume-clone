import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useResumeStore } from "@/store/useResumeStore";
import { EditPanel } from "@/components/editor/EditPanel";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { Button } from "@/components/ui/button";

export const EditorPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { t } = useI18n();
  const currentResumeId = useResumeStore((s) => s.currentResumeId);
  const setCurrentResume = useResumeStore((s) => s.setCurrentResume);
  const exists = useResumeStore((s) => s.resumes.some((r) => r.id === resumeId));

  useEffect(() => {
    if (resumeId && resumeId !== currentResumeId) setCurrentResume(resumeId);
  }, [resumeId, currentResumeId, setCurrentResume]);

  if (!resumeId || !exists) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium">{t("misc.notFound")}</p>
        <p className="text-sm text-muted-foreground">这份简历可能已被删除。</p>
        <Button asChild variant="outline">
          <Link to="/app/resumes">{t("nav.resumes")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <EditorHeader />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="min-h-[45vh] w-full shrink-0 border-b md:min-h-0 md:w-[360px] md:border-b-0 md:border-r xl:w-[400px]">
          <EditPanel />
        </div>
        <PreviewPanel className="min-w-0 flex-1" />
      </div>
    </div>
  );
};
