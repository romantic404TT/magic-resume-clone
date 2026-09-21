import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GlobalSettings, MenuSection, ModuleId } from "@/types/resume";
import { DEFAULT_GLOBAL_SETTINGS, MODULE_ORDER_DEFAULT, STANDARD_MODULES } from "@/config/modules";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const nowISO = () => new Date().toISOString();

export const formatUpdatedAt = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const buildMenuSections = (
  order: ModuleId[] = MODULE_ORDER_DEFAULT,
  disabled: ModuleId[] = [],
): MenuSection[] =>
  order.map((id, index) => ({
    id,
    title: STANDARD_MODULES[id].icon,
    icon: STANDARD_MODULES[id].icon,
    enabled: !disabled.includes(id),
    order: index,
  }));

export const resolveSettings = (settings?: GlobalSettings): Required<GlobalSettings> => ({
  ...DEFAULT_GLOBAL_SETTINGS,
  ...settings,
});

/** 把 HTML 字符串压成纯文本，用于列表页摘要与字数统计 */
export const htmlToText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{2,}/g, "\n")
    .trim();

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
