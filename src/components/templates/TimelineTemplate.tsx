import { usePageStyle, useSections, SectionShell, type TemplateProps } from "@/components/templates/common";
import { BaseInfoBlock, EntryRow, RichText, SectionTitle } from "@/components/templates/parts";
import { CertificateRow } from "@/components/templates/certificateRow";

/** Timeline：经历/项目/教育以竖向时间轴呈现 */
export const TimelineTemplate = ({ resume, t }: TemplateProps) => {
  const { settings, style } = usePageStyle(resume);
  const sections = useSections(resume);
  const accent = settings.themeColor ?? "#8B0000";

  return (
    <div className="resume-page" style={style}>
      <BaseInfoBlock basic={resume.basic} variant="centered" accent={accent} />
      <div className="mx-auto mb-4 mt-3 h-0.5 w-16 rounded-full" style={{ background: accent }} />

      {sections.map((section) => (
        <SectionShell key={section.id} id={section.id} gap={settings.sectionSpacing}>
          <SectionTitle title={t(section.title)} variant="plain" size={settings.headerSize} color={accent} />
          {section.kind === "richtext" && (
            <RichText html={section.html} style={{ fontSize: settings.baseFontSize }} className="text-neutral-700" />
          )}
          {section.kind === "entries" &&
            section.entries.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                accent={accent}
                timeline
                gap={settings.paragraphSpacing + 8}
                bodySize={settings.subheaderSize}
                subSize={settings.baseFontSize - 1}
              />
            ))}
          {section.kind === "certificates" && <CertificateRow certificates={section.certificates ?? []} />}
        </SectionShell>
      ))}
    </div>
  );
};
