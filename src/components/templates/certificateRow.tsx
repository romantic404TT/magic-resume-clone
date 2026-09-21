import type { Certificate } from "@/types/resume";

export const CertificateRow = ({
  certificates,
  maxColumns = 4,
}: {
  certificates: Certificate[];
  maxColumns?: number;
}) => {
  if (!certificates.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {certificates.slice(0, maxColumns * 2).map((item) => (
        <img
          key={item.id}
          src={item.url}
          alt="certificate"
          className="object-contain"
          style={{ width: `${item.width}%`, maxWidth: 120, minHeight: 40 }}
        />
      ))}
    </div>
  );
};
