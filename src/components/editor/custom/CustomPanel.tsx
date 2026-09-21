import { Plus } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { CustomItem } from "@/components/editor/custom/CustomItem";

export const CustomPanel = ({ sectionId }: { sectionId: string }) => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const add = useResumeStore((s) => s.addCustomItem);

  if (!resume) return null;
  const items = resume.customData[sectionId] ?? [];

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <CustomItem key={item.id} sectionId={sectionId} item={item} />
      ))}
      <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => add(sectionId)}>
        <Plus className="h-3.5 w-3.5" />
        {t("action.add")}
        {t("misc.customSection")}
      </Button>
    </div>
  );
};
