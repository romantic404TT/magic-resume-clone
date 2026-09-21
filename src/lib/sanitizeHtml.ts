/**
 * 简历内容里的 HTML 来自用户自己在富文本编辑器中的输入，
 * 渲染前仍过一遍白名单，避免 localStorage 被手工篡改后造成 XSS。
 */
const ALLOWED_TAGS = new Set([
  "P", "BR", "UL", "OL", "LI", "STRONG", "B", "EM", "I", "U", "S",
  "SPAN", "DIV", "H1", "H2", "H3", "H4", "A",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  A: ["href", "target", "rel"],
  SPAN: ["style"],
};

const isSafeUrl = (url: string) => {
  const trimmed = url.trim();
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    /^https?:\/\//i.test(trimmed) ||
    /^mailto:/i.test(trimmed) ||
    /^data:image\/(png|jpe?g|webp|svg\+xml);base64,/i.test(trimmed)
  );
};

export const sanitizeHtml = (html: string): string => {
  if (typeof document === "undefined" || !html) return "";

  const container = document.createElement("div");
  container.innerHTML = html;

  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!ALLOWED_TAGS.has(el.tagName)) {
          el.replaceWith(...Array.from(el.childNodes));
          return;
        }
        const allowed = ALLOWED_ATTRS[el.tagName] ?? [];
        [...el.attributes].forEach((attr) => {
          if (!allowed.includes(attr.name)) el.removeAttribute(attr.name);
        });
        if (el.tagName === "A") {
          const href = el.getAttribute("href") ?? "";
          if (!isSafeUrl(href)) el.removeAttribute("href");
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noreferrer noopener");
        }
        if (el.tagName === "SPAN") {
          const style = el.getAttribute("style") ?? "";
          const safe = style
            .split(";")
            .map((s) => s.trim())
            .filter((s) => /^(font-weight|font-style|color|text-decoration)\s*:/i.test(s))
            .join("; ");
          if (safe) el.setAttribute("style", safe);
          else el.removeAttribute("style");
        }
        walk(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      }
    });
  };

  walk(container);
  return container.innerHTML;
};
