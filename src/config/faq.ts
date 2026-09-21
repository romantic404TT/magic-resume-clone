export interface FaqItem {
  question: { zh: string; en: string };
  answer: { zh: string; en: string };
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: {
      zh: "简历数据存放在哪里？",
      en: "Where is my resume data stored?",
    },
    answer: {
      zh: "全部在浏览器 localStorage（键名 magic-resume-clone-storage）。没有账号体系，也没有服务器；换设备请用「导出 JSON / 导入 JSON」。",
      en: "Everything lives in browser localStorage under magic-resume-clone-storage. There is no account or server; use Export/Import JSON to move between devices.",
    },
  },
  {
    question: {
      zh: "AI 润色和语法检查是真的吗？",
      en: "Are AI polish and grammar check real?",
    },
    answer: {
      zh: "不是。原项目这两个接口会把文本发给 LLM；本复刻用 MSW 拦截，按 grammarRules.json 与 polishPresets.json 做确定性改写，结果可复现且完全离线。",
      en: "No. The original sends text to an LLM; this clone intercepts with MSW and applies deterministic rules from grammarRules.json and polishPresets.json — reproducible and fully offline.",
    },
  },
  {
    question: {
      zh: "为什么只有 4 套模板？",
      en: "Why only 4 templates?",
    },
    answer: {
      zh: "上游有 9 套（creative / editorial / elegant / minimalist / swiss 等）。本复刻实现了版式差异最大的 4 套，其余 5 套未移植；模板注册表已留好扩展位。",
      en: "The upstream ships 9. This clone implements the 4 most visually distinct ones; the remaining 5 are not ported. The registry is ready for more.",
    },
  },
  {
    question: {
      zh: "导出的 PDF 是可选文本的吗？",
      en: "Is the exported PDF text-selectable?",
    },
    answer: {
      zh: "不是。与原项目早期方案相同，PDF 由 html2canvas 截取简历再交给 jsPDF 分页，属于位图 PDF；需要文本层请用浏览器打印（Ctrl/Cmd+P）或导出 JSON。",
      en: "No. Like the original's canvas path, html2canvas snapshots the page and jsPDF paginates it, so the PDF is an image. Use browser print or JSON export otherwise.",
    },
  },
  {
    question: {
      zh: "照片会被上传吗？",
      en: "Are photos uploaded?",
    },
    answer: {
      zh: "不会。照片由 FileReader 转成 base64 后写进 localStorage。注意单张超过 1MB 会明显挤占约 5MB 的配额。",
      en: "No. Photos become base64 in localStorage via FileReader. Anything over 1MB eats into the roughly 5MB quota quickly.",
    },
  },
];
