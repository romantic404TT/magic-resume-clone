import { useI18n } from "@/i18n";
import type { Project } from "@/types/resume";
import type { DragItemProps } from "@/hooks/useDragSort";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/editor/Field";
import { ItemShell } from "@/components/editor/ItemShell";
import { RichEditor } from "@/components/shared/rich-editor/RichEditor";

export const ProjectItem = ({ item, dragProps }: { item: Project; dragProps: DragItemProps }) => {
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateProject);
  const remove = useResumeStore((s) => s.removeProject);

  return (
    <ItemShell
      title={item.name || t("item.projectName")}
      subtitle={item.role}
      visible={item.visible !== false}
      dragProps={dragProps}
      onToggleVisible={() => update(item.id, { visible: !item.visible })}
      onRemove={() => remove(item.id)}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label={t("item.projectName")} value={item.name} onChange={(v) => update(item.id, { name: v })} />
        <Field label={t("item.role")} value={item.role} onChange={(v) => update(item.id, { role: v })} />
        <Field label={t("item.date")} value={item.date} placeholder="2024.01 - 2024.06" onChange={(v) => update(item.id, { date: v })} />
        <Field label={t("item.link")} value={item.link ?? ""} placeholder="https://…" onChange={(v) => update(item.id, { link: v })} />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">{t("item.description")}</span>
        <RichEditor
          html={item.description}
          fieldLabel={t("module.projects")}
          placeholder="项目背景、你的职责与量化结果"
          onChange={(html) => update(item.id, { description: html })}
        />
      </div>
    </ItemShell>
  );
};
