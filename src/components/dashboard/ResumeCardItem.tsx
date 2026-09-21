import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import type { ResumeData } from "@/types/resume";
import { TEMPLATE_LIST } from "@/config/modules";
import { useResumeStore } from "@/store/useResumeStore";
import { resumeWordCount } from "@/components/templates/views";
import { TemplateThumb } from "@/components/templates/TemplateThumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadBlob, formatUpdatedAt, htmlToText } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export const ResumeCardItem = ({ resume }: { resume: ResumeData }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const duplicate = useResumeStore((s) => s.duplicateResume);
  const remove = useResumeStore((s) => s.deleteResume);
  const update = useResumeStore((s) => s.updateResume);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);

  const template = TEMPLATE_LIST.find((item) => item.id === resume.templateId) ?? TEMPLATE_LIST[0];
  const summary = htmlToText(resume.selfEvaluationContent || resume.skillContent).slice(0, 46);

  return (
    <>
      <article className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
        <button
          type="button"
          className="relative block h-28 w-full overflow-hidden border-b bg-neutral-100"
          onClick={() => navigate(`/app/resumes/${resume.id}/edit`)}
        >
          <div className="pointer-events-none h-full w-full">
            <TemplateThumb
              templateId={template.id}
              color={resume.globalSettings.themeColor ?? template.colorScheme.primary}
            />
          </div>
        </button>

        <div className="flex items-start gap-2 p-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{resume.title}</h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {resume.basic.name || "—"}
              {resume.basic.title ? ` · ${resume.basic.title}` : ""}
            </p>
            {summary ? (
              <p className="mt-1 truncate text-xs text-muted-foreground/80">{summary}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{template.name.split(" · ")[0]}</Badge>
              <Badge variant="outline">{t("misc.words").replace("{n}", String(resumeWordCount(resume)))}</Badge>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {t("resumes.updatedAt")} {formatUpdatedAt(resume.updatedAt)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/app/resumes/${resume.id}/edit`)}>
                <Pencil className="h-4 w-4" />
                {t("action.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                <Pencil className="h-4 w-4" />
                {t("action.rename")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const id = duplicate(resume.id);
                  if (id) toast.success(t("action.duplicate"));
                }}
              >
                <Copy className="h-4 w-4" />
                {t("action.duplicate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  downloadBlob(
                    new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" }),
                    `${resume.title}.json`,
                  )
                }
              >
                {t("action.exportJson")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
                {t("action.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("action.delete")}
        description={t("resumes.deleteConfirm").replace("{name}", resume.title)}
        destructive
        onConfirm={() => {
          remove(resume.id);
          toast.success(t("action.delete"));
        }}
      />

      <ConfirmDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title={t("action.rename")}
        defaultValue={resume.title}
        onConfirm={(value) => {
          if (value.trim()) update(resume.id, { title: value.trim() });
        }}
      />
    </>
  );
};
