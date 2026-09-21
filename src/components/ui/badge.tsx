import * as React from "react";
import { cn } from "@/lib/utils";

export const Badge = ({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "outline" | "success" }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium",
      variant === "default" && "bg-secondary text-secondary-foreground",
      variant === "outline" && "border-border bg-transparent text-muted-foreground",
      variant === "success" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100",
      className,
    )}
    {...props}
  />
);

export const Separator = ({
  className,
  vertical,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { vertical?: boolean }) => (
  <div
    role="separator"
    className={cn("bg-border", vertical ? "h-full w-px" : "h-px w-full", className)}
    {...props}
  />
);

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
);
