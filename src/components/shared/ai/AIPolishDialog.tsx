import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useSettingsStore } from "@/store/useSettingsStore";
import { requestPolishHtml } from "@/mocks/client";
import type { PolishResult } from "@/mocks/logic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

export interface AIPolishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  onApply: (html: string) => void;
  fieldLabel?: string;
}

export const AIPolishDialog = ({
  open,
  onOpenChange,
  html,
  onApply,
  fieldLabel,
}: AIPolishDialogProps) => {
  const { t, locale } = useI18n();
  const aiEnabled = useSettingsStore((s) => s.aiEnabled);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(PolishResult & { html: string }) | null>(null);

  const run = async () => {
    if (!aiEnabled) {
      toast.error("AI 能力已在设置中关闭（mock）");
      return;
    }
    if (!html.trim()) {
      toast.info("内容为空");
      return;
    }
    setLoading(true);
    try {
      const data = await requestPolishHtml(html);
      setResult(data);
      toast.success(`${t("editor.polish.done")} · ${data.model}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "润色失败");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    onOpenChange(false);
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t("editor.aiPolish")}
            {fieldLabel ? <Badge className="ml-1">{fieldLabel}</Badge> : null}
          </DialogTitle>
          <DialogDescription>
            POST /api/polish —— 上游会调用 LLM；本复刻由 MSW 用确定性规则改写，结果可复现。
            块级结构（p / li）保留，块内加粗与链接会被展平。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">原文</p>
            <div
              className="resume-prose max-h-56 overflow-y-auto text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
            />
          </div>
          <div className="rounded-lg border bg-primary/5 p-3">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              润色后 {result ? `(${result.changes.length} 处改动)` : ""}
            </p>
            {result ? (
              <div
                className="resume-prose max-h-56 overflow-y-auto text-sm"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(result.html) }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {locale === "zh" ? "点击下方「开始润色」查看结果。" : "Run polish to preview."}
              </p>
            )}
          </div>
        </div>

        {result?.changes.length ? (
          <ul className="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-muted/60 p-3 text-xs">
            {result.changes.map((change, index) => (
              <li key={`${change.from}-${index}`} className="flex items-center gap-2">
                <code className="rounded bg-background px-1.5 py-0.5 line-through">
                  {change.from}
                </code>
                <span>→</span>
                <code className="rounded bg-background px-1.5 py-0.5">{change.to || "(删除)"}</code>
                <span className="text-muted-foreground">{change.note}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={close}>
            {t("action.cancel")}
          </Button>
          <Button variant="secondary" onClick={run} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? t("editor.polish.running") : t("editor.aiPolish")}
          </Button>
          <Button
            onClick={() => {
              if (!result) return;
              onApply(result.html);
              toast.success(t("editor.polish.done"));
              close();
            }}
            disabled={!result}
          >
            {t("action.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
