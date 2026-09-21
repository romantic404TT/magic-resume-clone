import grammarRulesJson from "@/mocks/data/grammarRules.json";
import polishPresetsJson from "@/mocks/data/polishPresets.json";

export interface GrammarRule {
  id: string;
  pattern: string;
  flags: string;
  replacement: string;
  autoFix: boolean;
  severity: "error" | "warning";
  messageZh: string;
  messageEn: string;
}

export interface GrammarIssue {
  id: string;
  ruleId: string;
  severity: "error" | "warning";
  message: string;
  start: number;
  end: number;
  /** 命中的原文，用于在 HTML 源串里定位并替换 */
  matched: string;
  /** 带上下文的展示片段 */
  excerpt: string;
  suggestion: string | null;
}

export interface GrammarResult {
  model: string;
  checkedLength: number;
  issues: GrammarIssue[];
}

export interface PolishChange {
  from: string;
  to: string;
  note: string;
}

export interface PolishResult {
  model: string;
  original: string;
  polished: string;
  changes: PolishChange[];
}

export const MOCK_MODEL_NAME = "mock-rule-based-v1";

type Presets = {
  replacements: { from: string; to: string; note: string }[];
  weakOpeners: string[];
  bulletPrefix: string;
};

const RULES = grammarRulesJson as GrammarRule[];
const PRESETS = polishPresetsJson as Presets;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const withGlobal = (flags: string) => (flags.includes("g") ? flags : `${flags}g`);

interface CompiledRule {
  rule: GrammarRule;
  scan: RegExp;
  patch: RegExp;
}

const COMPILED: CompiledRule[] = RULES.flatMap((rule) => {
  try {
    return [{ rule, scan: new RegExp(rule.pattern, withGlobal(rule.flags)), patch: new RegExp(rule.pattern, rule.flags) }];
  } catch {
    return [];
  }
});

interface Hit {
  start: number;
  end: number;
  raw: string;
  group?: string;
}

const collectHits = (scan: RegExp, text: string): Hit[] => {
  const hits: Hit[] = [];
  scan.lastIndex = 0;
  let match: RegExpExecArray | null = scan.exec(text);
  let guard = 0;
  while (match && guard < 1000) {
    guard += 1;
    if (match[0].length === 0) scan.lastIndex += 1;
    else hits.push({ start: match.index, end: match.index + match[0].length, raw: match[0], group: match[1] });
    match = scan.exec(text);
  }
  scan.lastIndex = 0;
  return hits;
};

export const checkGrammar = (text: string, locale: "zh" | "en" = "zh"): GrammarResult => {
  const issues: GrammarIssue[] = [];

  for (const { rule, scan, patch } of COMPILED) {
    for (const hit of collectHits(scan, text)) {
      const start = hit.group ? hit.end - hit.group.length : hit.start;
      const matched = hit.group ?? hit.raw;
      issues.push({
        id: `${rule.id}@${start}`,
        ruleId: rule.id,
        severity: rule.severity,
        message: locale === "zh" ? rule.messageZh : rule.messageEn,
        start,
        end: hit.end,
        matched,
        excerpt: text.slice(Math.max(0, start - 28), Math.min(text.length, hit.end + 28)),
        suggestion: rule.autoFix ? hit.raw.replace(patch, rule.replacement) : null,
      });
    }
  }

  const deduped = issues
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .filter((issue, index, list) => index === 0 || issue.start >= list[index - 1].end);

  return { model: MOCK_MODEL_NAME, checkedLength: text.length, issues: deduped };
};

const stripTags = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{2,}/g, "\n")
    .trim();

const normalize = (text: string) =>
  text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(^|[.!?]\s+)([a-z])/g, (_m, head: string, letter: string) => head + letter.toUpperCase())
    .trim();

export const polishText = (text: string): PolishResult => {
  const changes: PolishChange[] = [];
  let output = text;

  for (const { rule, scan } of COMPILED) {
    if (!rule.autoFix) continue;
    if (collectHits(scan, output).length === 0) continue;
    const before = output;
    output = output.replace(new RegExp(rule.pattern, withGlobal(rule.flags)), rule.replacement);
    if (output !== before) {
      changes.push({ from: rule.id, to: rule.replacement || "(removed)", note: rule.messageZh });
    }
  }

  for (const preset of PRESETS.replacements) {
    const re = new RegExp(`\\b${escapeRegExp(preset.from)}\\b`, "gi");
    if (!re.test(output)) {
      re.lastIndex = 0;
      continue;
    }
    re.lastIndex = 0;
    const before = output;
    output = output.replace(re, (hit) =>
      /^[A-Z]/.test(hit) ? preset.to.charAt(0).toUpperCase() + preset.to.slice(1) : preset.to,
    );
    if (output !== before) changes.push(preset);
  }

  for (const weak of PRESETS.weakOpeners) {
    const re = new RegExp(`[ \\t]+\\b${escapeRegExp(weak)}\\b`, "gi");
    const before = output;
    output = output.replace(re, "");
    if (output !== before) changes.push({ from: weak, to: "", note: "删除弱化语气词" });
  }

  output = normalize(output);
  return { model: MOCK_MODEL_NAME, original: text, polished: output, changes };
};

const BLOCK_TAG = /<(p|li|div|h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;

/**
 * 按块级元素逐段润色：结构（p / li）保留，
 * 但块内的内联标记（strong、a 等）会被展平成纯文本 —— mock 不做富文本保真。
 */
export const polishHtml = (html: string): PolishResult & { html: string } => {
  const blocks: { tag: string; inner: string }[] = [];
  BLOCK_TAG.lastIndex = 0;
  let match: RegExpExecArray | null = BLOCK_TAG.exec(html);
  while (match) {
    blocks.push({ tag: match[1].toLowerCase(), inner: match[2] });
    match = BLOCK_TAG.exec(html);
  }
  BLOCK_TAG.lastIndex = 0;

  const plain = stripTags(html);
  const merged = polishText(plain);

  if (blocks.length === 0) {
    const rebuilt = merged.polished
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
    return { ...merged, html: rebuilt || html };
  }

  let index = 0;
  const allChanges: PolishChange[] = [];
  const rebuilt = html.replace(BLOCK_TAG, (_full, _tag: string, inner: string) => {
    const result = polishText(stripTags(inner));
    allChanges.push(...result.changes);
    const block = blocks[index++];
    return `<${block.tag}>${result.polished}</${block.tag}>`;
  });

  return {
    model: MOCK_MODEL_NAME,
    original: plain,
    polished: merged.polished,
    changes: allChanges,
    html: rebuilt,
  };
};
