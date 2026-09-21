import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Braces,
  Download,
  FileText,
  Layers,
  Loader2,
  Printer,
  Redo2,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { exportElementToPdf } from "@/lib/exportPdf";
import { downloadBlob, formatUpdatedAt } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateSheet } from "@/components/shared/TemplateSheet";
import { LayoutSettingsDialog } from "@/components/shared/LayoutSettingsDialog";
import { resumeWordCount } from "@/components/templates/views";

export const EditorHeader = () => {
  const { t, locale } = useI18n();
  const resume = useCurrentResume();
  const updateResume = useResumeStore((s) => s.updateResume);
  const canUndo = useResumeStore((s) => s.past.some((item) => item.id === resume?.id));
  const canRedo = useResumeStore((s) => s.future.some((item) => item.id === resume?.id));
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);

  const [templateOpen, setTemplateOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".tiptap")) return; // 富文本内部自己的 undo
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      if (key !== "z" || !resume) return;
      event.preventDefault();
      if (event.shiftKey) redo(resume.id);
      else undo(resume.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resume?.id, undo, redo, locale]);

  if (!resume) return null;

  const exportPdf = async () => {
    const node = document.getElementById("resume-print-area");
    if (!node) {
      toast.error("找不到预览节点");
      return;
    }
    setExporting(true);
    try {
      const info = await exportElementToPdf(node, resume.title);
      toast.success(`PDF 已生成（${info.pages} 页）`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF 导出失败");
    } finally {
      setExporting(false);
    }
  };

  const exportJson = () => {
    downloadBlob(
      new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" }),
      `${resume.title}.json`,
    );
    toast.success(t("action.exportJson"));
  };

  return (
    <header className="no-print flex h-14 shrink-0 items-center gap-2 border-b px-3">
      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
        <Link to="/app/resumes" title={t("nav.resumes")}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <Input
        value={resume.title}
        onChange={(event) => updateResume(resume.id, { title: event.target.value })}
        className="h-8 w-56 border-transparent bg-transparent font-medium hover:border-input focus-visible:border-input"
      />
      <Badge className="hidden lg:inline-flex" title={t("resumes.updatedAt")}>
        {t("editor.saveState.saved")} · {formatUpdatedAt(resume.updatedAt)}
      </Badge>
      <Badge variant="outline" className="hidden xl:inline-flex">
        {t("misc.words").replace("{n}", String(resumeWordCount(resume)))}
      </Badge>

      <div className="ml-auto flex items-center gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8" title={t("action.undo")} disabled={!canUndo} onClick={() => undo(resume.id)}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" title={t("action.redo")} disabled={!canRedo} onClick={() => redo(resume.id)}>
          <Redo2 className="h-4 w-4" />
        </Button>
        <span className="mx-1 h-5 w-px bg-border" />
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setTemplateOpen(true)}>
          <Layers className="h-4 w-4" />
          {t("editor.layout.template")}
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setLayoutOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          {t("editor.layout")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5" disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t("action.export")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportPdf}>
              <FileText className="h-4 w-4" />
              {t("action.exportPdf")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              打印
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportJson}>
              <Braces className="h-4 w-4" />
              {t("action.exportJson")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TemplateSheet open={templateOpen} onOpenChange={setTemplateOpen} />
      <LayoutSettingsDialog open={layoutOpen} onOpenChange={setLayoutOpen} />
    </header>
  );
};
