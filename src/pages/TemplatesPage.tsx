import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { createDemoResume } from "@/config/initialResumeData";
import { TEMPLATE_LIST } from "@/config/modules";
import { useResumeStore } from "@/store/useResumeStore";
import { NOT_PORTED_TEMPLATES } from "@/components/templates/registry";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PREVIEW_SCALE = 0.36;

export const TemplatesPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const resumes = useResumeStore((s) => s.resumes);
  const addResume = useResumeStore((s) => s.addResume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const currentResumeId = useResumeStore((s) => s.currentResumeId);

  const sample = useMemo(() => resumes[0] ?? createDemoResume(), [resumes]);
  const targetId = currentResumeId ?? resumes[0]?.id;

  const applyTo = (templateId: string, primary: string) => {
    if (!targetId) {
      const id = addResume(t("resumes.newTitle"), { templateId });
      navigate(`/app/resumes/${id}/edit`);
      return;
    }
    const target = resumes.find((item) => item.id === targetId);
    if (!target) return;
    updateResume(targetId, {
      templateId,
      globalSettings: { ...target.globalSettings, themeColor: primary },
    });
    toast.success(`${t("templates.use")} · ${templateId}`);
    navigate(`/app/resumes/${targetId}/edit`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="container py-6">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-xl font-semibold">{t("templates.title")}</h1>
          <Badge variant="outline">{TEMPLATE_LIST.length} / 9</Badge>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          下面是用真实渲染引擎画出的实时预览（当前数据：
          {resumes[0] ? "你的第一份简历" : "内置示例"}）。未移植：{NOT_PORTED_TEMPLATES.join("、")}。
        </p>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {TEMPLATE_LIST.map((template) => (
            <article key={template.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div
                className="relative overflow-hidden border-b bg-neutral-100"
                style={{ height: 1123 * PREVIEW_SCALE }}
              >
                <div
                  style={{
                    width: 794,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: "top left",
                  }}
                  className="pointer-events-none"
                >
                  <TemplateRenderer
                    resume={{
                      ...sample,
                      templateId: template.id,
                      globalSettings: { ...sample.globalSettings, themeColor: template.colorScheme.primary },
                    }}
                  />
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-medium">{template.name}</h2>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ background: template.colorScheme.primary }}
                  />
                  <Button size="sm" onClick={() => applyTo(template.id, template.colorScheme.primary)}>
                    {t("templates.use")}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
