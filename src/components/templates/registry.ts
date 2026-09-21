import type { ComponentType } from "react";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { LeftRightTemplate } from "@/components/templates/LeftRightTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { TimelineTemplate } from "@/components/templates/TimelineTemplate";
import type { TemplateProps } from "@/components/templates/common";

export const TEMPLATE_COMPONENTS: Record<string, ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  "left-right": LeftRightTemplate,
  modern: ModernTemplate,
  timeline: TimelineTemplate,
};

export const getTemplateComponent = (templateId?: string | null) =>
  TEMPLATE_COMPONENTS[templateId ?? "classic"] ?? ClassicTemplate;

/** 上游有 9 套模板，本复刻工程实现其中版式差异最大的 4 套 */
export const NOT_PORTED_TEMPLATES = [
  "creative",
  "editorial",
  "elegant",
  "minimalist",
  "swiss",
] as const;
