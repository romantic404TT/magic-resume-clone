import { usePageStyle, useSections, SectionShell, type TemplateProps } from "@/components/templates/common";
import { BaseInfoBlock, EntryRow, RichText, SectionTitle } from "@/components/templates/parts";
import { CertificateRow } from "@/components/templates/certificateRow";

/** Modern：顶部主题色横幅 + 圆角色块标题 + 短模块双列 */
export const ModernTemplate = ({ resume, t }: TemplateProps) => {
  const { settings, style } = usePageStyle(resume);
  const sections = useSections(resume);
  const accent = settings.themeColor ?? "#2E8B57";
  const wide = sections.filter((s) => s.kind === "entries");
  const narrow = sections.filter((s) => s.kind !== "entries");

  const body = (section: (typeof sections)[number]) => (
    <>
      {section.kind === "richtext" && (
        <RichText html={section.html} style={{ fontSize: settings.baseFontSize }} className="text-neutral-700" />
      )}
      {section.kind === "entries" &&
        section.entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            accent={accent}
            gap={settings.paragraphSpacing + 4}
            bodySize={settings.subheaderSize}
            subSize={settings.baseFontSize - 1}
          />
        ))}
      {section.kind === "certificates" && <CertificateRow certificates={section.certificates ?? []} />}
    </>
  );

  return (
    <div className="resume-page overflow-hidden" style={{ ...style, padding: 0 }}>
      <header className="px-8 py-6" style={{ background: accent, paddingBottom: 24 + (settings.pagePadding - 40) }}>
        <BaseInfoBlock basic={resume.basic} variant="left" accent={accent} onBanner />
      </header>

      <div style={{ padding: settings.pagePadding }}>
        {narrow.map((section) => (
          <SectionShell key={section.id} id={section.id} gap={settings.sectionSpacing}>
            <SectionTitle title={t(section.title)} variant="side-rule" size={settings.headerSize} color={accent} />
            {body(section)}
          </SectionShell>
        ))}
        {wide.map((section) => (
          <SectionShell key={section.id} id={section.id} gap={settings.sectionSpacing}>
            <SectionTitle title={t(section.title)} variant="side-rule" size={settings.headerSize} color={accent} />
            <div className="rounded-lg bg-neutral-50 p-3">{body(section)}</div>
          </SectionShell>
        ))}
      </div>
    </div>
  );
};
