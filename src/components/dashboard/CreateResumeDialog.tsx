import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import type { ResumeData } from "@/types/resume";
import { createDemoResume } from "@/config/initialResumeData";
import { TEMPLATE_LIST } from "@/config/modules";
import { useResumeStore } from "@/store/useResumeStore";
import { TemplateThumb } from "@/components/templates/TemplateThumb";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const CreateResumeDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const addResume = useResumeStore((s) => s.addResume);
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState(TEMPLATE_LIST[0].id);
  const [withDemo, setWithDemo] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setTemplateId(TEMPLATE_LIST[0].id);
      setWithDemo(false);
    }
  }, [open]);

  const submit = () => {
    const name = title.trim() || t("resumes.newTitle");
    const template = TEMPLATE_LIST.find((item) => item.id === templateId) ?? TEMPLATE_LIST[0];
    let seed: Partial<ResumeData>;
    if (withDemo) {
      const { id: _dropped, ...demo } = createDemoResume();
      seed = { ...demo, title: name, templateId };
    } else {
      seed = { templateId, globalSettings: { themeColor: template.colorScheme.primary } };
    }
    const id = addResume(name, seed);
    onOpenChange(false);
    navigate(`/app/resumes/${id}/edit`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("resumes.newTitle")}</DialogTitle>
          <DialogDescription>选择起始模板与是否填入示例内容，数据只写入 localStorage。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="resume-title">{t("resumes.nameLabel")}</Label>
            <Input
              id="resume-title"
              autoFocus
              value={title}
              placeholder="例如：前端工程师 · 2026 秋招"
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("resumes.templateLabel")}</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TEMPLATE_LIST.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setTemplateId(template.id)}
                  className={cn(
                    "overflow-hidden rounded-lg border text-left transition-all",
                    templateId === template.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "hover:border-ring",
                  )}
                >
                  <div className="h-20 border-b bg-neutral-50">
                    <TemplateThumb templateId={template.id} color={template.colorScheme.primary} />
                  </div>
                  <p className="truncate px-1.5 py-1 text-[11px]">{template.name.split(" · ")[0]}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
            <span>
              <span className="block font-medium">用示例内容填充</span>
              <span className="block text-xs text-muted-foreground">
                带入一份完整的前端工程师示例数据，方便立刻看到效果
              </span>
            </span>
            <Switch checked={withDemo} onCheckedChange={setWithDemo} />
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("action.cancel")}
          </Button>
          <Button onClick={submit}>{t("action.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
