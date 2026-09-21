import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BasicInfo } from "@/types/resume";

const OPTIONS: { value: NonNullable<BasicInfo["layout"]>; icon: typeof AlignLeft; label: string }[] = [
  { value: "left", icon: AlignLeft, label: "左对齐" },
  { value: "center", icon: AlignCenter, label: "居中" },
  { value: "right", icon: AlignRight, label: "右对齐" },
];

export const AlignSelector = ({
  value = "left",
  onChange,
}: {
  value?: BasicInfo["layout"];
  onChange: (value: NonNullable<BasicInfo["layout"]>) => void;
}) => (
  <div className="inline-flex rounded-md border p-0.5">
    {OPTIONS.map(({ value: option, icon: Icon, label }) => (
      <button
        key={option}
        type="button"
        title={label}
        onClick={() => onChange(option)}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors",
          value === option && "bg-accent text-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </button>
    ))}
  </div>
);
