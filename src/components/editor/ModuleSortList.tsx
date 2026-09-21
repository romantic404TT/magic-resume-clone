import { useState } from "react";
import { GripVertical, Plus } from "lucide-react";
import { useI18n } from "@/i18n";
import type { ModuleId } from "@/types/resume";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useDragSort } from "@/hooks/useDragSort";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/controls";
import { cn } from "@/lib/utils";
import { STANDARD_MODULES } from "@/config/modules";

/** 模块顺序 / 显隐：拖拽用原生 HTML5 DnD，上游同样没有引入拖拽库 */
export const ModuleSortList = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const reorder = useResumeStore((s) => s.reorderMenuSections);
  const toggle = useResumeStore((s) => s.toggleModule);
  const addModule = useResumeStore((s) => s.addCustomModule);
  const removeModule = useResumeStore((s) => s.removeCustomModule);
  const [draft, setDraft] = useState("");

  const sections = resume
    ? [...resume.menuSections].sort((a, b) => a.order - b.order)
    : [];

  const { getItemProps } = useDragSort((sourceId, targetId) => {
    const ids = sections.map((s) => s.id);
    const from = ids.indexOf(sourceId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    reorder(ids);
  });

  if (!resume) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{t("editor.modulesHint")}</p>
      {sections.map((section) => {
        const isCustom = section.id.startsWith("custom-");
        const dragProps = getItemProps(section.id);
        const label = isCustom
          ? section.title
          : t(STANDARD_MODULES[section.id as ModuleId]?.titleKey ?? section.title);
        return (
          <div
            key={section.id}
            {...dragProps}
            className={cn(
              "flex cursor-grab items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm active:cursor-grabbing",
              dragProps["data-dragging"] && "drag-ghost",
              dragProps["data-drag-over"] && "drag-over",
            )}
          >
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="w-5 text-center">{section.icon}</span>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {isCustom && (
              <button
                className="text-xs text-destructive"
                onClick={() => removeModule(section.id)}
                title={t("action.delete")}
              >
                {t("action.delete")}
              </button>
            )}
            <Switch checked={section.enabled} onCheckedChange={() => toggle(section.id)} />
          </div>
        );
      })}

      <div className="flex gap-2 pt-1">
        <Input
          value={draft}
          placeholder={t("misc.addCustomSection")}
          className="h-8 flex-1 text-sm"
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={() => {
            if (!draft.trim()) return;
            addModule(draft.trim());
            setDraft("");
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("action.add")}
        </Button>
      </div>
    </div>
  );
};
