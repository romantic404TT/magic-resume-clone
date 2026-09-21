import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FileStack, LayoutTemplate, Plus, Settings2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { useResumeStore } from "@/store/useResumeStore";
import { LanguageSwitch, Logo, ThemeToggle } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AppShell = () => {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const addResume = useResumeStore((s) => s.addResume);

  const navItems = [
    { to: "/app/resumes", label: t("nav.resumes"), icon: FileStack },
    { to: "/app/templates", label: t("nav.templates"), icon: LayoutTemplate },
    { to: "/app/settings", label: t("nav.settings"), icon: Settings2 },
  ];

  const isEditor = /^\/app\/resumes\/[^/]+\/edit$/.test(location.pathname);

  const handleCreate = () => {
    const id = addResume(`${t("resumes.newTitle")} ${new Date().toLocaleDateString("zh-CN")}`);
    navigate(`/app/resumes/${id}/edit`);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="no-print flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <Logo to="/app/resumes" />
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleCreate} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("action.create")}
          </Button>
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {!isEditor && (
          <aside className="no-print hidden w-52 shrink-0 border-r p-3 md:block">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <p className="mt-4 rounded-md bg-muted/60 p-2.5 text-xs leading-relaxed text-muted-foreground">
              {t("misc.mockBanner")}
            </p>
          </aside>
        )}
        <main className="min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
