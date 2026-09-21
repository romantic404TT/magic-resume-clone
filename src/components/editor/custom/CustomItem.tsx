import { useI18n } from "@/i18n";
import type { CustomItem as CustomItemData } from "@/types/resume";
import type { DragItemProps } from "@/hooks/useDragSort";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/editor/Field";
import { ItemShell } from "@/components/editor/ItemShell";
import { RichEditor } from "@/components/shared/rich-editor/RichEditor";

export const CustomItem = ({
  sectionId,
  item,
  dragProps = {},
}: {
  sectionId: string;
  item: CustomItemData;
  dragProps?: DragItemProps;
}) => {
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateCustomItem);
  const remove = useResumeStore((s) => s.removeCustomItem);

  return (
    <ItemShell
      title={item.title || t("misc.customSection")}
      subtitle={item.subtitle}
      visible={item.visible !== false}
      dragProps={dragProps}
      onToggleVisible={() => update(sectionId, item.id, { visible: !item.visible })}
      onRemove={() => remove(sectionId, item.id)}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label="标题" value={item.title} onChange={(v) => update(sectionId, item.id, { title: v })} />
        <Field label="副标题" value={item.subtitle} onChange={(v) => update(sectionId, item.id, { subtitle: v })} />
      </div>
      <Field
        label={t("item.date")}
        value={item.dateRange}
        placeholder="2023 - 2024"
        onChange={(v) => update(sectionId, item.id, { dateRange: v })}
      />
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">{t("item.description")}</span>
        <RichEditor
          html={item.description}
          fieldLabel={t("misc.customSection")}
          onChange={(html) => update(sectionId, item.id, { description: html })}
        />
      </div>
    </ItemShell>
  );
};
