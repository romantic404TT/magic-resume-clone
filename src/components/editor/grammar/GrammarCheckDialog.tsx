import { useState } from "react";
import { Check, Loader2, SpellCheck } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useSettingsStore } from "@/store/useSettingsStore";
import { requestGrammarCheck, requestPolishHtml } from "@/mocks/client";
import type { GrammarIssue } from "@/mocks/logic";
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
import { htmlToText } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface GrammarCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  onChange: (html: string) => void;
  fieldLabel?: string;
}

const Highlighted = ({ issue }: { issue: GrammarIssue }) => {
  const at = issue.excerpt.indexOf(issue.matched);
  if (at < 0) return <span>{issue.excerpt}</span>;
  return (
    <span>
      {issue.excerpt.slice(0, at)}
      <mark className="rounded bg-amber-200/80 px-0.5 text-inherit">
        {issue.excerpt.slice(at, at + issue.matched.length)}
      </mark>
      {issue.excerpt.slice(at + issue.matched.length)}
    </span>
  );
};

export const GrammarCheckDialog = ({
  open,
  onOpenChange,
  html,
  onChange,
  fieldLabel,
}: GrammarCheckDialogProps) => {
  const { t, locale } = useI18n();
  const aiEnabled = useSettingsStore((s) => s.aiEnabled);
  const [loading, setLoading] = useState(false);
  const [applyingAll, setApplyingAll] = useState(false);
  const [issues, setIssues] = useState<GrammarIssue[] | null>(null);

  const run = async () => {
    if (!aiEnabled) {
      toast.error("AI 能力已在设置中关闭（mock）");
      return;
    }
    setLoading(true);
    try {
      const result = await requestGrammarCheck(htmlToText(html), locale);
      setIssues(result.issues);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "语法检查失败");
    } finally {
      setLoading(false);
    }
  };

  const applyOne = (issue: GrammarIssue) => {
    if (!issue.suggestion) return;
    if (!html.includes(issue.matched)) {
      toast.warning("该处在 HTML 中被标签切断，请手动修改");
      return;
    }
    onChange(html.replace(issue.matched, () => issue.suggestion as string));
    setIssues((list) => list?.filter((item) => item.id !== issue.id) ?? null);
    toast.success("已应用建议");
  };

  const applyAll = async () => {
    setApplyingAll(true);
    try {
      const result = await requestPolishHtml(html);
      onChange(result.html);
      setIssues([]);
      toast.success(`已应用 ${result.changes.length} 项自动修复`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "批量修复失败");
    } finally {
      setApplyingAll(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SpellCheck className="h-4 w-4" />
            {t("editor.grammarCheck")}
            {fieldLabel ? <Badge className="ml-1">{fieldLabel}</Badge> : null}
          </DialogTitle>
          <DialogDescription>
            POST /api/grammar —— 上游把文本交给 LLM；本复刻由 MSW 用{" "}
            <code className="rounded bg-muted px-1">src/mocks/data/grammarRules.json</code>{" "}
            的 8 条规则做确定性检测。
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[120px] space-y-2">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("editor.grammar.checking")}
            </p>
          ) : issues === null ? (
            <p className="text-sm text-muted-foreground">
              {locale === "zh" ? "点击「开始检查」扫描当前内容。" : "Run the check to scan this field."}
            </p>
          ) : issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("editor.grammar.empty")}</p>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  "rounded-lg border p-2.5 text-sm",
                  issue.severity === "error" ? "border-destructive/40" : "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {issue.message}
                      <span className="ml-2 text-xs text-muted-foreground">{issue.ruleId}</span>
                    </p>
                    <p className="mt-1 break-words text-muted-foreground">
                      <Highlighted issue={issue} />
                    </p>
                    {issue.suggestion ? (
                      <p className="mt-1">
                        <span className="text-xs text-muted-foreground">建议：</span>
                        <code className="rounded bg-muted px-1.5 py-0.5">{issue.suggestion}</code>
                      </p>
                    ) : null}
                  </div>
                  {issue.suggestion ? (
                    <Button size="sm" variant="outline" onClick={() => applyOne(issue)}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("action.close")}
          </Button>
          <Button variant="secondary" onClick={run} disabled={loading} className="gap-1.5">
            <SpellCheck className="h-4 w-4" />
            {loading ? t("editor.grammar.checking") : "开始检查"}
          </Button>
          <Button onClick={applyAll} disabled={applyingAll || !issues?.length} className="gap-1.5">
            {applyingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            全部应用{issues?.length ? `（${issues.length}）` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
