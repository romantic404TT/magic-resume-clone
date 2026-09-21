import { Check } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { TEMPLATE_LIST } from "@/config/modules";
import { NOT_PORTED_TEMPLATES } from "@/components/templates/registry";
import { TemplateThumb } from "@/components/templates/TemplateThumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const TemplateSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("editor.layout.template")}</DialogTitle>
          <DialogDescription>
            上游提供 9 套模板，本复刻实现版式差异最大的 4 套；未移植：
            {NOT_PORTED_TEMPLATES.join("、")}。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          {TEMPLATE_LIST.map((template) => {
            const active = resume?.templateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setTemplate(template.id);
                  onOpenChange(false);
                }}
                className={cn(
                  "group overflow-hidden rounded-xl border text-left transition-shadow hover:shadow-md",
                  active && "border-primary ring-2 ring-primary/30",
                )}
              >
                <div className="relative h-40 w-full border-b bg-neutral-100">
                  <TemplateThumb templateId={template.id} color={template.colorScheme.primary} />
                  {active && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{template.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("action.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
