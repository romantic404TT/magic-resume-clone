import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DragItemProps } from "@/hooks/useDragSort";

export interface ItemShellProps {
  title: string;
  subtitle?: string;
  dragProps: DragItemProps;
  onRemove: () => void;
  visible?: boolean;
  onToggleVisible?: () => void;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const ItemShell = ({
  title,
  subtitle,
  dragProps,
  onRemove,
  visible = true,
  onToggleVisible,
  children,
  defaultOpen = true,
}: ItemShellProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-shadow",
        dragProps["data-dragging"] === true && "drag-ghost",
        dragProps["data-drag-over"] === true && "drag-over",
        !visible && "opacity-60",
      )}
    >
      <div
        {...dragProps}
        className="flex cursor-grab items-center gap-1.5 px-2 py-1.5 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-sm font-medium">{title || "未填写"}</span>
          {subtitle ? (
            <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
          ) : null}
        </button>
        {onToggleVisible && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            title={visible ? "在简历中隐藏" : "在简历中显示"}
            onClick={onToggleVisible}
          >
            {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </Button>
        )}
        <Button size="icon" variant="ghost" className="h-7 w-7" title="删除" onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          title={open ? "收起" : "展开"}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </Button>
      </div>
      {open && <div className="space-y-2.5 border-t px-2.5 py-2.5">{children}</div>}
    </div>
  );
};
