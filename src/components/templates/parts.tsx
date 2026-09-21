import * as React from "react";
import type { BasicInfo } from "@/types/resume";
import type { EntryView } from "@/components/templates/views";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { getBorderRadiusValue, getRatioMultiplier } from "@/types/resume";
import { cn } from "@/lib/utils";

export const RichText = ({
  html,
  className,
  style,
}: {
  html?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  if (!html || !html.trim()) return null;
  return (
    <div
      className={cn("resume-prose", className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
};

export type SectionTitleVariant = "underline" | "block" | "plain" | "side-rule";

export const SectionTitle = ({
  title,
  variant = "underline",
  size,
  color,
}: {
  title: string;
  variant?: SectionTitleVariant;
  size: number;
  color: string;
}) => {
  if (variant === "block")
    return (
      <h2
        className="mb-2 inline-block rounded px-2 py-0.5 font-semibold text-white"
        style={{ background: color, fontSize: size }}
      >
        {title}
      </h2>
    );

  if (variant === "side-rule")
    return (
      <h2
        className="mb-2 flex items-center gap-2 font-semibold"
        style={{ fontSize: size, color }}
      >
        <span className="inline-block h-4 w-1 rounded-sm" style={{ background: color }} />
        {title}
      </h2>
    );

  if (variant === "plain")
    return (
      <h2
        className="mb-1.5 font-semibold uppercase tracking-[0.14em]"
        style={{ fontSize: size, color }}
      >
        {title}
      </h2>
    );

  return (
    <h2
      className="mb-2 border-b pb-1 font-semibold"
      style={{ fontSize: size, color, borderColor: color }}
    >
      {title}
    </h2>
  );
};

export const EntryRow = ({
  entry,
  centerSubtitle,
  gap,
  bodySize,
  subSize,
  accent,
  timeline,
}: {
  entry: EntryView;
  centerSubtitle?: boolean;
  gap: number;
  bodySize: number;
  subSize: number;
  accent: string;
  timeline?: boolean;
}) => (
  <div
    className={cn("relative", timeline && "pl-5")}
    style={{ marginBottom: gap }}
  >
    {timeline && (
      <>
        <span
          className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
          style={{ background: accent }}
        />
        <span className="absolute left-[3px] top-4 h-[calc(100%-4px)] w-px bg-neutral-200" />
      </>
    )}
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-semibold text-neutral-900" style={{ fontSize: bodySize + 1 }}>
        {entry.heading}
      </span>
      {entry.date && (
        <span className="shrink-0 tabular-nums text-neutral-500" style={{ fontSize: subSize }}>
          {entry.date}
        </span>
      )}
    </div>
    {(entry.subheading || entry.meta?.length) && (
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-2 text-neutral-600",
          centerSubtitle ? "justify-center" : "justify-between",
        )}
        style={{ fontSize: subSize }}
      >
        <span className="font-medium" style={{ color: accent }}>
          {entry.subheading}
        </span>
        {entry.meta?.length ? <span className="text-neutral-500">{entry.meta.join(" · ")}</span> : null}
      </div>
    )}
    <RichText html={entry.html} style={{ fontSize: bodySize }} className="mt-0.5 text-neutral-700" />
  </div>
);

const ContactLine = ({
  items,
  size,
  justify = "justify-start",
}: {
  items: (string | false | undefined)[];
  size: number;
  justify?: string;
}) => {
  const list = items.filter((v): v is string => Boolean(v));
  if (!list.length) return null;
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-600", justify)}
      style={{ fontSize: size }}
    >
      {list.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
};

export const PhotoBox = ({
  basic,
  size = 1,
}: {
  basic: BasicInfo;
  size?: number;
}) => {
  const config = basic.photoConfig;
  if (!config?.visible || !basic.photo) return null;
  const ratio = getRatioMultiplier(config.aspectRatio);
  return (
    <img
      src={basic.photo}
      alt={basic.name}
      className="shrink-0 object-cover"
      style={{
        width: config.width * size,
        height: config.height * ratio * size,
        borderRadius: getBorderRadiusValue(config),
      }}
    />
  );
};

export type BaseInfoVariant = "left" | "centered" | "sidebar";

export const BaseInfoBlock = ({
  basic,
  variant,
  accent,
  onBanner,
}: {
  basic: BasicInfo;
  variant: BaseInfoVariant;
  accent: string;
  onBanner?: boolean;
}) => {
  const align = basic.layout ?? "left";
  const nameSize = variant === "sidebar" ? 20 : 24;
  const contactSize = 12.5;
  const links = Object.entries(basic.icons ?? {})
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`);

  const contacts = [
    basic.email,
    basic.phone,
    basic.location,
    basic.birthDate,
    basic.employementStatus,
  ];

  const foreground = onBanner ? "#ffffff" : undefined;

  if (variant === "sidebar")
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <PhotoBox basic={basic} />
        <div>
          <h1 className="font-bold leading-tight" style={{ fontSize: nameSize, color: accent }}>
            {basic.name}
          </h1>
          <p className="text-neutral-600" style={{ fontSize: 13 }}>
            {basic.title}
          </p>
        </div>
        <div className="w-full space-y-0.5 break-words text-left" style={{ fontSize: contactSize }}>
          <ContactLine size={contactSize} items={[basic.email]} />
          <ContactLine size={contactSize} items={[basic.phone, basic.location]} />
          <ContactLine size={contactSize} items={[basic.birthDate, basic.employementStatus]} />
          <ContactLine size={contactSize} items={links} />
        </div>
      </div>
    );

  const isCentered = variant === "centered" || align === "center";
  const isRight = align === "right" && variant !== "centered";
  const justify = isCentered ? "justify-center" : isRight ? "justify-end" : "justify-start";

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        isCentered && "flex-col items-center text-center",
        isRight && "flex-row-reverse text-right",
      )}
    >
      <div className={cn("min-w-0 flex-1", isCentered && "w-full")}>
        <h1
          className="font-bold leading-tight text-neutral-900"
          style={{ fontSize: nameSize, color: foreground }}
        >
          {basic.name}
        </h1>
        <p
          className={cn("flex justify-start", isCentered && "justify-center", isRight && "justify-end")}
          style={{ fontSize: 14, color: onBanner ? "rgba(255,255,255,.88)" : accent }}
        >
          {basic.title}
        </p>
        <div className={cn("mt-1.5", onBanner && "text-white/90")}>
          <ContactLine size={contactSize} items={contacts} justify={justify} />
          <ContactLine size={contactSize} items={links} justify={justify} />
        </div>
        {basic.customFields
          .filter((field) => field.visible !== false && field.value)
          .map((field) => (
            <div key={field.id} className="mt-1" style={{ fontSize: contactSize }}>
              {field.displayLabel === false ? null : (
                <span className="text-neutral-500">{field.label}：</span>
              )}
              <span className={onBanner ? "text-white" : "text-neutral-800"}>{field.value}</span>
            </div>
          ))}
      </div>
      {!isCentered && <PhotoBox basic={basic} />}
    </div>
  );
};
