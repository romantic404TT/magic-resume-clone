import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { createDemoResume } from "@/config/initialResumeData";
import { useResumeStore } from "@/store/useResumeStore";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SCALE = 0.52;

export const HeroSection = () => {
  const { t } = useI18n();
  const first = useResumeStore((s) => s.resumes[0]);
  const preview = useMemo(() => first ?? createDemoResume(), [first]);
  const target = first ? `/app/resumes/${first.id}/edit` : "/app/resumes";

  return (
    <section className="relative overflow-hidden border-b">
      <div className="container grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:py-20">
        <div className="animate-fade-up">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Sparkles className="h-3 w-3" />
            React 18 · Vite · Tailwind · Zustand · MSW
          </Badge>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-1.5">
              <Link to="/app/resumes">
                {t("home.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={target}>{t("home.ctaSecondary")}</Link>
            </Button>
          </div>
          <p className="mt-5 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {t("misc.mockBanner")}
          </p>
        </div>

        <div className="relative">
          <div
            className="relative overflow-hidden rounded-xl border bg-neutral-100 shadow-2xl"
            style={{ height: 1123 * SCALE, width: "100%", maxWidth: 794 * SCALE }}
          >
            <div
              className="pointer-events-none absolute left-0 top-0"
              style={{ width: 794, transform: `scale(${SCALE})`, transformOrigin: "top left" }}
            >
              <TemplateRenderer resume={preview} />
            </div>
          </div>
          <div className="absolute -bottom-3 -left-3 -z-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute -right-3 -top-3 -z-10 h-24 w-24 rounded-full bg-sky-400/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
};
