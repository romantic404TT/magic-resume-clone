import type { GrammarResult, PolishResult } from "@/mocks/logic";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const postJson = async <T>(url: string, payload: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const envelope = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || !envelope?.success || envelope.data === undefined) {
    throw new ApiError(envelope?.error ?? `${url} 请求失败（${response.status}）`, response.status);
  }
  return envelope.data;
};

export const imageProxyUrl = (url: string) =>
  `/api/proxy/image?url=${encodeURIComponent(url)}`;

export const requestGrammarCheck = (text: string, locale: "zh" | "en") =>
  postJson<GrammarResult>("/api/grammar", { text, locale });

export const requestPolishHtml = (html: string) =>
  postJson<PolishResult & { html: string }>("/api/polish", {
    mode: "html",
    html,
    tone: "professional",
  });

export const requestPolishText = (text: string) =>
  postJson<PolishResult>("/api/polish", { mode: "text", text });
