import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import type { ResumeData } from "@/types/resume";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const validate = (raw: unknown): ResumeData => {
  if (typeof raw !== "object" || raw === null) throw new Error("不是合法的 JSON 对象");
  const candidate = raw as Partial<ResumeData>;
  if (!candidate.basic || typeof candidate.basic !== "object") {
    throw new Error("缺少 basic 字段");
  }
  if (!Array.isArray(candidate.experience) || !Array.isArray(candidate.education)) {
    throw new Error("缺少 experience / education 数组");
  }
  return candidate as ResumeData;
};

/** 上游支持 PDF 导入（pdfjs + 服务端解析），本复刻只保留 JSON 导入 */
export const ImportResumeDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const importResume = useResumeStore((s) => s.importResume);
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const run = (value: string) => {
    setBusy(true);
    try {
      const id = importResume(validate(JSON.parse(value)));
      toast.success("导入成功");
      onOpenChange(false);
      setText("");
      navigate(`/app/resumes/${id}/edit`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "JSON 解析失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("action.importJson")}</DialogTitle>
          <DialogDescription>
            选择由本工具导出的 .json 文件，或直接粘贴内容。导入会生成一份新简历（新 id），不覆盖原数据。
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const content = String(reader.result ?? "");
              setText(content);
              run(content);
            };
            reader.readAsText(file);
          }}
        />

        <div className="space-y-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => fileRef.current?.click()}>
            <FileUp className="h-4 w-4" />
            选择 .json 文件
          </Button>
          <Textarea
            value={text}
            rows={6}
            placeholder='{"title": "...", "basic": {...}, "experience": [...]}'
            className="font-mono text-xs"
            onChange={(event) => setText(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("action.cancel")}
          </Button>
          <Button disabled={busy || !text.trim()} onClick={() => run(text)} className="gap-1.5">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("action.importJson")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
