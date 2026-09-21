import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { FONT_OPTIONS, THEME_COLORS } from "@/config/modules";
import { resolveSettings } from "@/lib/utils";
import { Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider, Switch } from "@/components/ui/controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SliderRow = ({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">
        {value}
        {suffix}
      </span>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={([next]) => onChange(next)} />
  </div>
);

export const LayoutSettingsDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateSettings);

  if (!resume) return null;
  const settings = resolveSettings(resume.globalSettings);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editor.layout")}</DialogTitle>
          <DialogDescription>
            这些设置写进 <code className="rounded bg-muted px-1">resume.globalSettings</code>
            ，实时作用于右侧预览与 PDF 导出。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("editor.layout.themeColor")}</Label>
            <div className="flex flex-wrap gap-1.5">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => update({ themeColor: color })}
                  className={cn(
                    "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                    settings.themeColor?.toLowerCase() === color.toLowerCase()
                      ? "border-ring ring-2 ring-ring/40"
                      : "border-black/10",
                  )}
                  style={{ background: color }}
                />
              ))}
              <input
                type="color"
                aria-label="custom color"
                value={settings.themeColor ?? "#000000"}
                onChange={(event) => update({ themeColor: event.target.value })}
                className="h-6 w-9 cursor-pointer rounded border bg-transparent p-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("editor.layout.fontFamily")}</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => update({ fontFamily: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderRow label={t("editor.layout.baseFontSize")} value={settings.baseFontSize!} min={10} max={18} onChange={(v) => update({ baseFontSize: v })} />
          <SliderRow label={t("editor.layout.headerSize")} value={settings.headerSize!} min={12} max={22} onChange={(v) => update({ headerSize: v })} />
          <SliderRow label={t("editor.layout.subheaderSize")} value={settings.subheaderSize!} min={10} max={20} onChange={(v) => update({ subheaderSize: v })} />
          <SliderRow label={t("editor.layout.lineHeight")} value={settings.lineHeight!} min={1.2} max={2.2} step={0.05} suffix="" onChange={(v) => update({ lineHeight: v })} />
          <SliderRow label={t("editor.layout.pagePadding")} value={settings.pagePadding!} min={16} max={72} onChange={(v) => update({ pagePadding: v })} />
          <SliderRow label={t("editor.layout.sectionSpacing")} value={settings.sectionSpacing!} min={6} max={40} onChange={(v) => update({ sectionSpacing: v })} />
          <SliderRow label={t("editor.layout.paragraphSpacing")} value={settings.paragraphSpacing!} min={0} max={20} onChange={(v) => update({ paragraphSpacing: v })} />

          <label className="flex items-center justify-between text-sm">
            <span>{t("editor.centerSubtitle")}</span>
            <Switch checked={!!settings.centerSubtitle} onCheckedChange={(v) => update({ centerSubtitle: v })} />
          </label>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t("action.confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
