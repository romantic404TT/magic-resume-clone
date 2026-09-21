import { useMemo, useState } from "react";
import { FilePlus2, Search, Upload } from "lucide-react";
import { useI18n } from "@/i18n";
import { TEMPLATE_LIST } from "@/config/modules";
import { useResumeStore } from "@/store/useResumeStore";
import { ResumeCardItem } from "@/components/dashboard/ResumeCardItem";
import { CreateResumeDialog } from "@/components/dashboard/CreateResumeDialog";
import { ImportResumeDialog } from "@/components/dashboard/ImportResumeDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ResumeListPage = () => {
  const { t } = useI18n();
  const resumes = useResumeStore((s) => s.resumes);
  const filters = useResumeStore((s) => s.filters);
  const setFilters = useResumeStore((s) => s.setFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const visible = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return resumes
      .filter((resume) => filters.templateId === "all" || resume.templateId === filters.templateId)
      .filter((resume) =>
        keyword
          ? `${resume.title} ${resume.basic.name} ${resume.basic.title}`
              .toLowerCase()
              .includes(keyword)
          : true,
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [resumes, filters]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="container max-w-6xl py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold">{t("resumes.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("resumes.count").replace("{n}", String(resumes.length))}
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.keyword}
                onChange={(event) => setFilters({ keyword: event.target.value })}
                placeholder={t("resumes.search")}
                className="h-9 w-56 pl-8"
              />
            </div>
            <Select
              value={filters.templateId}
              onValueChange={(value) => setFilters({ templateId: value })}
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模板</SelectItem>
                {TEMPLATE_LIST.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name.split(" · ")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1.5" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" />
              {t("action.importJson")}
            </Button>
            <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <FilePlus2 className="h-4 w-4" />
              {t("action.create")}
            </Button>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed py-16 text-center">
            <p className="text-sm text-muted-foreground">{t("resumes.empty")}</p>
            <Button className="mt-3 gap-1.5" onClick={() => setCreateOpen(true)}>
              <FilePlus2 className="h-4 w-4" />
              {t("action.create")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((resume) => (
              <ResumeCardItem key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>

      <CreateResumeDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ImportResumeDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
};
