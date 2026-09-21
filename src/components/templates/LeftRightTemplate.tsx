import { usePageStyle, useSections, SectionShell, type TemplateProps } from "@/components/templates/common";
import { BaseInfoBlock, EntryRow, RichText, SectionTitle } from "@/components/templates/parts";
import { CertificateRow } from "@/components/templates/certificateRow";

const SIDEBAR_MODULES = new Set(["skills", "education", "certificates"]);

/** Left-Right：左侧信息+技能栏，右侧经历正文 */
export const LeftRightTemplate = ({ resume, t }: TemplateProps) => {
  const { settings, style } = usePageStyle(resume);
  const sections = useSections(resume);
  const accent = settings.themeColor ?? "#0047AB";
  const sidebar = sections.filter((s) => SIDEBAR_MODULES.has(s.id));
  const main = sections.filter((s) => !SIDEBAR_MODULES.has(s.id));

  const renderSection = (section: (typeof sections)[number], compact: boolean) => (
    <SectionShell key={section.id} id={section.id} gap={settings.sectionSpacing}>
      <SectionTitle
        title={t(section.title)}
        variant={compact ? "plain" : "underline"}
        size={settings.headerSize - (compact ? 2 : 0)}
        color={accent}
      />
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
      {section.kind === "certificates" && <CertificateRow certificates={section.certificates ?? []} maxColumns={2} />}
    </SectionShell>
  );

  return (
    <div className="resume-page grid grid-cols-[240px_1fr] overflow-hidden" style={{ ...style, padding: 0 }}>
      <aside className="h-full bg-neutral-50 p-5" style={{ fontSize: settings.baseFontSize }}>
        <BaseInfoBlock basic={resume.basic} variant="sidebar" accent={accent} />
        <div className="mt-5 space-y-4">{sidebar.map((section) => renderSection(section, true))}</div>
      </aside>
      <main className="p-6" style={{ fontSize: settings.baseFontSize }}>
        {main.map((section) => renderSection(section, false))}
      </main>
    </div>
  );
};
