import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Logo = ({ className, to = "/app/resumes" }: { className?: string; to?: string }) => {
  const { t } = useI18n();
  return (
    <Link to={to} className={cn("flex items-center gap-2", className)}>
      <img src="/logo.svg" alt="" className="h-7 w-7" />
      <span className="text-base font-semibold tracking-tight">{t("app.name")}</span>
    </Link>
  );
};

export const ThemeToggle = () => {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="toggle theme"
      onClick={toggleTheme}
      className="text-foreground"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

export const LanguageSwitch = () => {
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-16 text-xs"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
    >
      {locale === "zh" ? "中文" : "EN"}
    </Button>
  );
};
