import { cn } from "@/lib/utils";

const Bar = ({ w, className }: { w: string | number; className?: string }) => (
  <div className={cn("h-1 rounded-full bg-neutral-300", className)} style={{ width: w }} />
);

const Lines = ({ count, accent }: { count: number; accent?: string }) => (
  <div className="space-y-1">
    {Array.from({ length: count }).map((_, i) => (
      <Bar key={i} w={i === 0 ? "55%" : "88%"} className={i === 0 && accent ? "h-1.5" : undefined} />
    ))}
  </div>
);

/**
 * 模板缩略图用纯 DOM 画：上游是 playwright 预生成的 PNG，
 * 复刻工程不引入二进制资源，也不外链原站图片。
 */
export const TemplateThumb = ({
  templateId,
  color,
  className,
}: {
  templateId: string;
  color: string;
  className?: string;
}) => {
  if (templateId === "left-right")
    return (
      <div className={cn("flex h-full w-full gap-2 bg-white p-3", className)}>
        <div className="w-1/3 space-y-2 rounded bg-neutral-100 p-2">
          <div className="h-6 w-6 rounded-full" style={{ background: color }} />
          <Lines count={4} />
        </div>
        <div className="flex-1 space-y-3">
          <Lines count={2} accent={color} />
          <Lines count={4} />
          <Lines count={3} />
        </div>
      </div>
    );

  if (templateId === "modern")
    return (
      <div className={cn("h-full w-full bg-white", className)}>
        <div className="h-1/4 p-3" style={{ background: color }}>
          <div className="h-2 w-1/3 rounded-full bg-white/80" />
          <div className="mt-1.5 h-1.5 w-1/4 rounded-full bg-white/60" />
        </div>
        <div className="space-y-2 p-3">
          <div className="h-2 w-1/4 rounded-full" style={{ background: color, opacity: 0.5 }} />
          <Lines count={3} />
          <div className="h-2 w-1/4 rounded-full" style={{ background: color, opacity: 0.5 }} />
          <Lines count={3} />
        </div>
      </div>
    );

  if (templateId === "timeline")
    return (
      <div className={cn("h-full w-full space-y-2 bg-white p-3", className)}>
        <div className="mx-auto h-2 w-1/3 rounded-full" style={{ background: color }} />
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-neutral-300" />
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-2">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
            <div className="flex-1 space-y-1">
              <Lines count={2} />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className={cn("h-full w-full space-y-2 bg-white p-3", className)}>
      <div className="h-2.5 w-1/3 rounded-full" style={{ background: color }} />
      <Lines count={2} />
      <div className="h-px w-full" style={{ background: color }} />
      <Lines count={3} accent={color} />
      <Lines count={3} />
    </div>
  );
};
