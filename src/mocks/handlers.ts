import { delay, HttpResponse, http } from "msw";
import { checkGrammar, polishHtml, polishText } from "@/mocks/logic";

const placeholderImage = (target: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <rect width="240" height="240" fill="#0f172a" />
  <circle cx="120" cy="96" r="40" fill="#38bdf8" />
  <text x="120" y="176" fill="#e2e8f0" font-size="14" text-anchor="middle" font-family="monospace">mock image proxy</text>
  <text x="120" y="198" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="monospace">${target.slice(0, 28)}</text>
</svg>`;

const badRequest = (message: string) =>
  HttpResponse.json({ success: false, error: message }, { status: 400 });

export const handlers = [
  /** 上游 src/app/api/grammar/route.ts —— 真实实现会调用 LLM，这里用确定性规则引擎 */
  http.post("/api/grammar", async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      text?: string;
      locale?: "zh" | "en";
    } | null;

    if (!body || typeof body.text !== "string" || body.text.trim().length === 0) {
      return badRequest("text is required");
    }

    await delay(240);
    const result = checkGrammar(body.text, body.locale === "en" ? "en" : "zh");
    return HttpResponse.json({ success: true, data: result });
  }),

  /** 上游 src/app/api/polish/route.ts —— 真实实现会调用 LLM，这里做规则化改写 */
  http.post("/api/polish", async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      text?: string;
      html?: string;
      mode?: "text" | "html";
      tone?: string;
    } | null;

    if (!body) return badRequest("json body is required");

    await delay(320);

    if (body.mode === "html") {
      if (typeof body.html !== "string") return badRequest("html is required");
      const result = polishHtml(body.html);
      return HttpResponse.json({ success: true, data: { ...result, tone: body.tone ?? "professional" } });
    }

    if (typeof body.text !== "string" || body.text.trim().length === 0) {
      return badRequest("text is required");
    }

    const result = polishText(body.text);
    return HttpResponse.json({ success: true, data: { ...result, tone: body.tone ?? "professional" } });
  }),

  /** 上游 src/app/api/proxy/image —— 真实实现会代理 GitHub 头像，这里返回占位图 */
  http.get("/api/proxy/image", ({ request }) => {
    const url = new URL(request.url).searchParams.get("url");
    if (!url || !/^https?:\/\//i.test(url)) return badRequest("url must be an http(s) link");
    return new HttpResponse(placeholderImage(new URL(url).host), {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "max-age=3600",
        "X-Mock-Source": "magic-resume-clone",
      },
    });
  }),
];
