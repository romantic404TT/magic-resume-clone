import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useCurrentResume } from "@/hooks/useCurrentResume";
import { useResumeStore } from "@/store/useResumeStore";
import { imageProxyUrl } from "@/mocks/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/controls";

/**
 * 证书图片：本地文件走 FileReader 转 base64（与上游一致，数据只落 localStorage）；
 * 远程链接则经 mock 的 /api/proxy/image 代理返回占位图。
 */
export const CertificatesPanel = () => {
  const resume = useCurrentResume();
  const { t } = useI18n();
  const add = useResumeStore((s) => s.addCertificate);
  const update = useResumeStore((s) => s.updateCertificate);
  const remove = useResumeStore((s) => s.removeCertificate);
  const fileRef = useRef<HTMLInputElement>(null);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [busy, setBusy] = useState(false);

  if (!resume) return null;

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    [...files].slice(0, 6).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} 不是图片`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          if (reader.result.length > 1_500_000) {
            toast.warning(`${file.name} 超过 1MB，localStorage 可能放不下`);
          }
          add({ url: reader.result, width: 40 });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addRemote = async () => {
    if (!/^https?:\/\//i.test(remoteUrl.trim())) {
      toast.error("请输入完整 https 链接");
      return;
    }
    setBusy(true);
    const proxy = imageProxyUrl(remoteUrl.trim());
    try {
      const response = await fetch(proxy);
      if (!response.ok) throw new Error("代理返回失败");
      add({ url: proxy, width: 40 });
      setRemoteUrl("");
      toast.success("已通过 mock 代理添加");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "添加失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => onFiles(event.target.files)}
      />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => fileRef.current?.click()}>
          <ImagePlus className="h-4 w-4" />
          {t("action.upload")}
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={remoteUrl}
          placeholder="https://example.com/certificate.png"
          onChange={(event) => setRemoteUrl(event.target.value)}
        />
        <Button size="sm" variant="secondary" className="gap-1.5" onClick={addRemote} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
          代理引入
        </Button>
      </div>

      {resume.certificates.length === 0 ? (
        <p className="text-xs text-muted-foreground">还没有证书图片。</p>
      ) : (
        resume.certificates.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-lg border p-2">
            <img src={item.url} alt="certificate" className="h-12 w-12 rounded object-contain" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>宽度 {item.width}%</span>
                <button className="text-destructive" onClick={() => remove(item.id)}>
                  {t("action.remove")}
                </button>
              </div>
              <Slider
                value={[item.width]}
                min={10}
                max={100}
                step={2}
                onValueChange={([value]) => update(item.id, { width: value })}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};
