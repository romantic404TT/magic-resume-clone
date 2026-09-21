import { useI18n } from "@/i18n";
import type { Education } from "@/types/resume";
import type { DragItemProps } from "@/hooks/useDragSort";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/editor/Field";
import { ItemShell } from "@/components/editor/ItemShell";

export const EducationItem = ({ item, dragProps }: { item: Education; dragProps: DragItemProps }) => {
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateEducation);
  const remove = useResumeStore((s) => s.removeEducation);

  return (
    <ItemShell
      title={item.school || t("item.school")}
      subtitle={[item.major, item.degree].filter(Boolean).join(" · ")}
      visible={item.visible !== false}
      dragProps={dragProps}
      onToggleVisible={() => update(item.id, { visible: item.visible === false })}
      onRemove={() => remove(item.id)}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label={t("item.school")} value={item.school} onChange={(v) => update(item.id, { school: v })} />
        <Field label={t("item.major")} value={item.major} onChange={(v) => update(item.id, { major: v })} />
        <Field label={t("item.degree")} value={item.degree} onChange={(v) => update(item.id, { degree: v })} />
        <Field label={t("item.gpa")} value={item.gpa ?? ""} onChange={(v) => update(item.id, { gpa: v })} />
        <Field
          label={t("item.startDate")}
          value={item.startDate}
          placeholder="2015.09"
          onChange={(v) => update(item.id, { startDate: v })}
        />
        <Field
          label={t("item.endDate")}
          value={item.endDate}
          placeholder="2019.06"
          onChange={(v) => update(item.id, { endDate: v })}
        />
      </div>
      <Field
        label={t("item.description")}
        type="textarea"
        rows={2}
        value={item.description ?? ""}
        onChange={(v) => update(item.id, { description: v })}
      />
    </ItemShell>
  );
};
