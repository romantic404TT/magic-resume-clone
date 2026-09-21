import { usePageStyle, useSections, SectionShell, type TemplateProps } from "@/components/templates/common";
import { BaseInfoBlock, EntryRow, RichText, SectionTitle } from "@/components/templates/parts";
import { CertificateRow } from "@/components/templates/certificateRow";

/** Classic：中文简历最常见的单栏版式，模块标题带主题色下划线 */
export const ClassicTemplate = ({ resume, t }: TemplateProps) => {
  const { settings, style } = usePageStyle(resume);
  const sections = useSections(resume);
  const accent = settings.themeColor ?? "#000000";

  return (
    <div className="resume-page" style={style}>
      <BaseInfoBlock basic={resume.basic} variant="left" accent={accent} />
      <div className="my-3 h-px w-full" style={{ background: accent }} />

      {sections.map((section) => (
        <SectionShell key={section.id} id={section.id} gap={settings.sectionSpacing}>
          <SectionTitle title={t(section.title)} size={settings.headerSize} color={accent} />
          {section.kind === "richtext" && (
            <RichText
              html={section.html}
              style={{ fontSize: settings.baseFontSize }}
              className="text-neutral-700"
            />
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
                centerSubtitle={settings.centerSubtitle}
              />
            ))}
          {section.kind === "certificates" && (
            <CertificateRow certificates={section.certificates ?? []} />
          )}
        </SectionShell>
      ))}
    </div>
  );
};
