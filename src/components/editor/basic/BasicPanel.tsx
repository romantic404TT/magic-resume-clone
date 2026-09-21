import { useRef } from "react";
import { ImageUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider, Switch } from "@/components/ui/controls";
import { Field } from "@/components/editor/Field";
import { AlignSelector } from "@/components/editor/basic/AlignSelector";

const ICON_KEYS = ["website", "github", "linkedin", "blog"] as const;

export const BasicPanel = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const update = useResumeStore((s) => s.updateBasicInfo);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!resume) return null;
  const basic = resume.basic;
  const config = basic.photoConfig;

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update({ photo: reader.result });
        toast.success("照片已保存到本地数据");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label={t("editor.field.name")} value={basic.name} onChange={(v) => update({ name: v })} />
        <Field label={t("editor.field.title")} value={basic.title} onChange={(v) => update({ title: v })} />
        <Field label={t("editor.field.email")} type="email" value={basic.email} onChange={(v) => update({ email: v })} />
        <Field label={t("editor.field.phone")} type="tel" value={basic.phone} onChange={(v) => update({ phone: v })} />
        <Field label={t("editor.field.location")} value={basic.location} onChange={(v) => update({ location: v })} />
        <Field label={t("editor.field.birthDate")} value={basic.birthDate} placeholder="1995.06" onChange={(v) => update({ birthDate: v })} />
        <Field label={t("editor.field.status")} value={basic.employementStatus} onChange={(v) => update({ employementStatus: v })} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ICON_KEYS.map((key) => (
          <Field
            key={key}
            label={t(`editor.field.${key}`)}
            value={basic.icons[key] ?? ""}
            onChange={(v) => update({ icons: { ...basic.icons, [key]: v } })}
          />
        ))}
      </div>

      <div className="rounded-lg border p-2.5">
        <div className="mb-2 flex items-center justify-between">
          <Label>{t("editor.field.photo")}</Label>
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-1.5">
              <Switch
                checked={config.visible !== false}
                onCheckedChange={(checked) => update({ photoConfig: { ...config, visible: checked } })}
              />
              显示
            </Label>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()}>
              <ImageUp className="h-3.5 w-3.5" />
              {t("action.upload")}
            </Button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onFile(event.target.files?.[0])}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">宽 {config.width}px</span>
            <Slider
              value={[config.width]}
              min={60}
              max={160}
              onValueChange={([value]) => update({ photoConfig: { ...config, width: value } })}
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">圆角</span>
            <Select
              value={config.borderRadius}
              onValueChange={(value) =>
                update({ photoConfig: { ...config, borderRadius: value as typeof config.borderRadius } })
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">直角</SelectItem>
                <SelectItem value="medium">圆角</SelectItem>
                <SelectItem value="full">圆形</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">比例</span>
            <Select
              value={config.aspectRatio}
              onValueChange={(value) =>
                update({ photoConfig: { ...config, aspectRatio: value as typeof config.aspectRatio } })
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="16:9">16:9</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            {basic.photo ? (
              <>
                <img src={basic.photo} alt="" className="h-12 w-12 rounded object-cover" />
                <Button size="sm" variant="ghost" onClick={() => update({ photo: "" })}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">{t("editor.photoHint")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label>{t("editor.align")}</Label>
        <AlignSelector value={basic.layout} onChange={(layout) => update({ layout })} />
      </div>

      <div className="space-y-2 rounded-lg border p-2.5">
        <div className="flex items-center justify-between">
          <Label>自定义信息栏</Label>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() =>
              update({
                customFields: [
                  ...basic.customFields,
                  { id: uid(), label: "新字段", value: "", visible: true, displayLabel: true },
                ],
              })
            }
          >
            <Plus className="h-3.5 w-3.5" />
            添加
          </Button>
        </div>
        {basic.customFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              className="h-8 w-28"
              value={field.label}
              onChange={(event) =>
                update({
                  customFields: basic.customFields.map((item, position) =>
                    position === index ? { ...item, label: event.target.value } : item,
                  ),
                })
              }
            />
            <Input
              className="h-8 flex-1"
              value={field.value}
              placeholder="值"
              onChange={(event) =>
                update({
                  customFields: basic.customFields.map((item, position) =>
                    position === index ? { ...item, value: event.target.value } : item,
                  ),
                })
              }
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => update({ customFields: basic.customFields.filter((_, position) => position !== index) })}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
