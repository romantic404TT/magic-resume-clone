import { Database, FileDown, Layers, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { Card } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const FeaturesSection = () => {
  const { t } = useI18n();

  const items = [
    { icon: Database, title: t("home.feature.dataTitle"), body: t("home.feature.dataDesc") },
    { icon: Layers, title: t("home.feature.templateTitle"), body: t("home.feature.templateDesc") },
    { icon: Sparkles, title: t("home.feature.aiTitle"), body: t("home.feature.aiDesc") },
    { icon: FileDown, title: t("home.feature.exportTitle"), body: t("home.feature.exportDesc") },
  ];

  return (
    <section id="features" className="border-b py-16">
      <div className="container">
        <h2 className="text-2xl font-semibold tracking-tight">{t("home.modulesTitle")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }, index) => (
            <Card
              key={title}
              className={cn("p-5 transition-shadow hover:shadow-md", index % 2 === 1 && "sm:mt-4")}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3.5 text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
