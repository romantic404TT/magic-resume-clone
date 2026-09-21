import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export const NotFoundPage = () => {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <Logo to="/" />
      <p className="text-6xl font-bold tracking-tight text-muted-foreground">404</p>
      <p className="text-sm text-muted-foreground">{t("misc.notFound")}</p>
      <Button asChild>
        <Link to="/">{t("misc.backHome")}</Link>
      </Button>
    </div>
  );
};
