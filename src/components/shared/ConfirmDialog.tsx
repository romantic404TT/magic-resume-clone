import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  defaultValue?: string;
  destructive?: boolean;
  onConfirm: (value: string) => void;
}

/** 兼顾「危险操作确认」与「单字段输入」两种轻量弹窗 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  defaultValue,
  destructive,
  onConfirm,
}: ConfirmDialogProps) => {
  const { t } = useI18n();
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (open) setValue(defaultValue ?? "");
  }, [open, defaultValue]);

  const isInput = defaultValue !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {isInput ? (
          <Input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && value.trim()) {
                onConfirm(value);
                onOpenChange(false);
              }
            }}
          />
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("action.cancel")}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={isInput && !value.trim()}
            onClick={() => {
              onConfirm(value);
              onOpenChange(false);
            }}
          >
            {t("action.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
