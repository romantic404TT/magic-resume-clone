import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/badge";
import { Slider, Switch, Tabs, TabsList, TabsTrigger } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { downloadBlob } from "@/lib/utils";

const STORAGE_KEYS = ["magic-resume-clone-storage", "magic-resume-clone-settings"];

export const SettingsPage = () => {
  const { t } = useI18n();
  const settings = useSettingsStore();
  const resumes = useResumeStore((s) => s.resumes);
  const clearAll = useResumeStore((s) => s.clearAllResumes);
  const restoreDemo = useResumeStore((s) => s.restoreDemo);
  const [confirmClear, setConfirmClear] = useState(false);

  const storage = useMemo(() => {
    const bytes = STORAGE_KEYS.reduce(
      (sum, key) => sum + (localStorage.getItem(key)?.length ?? 0),
      0,
    );
    return { keys: STORAGE_KEYS, kb: (bytes / 1024).toFixed(1) };
  }, [resumes]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="container max-w-3xl space-y-5 py-6">
        <h1 className="text-xl font-semibold">{t("settings.title")}</h1>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-medium">{t("settings.appearance")}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t("settings.theme")}</span>
              <Tabs
                value={settings.theme}
                onValueChange={(value) => settings.setTheme(value as "light" | "dark")}
              >
                <TabsList>
                  <TabsTrigger value="light">{t("settings.theme.light")}</TabsTrigger>
                  <TabsTrigger value="dark">{t("settings.theme.dark")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t("settings.language")}</span>
              <Tabs value={settings.locale} onValueChange={(value) => settings.setLocale(value as "zh" | "en")}>
                <TabsList>
                  <TabsTrigger value="zh">中文</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t("misc.zoom")}</span>
                <span className="tabular-nums">{Math.round(settings.editorZoom * 100)}%</span>
              </div>
              <Slider
                value={[settings.editorZoom]}
                min={0.5}
                max={1.6}
                step={0.05}
                onValueChange={([value]) => settings.setEditorZoom(value)}
              />
            </div>
            <label className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("misc.pageBreakGuides")}</span>
              <Switch
                checked={settings.showPageBreakGuides}
                onCheckedChange={settings.setShowPageBreakGuides}
              />
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-sm font-medium">{t("settings.ai")}</h2>
            <Badge variant="outline">MSW</Badge>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">{t("settings.aiHint")}</p>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">启用 mock 的 AI 接口</span>
            <Switch checked={settings.aiEnabled} onCheckedChange={settings.setAiEnabled} />
          </label>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <code className="rounded bg-muted px-1.5 py-0.5">POST /api/polish</code>
              规则化改写（数据源 src/mocks/data/polishPresets.json）
            </li>
            <li className="flex items-center gap-2">
              <code className="rounded bg-muted px-1.5 py-0.5">POST /api/grammar</code>
              8 条确定性规则（src/mocks/data/grammarRules.json）
            </li>
            <li className="flex items-center gap-2">
              <code className="rounded bg-muted px-1.5 py-0.5">GET /api/proxy/image</code>
              返回占位图，不外链原站
            </li>
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-medium">{t("settings.data")}</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("settings.storage")}：{storage.kb} KB · {resumes.length} 份简历 · keys:{' '}
            {storage.keys.join(", ")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                downloadBlob(
                  new Blob([JSON.stringify(resumes, null, 2)], { type: "application/json" }),
                  "magic-resume-backup.json",
                );
                toast.success("已导出全部简历");
              }}
            >
              导出全部 JSON
            </Button>
            <Button variant="outline" onClick={() => restoreDemo()}>
              {t("action.restoreDemo")}
            </Button>
            <Button variant="destructive" onClick={() => setConfirmClear(true)}>
              {t("action.clearAll")}
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title={t("action.clearAll")}
        description="将删除 localStorage 中所有简历，无法恢复。"
        destructive
        onConfirm={() => {
          clearAll();
          toast.success(t("action.clearAll"));
        }}
      />
    </div>
  );
};
