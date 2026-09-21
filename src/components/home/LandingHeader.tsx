import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { useI18n } from "@/i18n";
import { LanguageSwitch, Logo, ThemeToggle } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export const LandingHeader = () => {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container flex h-14 items-center gap-3">
        <Logo to="/" />
        <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#features">
            {t("home.modulesTitle")}
          </a>
          <a className="transition-colors hover:text-foreground" href="#faq">
            {t("home.faqTitle")}
          </a>
          <Link className="transition-colors hover:text-foreground" to="/app/templates">
            {t("nav.templates")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" asChild title="JOYCEQL/magic-resume">
            <a href="https://github.com/JOYCEQL/magic-resume" target="_blank" rel="noreferrer noopener">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <LanguageSwitch />
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/app/resumes">{t("nav.dashboard")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
