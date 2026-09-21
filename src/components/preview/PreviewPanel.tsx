import { useLayoutEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, Ruler } from "lucide-react";
import { useI18n } from "@/i18n";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_HEIGHT = 1123;

export const PreviewPanel = ({ className }: { className?: string }) => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const zoom = useSettingsStore((s) => s.editorZoom);
  const setZoom = useSettingsStore((s) => s.setEditorZoom);
  const guides = useSettingsStore((s) => s.showPageBreakGuides);
  const setGuides = useSettingsStore((s) => s.setShowPageBreakGuides);
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [contentHeight, setContentHeight] = useState(PAGE_HEIGHT);

  useLayoutEffect(() => {
    const node = pageRef.current;
    if (!node) return;
    const measure = () => {
      const height = node.scrollHeight;
      setContentHeight(height);
      setPageCount(Math.max(1, Math.ceil(height / PAGE_HEIGHT)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [resume?.id, resume?.templateId]);

  if (!resume) return null;

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="no-print flex h-11 shrink-0 items-center gap-2 border-b px-3 text-sm">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          title={t("misc.zoom")}
          onClick={() => setZoom(Math.max(0.5, Number((zoom - 0.1).toFixed(2))))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center tabular-nums text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          title={t("misc.zoom")}
          onClick={() => setZoom(Math.min(1.6, Number((zoom + 0.1).toFixed(2))))}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1 text-xs"
          onClick={() => setZoom(1)}
          title={t("misc.zoom")}
        >
          <Maximize2 className="h-3.5 w-3.5" />100%
        </Button>
        <span className="mx-1 h-4 w-px bg-border" />
        <Button
          size="sm"
          variant={guides ? "secondary" : "ghost"}
          className="h-7 gap-1 text-xs"
          onClick={() => setGuides(!guides)}
        >
          <Ruler className="h-3.5 w-3.5" />
          {t("misc.pageBreakGuides")}
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">≈ {pageCount} 页 A4</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-muted/50 p-6">
        <div
          style={{ width: 794 * zoom, height: contentHeight * zoom, margin: "0 auto" }}
          className="relative transition-[width,height] duration-150"
        >
          <div
            ref={pageRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
            className="relative w-[794px] shadow-xl"
          >
            <TemplateRenderer resume={resume} printId className="bg-white" />
            {guides &&
              Array.from({ length: pageCount - 1 }).map((_, index) => (
                <div
                  key={index}
                  className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-sky-400/70"
                  style={{ top: (index + 1) * PAGE_HEIGHT }}
                >
                  <span className="absolute -top-5 right-0 rounded bg-sky-500 px-1.5 py-0.5 text-[11px] text-white">
                    第 {index + 2} 页
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
