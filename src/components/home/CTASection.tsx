import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  const { t } = useI18n();
  return (
    <section className="py-16">
      <div className="container">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-sky-400/10 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight">{t("home.heroTitle")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {t("misc.mockBanner")}
          </p>
          <Button asChild size="lg" className="mt-6 gap-1.5">
            <Link to="/app/resumes">
              {t("home.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export const LandingFooter = () => {
  const { t } = useI18n();
  return (
    <footer className="border-t py-8">
      <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p>
          {t("app.name")} · {t("app.tagline")}
        </p>
        <p className="flex items-center gap-3">
          <a
            className="underline-offset-4 hover:underline"
            href="https://github.com/JOYCEQL/magic-resume"
            target="_blank"
            rel="noreferrer noopener"
          >
            技术指导
          </a>
        </p>
      </div>
    </footer>
  );
};
