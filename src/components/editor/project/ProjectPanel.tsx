import { Plus } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useDragSort } from "@/hooks/useDragSort";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { ProjectItem } from "@/components/editor/project/ProjectItem";

export const ProjectPanel = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const add = useResumeStore((s) => s.addProject);
  const sort = useResumeStore((s) => s.sortProjects);
  const { getItemProps } = useDragSort(sort);

  if (!resume) return null;

  return (
    <div className="space-y-2">
      {resume.projects.map((item) => (
        <ProjectItem key={item.id} item={item} dragProps={getItemProps(item.id)} />
      ))}
      <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => add()}>
        <Plus className="h-3.5 w-3.5" />
        {t("action.add")}
        {t("module.projects")}
      </Button>
    </div>
  );
};
