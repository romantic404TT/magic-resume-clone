import { useI18n } from "@/i18n";
import type { Experience } from "@/types/resume";
import { useResumeStore } from "@/store/useResumeStore";
import type { DragItemProps } from "@/hooks/useDragSort";
import { Field } from "@/components/editor/Field";
import { ItemShell } from "@/components/editor/ItemShell";
import { RichEditor } from "@/components/shared/rich-editor/RichEditor";

export const ExperienceItem = ({ item, dragProps }: { item: Experience; dragProps: DragItemProps }) => {
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateExperience);
  const remove = useResumeStore((s) => s.removeExperience);

  return (
    <ItemShell
      title={item.company || t("item.company")}
      subtitle={item.position}
      visible={item.visible !== false}
      dragProps={dragProps}
      onToggleVisible={() => update(item.id, { visible: item.visible === false })}
      onRemove={() => remove(item.id)}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label={t("item.company")} value={item.company} onChange={(v) => update(item.id, { company: v })} />
        <Field label={t("item.position")} value={item.position} onChange={(v) => update(item.id, { position: v })} />
      </div>
      <Field
        label={t("item.date")}
        value={item.date}
        placeholder="2022.03 - 至今"
        onChange={(v) => update(item.id, { date: v })}
      />
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">{t("item.details")}</span>
        <RichEditor
          html={item.details}
          fieldLabel={t("module.experience")}
          placeholder="用一句话说明做了什么、怎么做的、结果如何"
          onChange={(html) => update(item.id, { details: html })}
        />
      </div>
    </ItemShell>
  );
};
