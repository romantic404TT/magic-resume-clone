import type { ChangeEvent, ReactNode } from "react";
import { useId } from "react";
import { Textarea, Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "email" | "tel";
  placeholder?: string;
  rows?: number;
  className?: string;
  action?: ReactNode;
}

export const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  rows = 3,
  className,
  action,
}: FieldProps) => {
  const id = useId();
  const common = {
    id,
    value,
    placeholder,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>
      {type === "textarea" ? (
        <Textarea {...common} rows={rows} />
      ) : (
        <Input {...common} type={type === "email" ? "email" : type === "tel" ? "tel" : "text"} />
      )}
    </div>
  );
};
