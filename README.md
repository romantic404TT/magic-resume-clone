# Magic Resume · React 404tag

对 [JOYCEQL/magic-resume](https://github.com/JOYCEQL/magic-resume)（MIT，v2.0.9）的**前端复刻**，
按你的技术栈要求重写为纯 SPA：

**Vite 5 + React 18 + TypeScript + React Router 6 + Tailwind CSS 3 + Zustand 4 + MSW 2**

产物是一个真正可运行的工程（不是静态 HTML）：`npm run dev` 起本地服务，`npm run build` 出 `dist/`。

---

## 1. 命令

```bash
# 安装（约 340 个包 / 198MB / 2 分钟，registry 用默认镜像即可）
npm install

# 开发：http://localhost:5199（strictPort，端口被占会直接报错而不是静默漂移）
npm run dev

# 类型检查
npm run typecheck

# 生产构建（先 tsc --noEmit 再 vite build → dist/）
npm run build

# 本地预览构建产物
npm run preview

# Node 冒烟测试（不需要浏览器，直接跑 store / mock 规则 / 视图模型）
npm run smoke

# 重新生成 public/mockServiceWorker.js（依赖变动后需要）
npm run mock:init
```

### 部署

构建产物是纯静态文件（无 Node 运行时要求），任何静态托管都能放：

```bash
npm run build
# 把 dist/ 整个目录交给 Nginx / Vercel / Netlify / GitHub Pages
npx vite preview --port 4173        # 部署前本地自检
```

部署注意事项：

1. **必须把 `dist/mockServiceWorker.js` 一起上传**（MSW 的 service worker，构建时从 `public/` 拷贝），
   否则所有 `/api/*` 请求会 404。
2. **需要 SPA fallback**：`/app/resumes/xxx/edit` 这类深链要回退到 `index.html`。
   Nginx：`try_files $uri $uri/ /index.html;`
3. 子路径部署时设置 `base`（vite.config.ts），`mockServiceWorker.js` 已按 `import.meta.env.BASE_URL` 注册。
4. 简历数据存在访问者自己的 localStorage，多设备之间不会同步。

---

## 2. 目录结构

```
magic-resume-clone/
├─ index.html
├─ package.json
├─ vite.config.ts            # @ 别名、port 5199 strictPort
├─ tsconfig.json
├─ tailwind.config.js        # shadcn 风格 HSL 变量 + 暗色 class 策略
├─ postcss.config.js
├─ public/
│  ├─ mockServiceWorker.js   # msw init 生成
│  ├─ logo.svg / avatar.svg / certificate-a.svg / certificate-b.svg
├─ scripts/
│  └─ smoke.ts               # Node 冒烟测试（esbuild 打包后执行）
└─ src/
   ├─ main.tsx               # 启动 MSW → 渲染 RouterProvider + Toaster
   ├─ routes.tsx             # createBrowserRouter：/ 、/app/* 、*
   ├─ index.css              # Tailwind 层 + A4(.resume-page) + 富文本 + 打印样式
   ├─ types/resume.ts        # 数据模型（照搬上游字段）
   ├─ config/
   │  ├─ modules.ts          # STANDARD_MODULES / 主题色 / 字体 / 4 套模板定义
   │  ├─ initialResumeData.ts# 空简历工厂 + 内置示例简历
   │  └─ faq.ts              # 落地页 FAQ（zh/en）
   ├─ store/
   │  ├─ useResumeStore.ts   # 多简历 CRUD + 模块操作 + 撤销/重做，persist→localStorage
   │  └─ useSettingsStore.ts # 主题 / 语言 / 缩放 / 分页参考线 / AI 开关
   ├─ i18n/index.ts          # zh/en 字典 + useI18n()
   ├─ lib/
   │  ├─ utils.ts            # cn / uid / htmlToText / 时间格式化 / 下载
   │  ├─ sanitizeHtml.ts     # 富文本回显前的白名单清洗
   │  └─ exportPdf.ts        # html2canvas + jsPDF 多页 A4
   ├─ mocks/                 # ★ 所有网络请求都在这一层
   │  ├─ browser.ts          # setupWorker / startMocks
   │  ├─ handlers.ts         # 3 个 handler
   │  ├─ logic.ts            # 确定性规则引擎（语法/润色），Node 可测
   │  ├─ client.ts           # 组件用的类型化 fetch 封装
   │  └─ data/grammarRules.json · polishPresets.json
   ├─ hooks/                 # useDragSort（原生 HTML5 DnD）、useCurrentResume
   ├─ pages/                 # LandingPage / ResumeListPage / EditorPage / TemplatesPage / SettingsPage / NotFoundPage
   └─ components/
      ├─ ui/                 # button input badge accordion dialog dropdown-menu select controls
      ├─ layout/AppShell.tsx # 工作台外壳（侧栏 + 顶栏）
      ├─ shared/             # Logo ThemeToggle LanguageSwitch ConfirmDialog TemplateSheet LayoutSettingsDialog ai/AIPolishDialog
      ├─ home/               # LandingHeader HeroSection FeaturesSection FAQSection CTASection LandingFooter
      ├─ editor/             # EditorHeader EditPanel ItemShell ModuleSortList Field
      │  ├─ basic/           # BasicPanel AlignSelector
      │  ├─ experience/ education/ project/ skills/ self-evaluation/ certificates/ custom/
      │  └─ grammar/GrammarCheckDialog.tsx
      ├─ preview/PreviewPanel.tsx  # 缩放、分页参考线、A4 页数测量
      └─ templates/          # views.ts(视图模型) parts.tsx(渲染件) registry.ts + 4 套模板 + TemplateRenderer + TemplateThumb
```

---

## 3. 路由

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | LandingPage | 头部/主视觉（真实简历渲染缩略）/特性/FAQ/CTA/页脚 |
| `/app` | — | 重定向到 `/app/resumes` |
| `/app/resumes` | ResumeListPage | 搜索、按模板筛选、新建/导入、卡片菜单（编辑/重命名/副本/导出/删除） |
| `/app/resumes/:resumeId/edit` | EditorPage | 左表单 + 右实时预览，`/` 深链可直接访问 |
| `/app/templates` | TemplatesPage | 4 套模板的**真实渲染**预览（scale 0.36），一键套用 |
| `/app/settings` | SettingsPage | 主题/语言/缩放/分页线/AI 开关/localStorage 占用/导出备份/清空 |
| `*` | NotFoundPage | 404 |

---

## 4. Mock 边界（这一节请认真看）

### 4.1 被 MSW mock 的接口（上游确实需要服务端）

| 接口 | 上游真实行为 | 本复刻的 mock |
|---|---|---|
| `POST /api/polish` | 把文本发给 LLM（Gemini/DeepSeek/OpenAI…） | `src/mocks/logic.ts` 用 `polishPresets.json`（12 条词汇替换 + 弱化词删除）和 `grammarRules.json` 的自动修复项做**确定性改写**，返回 `{original, polished, changes[], model:"mock-rule-based-v1", html}`；按块级元素（`p`/`li`）逐段处理，**块内加粗、链接会被展平** |
| `POST /api/grammar` | LLM 返回问题列表 | `grammarRules.json` 的 **8 条正则规则**（重复单词、标点空格、小写 i、双空格、more better、can be able to、句首大写…），返回 `{issues:[{ruleId,message,matched,excerpt,suggestion,...}]}`；`matched` 用于在 HTML 源串里回替 |
| `GET /api/proxy/image?url=` | 服务端代理 GitHub 头像/图片 | 直接返回一张写着目标 host 的占位 SVG |

三个 handler 都是 `onUnhandledRequest: "bypass"`，不拦截任何其他请求。

### 4.2 没有 mock、也不该 mock 的部分

原项目**没有后端数据库**，简历本来就存在浏览器 localStorage。所以复刻保持一致：
`useResumeStore` + `zustand/persist` 直接写 localStorage（键名 `magic-resume-clone-storage`），
**不走 MSW、不伪装成 REST API**。列表页看到的“我的简历”是真实可读写的本地数据。

照片同理：FileReader → base64 → localStorage（上游也是这样），因此没有 `/api/upload/photo` 这种上游不存在的接口。

### 4.3 未移植的功能（不造假，也不留死按钮）

| 上游功能 | 本复刻状态 |
|---|---|
| 9 套模板 | **只做 4 套**：classic / left-right / modern / timeline（版式差异最大的）。`registry.ts` 里 `NOT_PORTED_TEMPLATES` 列出了未移植的 5 套 |
| PDF 导入（pdfjs + 服务端解析） | ❌ 未移植，导入只支持本工具导出的 JSON |
| LLM 真接入 + API Key 管理页 | ❌ 未移植，设置页只有一个「启用 mock 的 AI 接口」开关 |
| GitHub 贡献图、国际化 `[locale]` 路由、Dock 动效、移动端专用工作台 | ❌ 未移植（编辑器窄屏改为上下堆叠） |
| `autoOnePage` / `pageBreakLinesVisible` / `useIconMode` 等 globalSettings 字段 | 类型保留（兼容上游数据），但**界面上不提供无效开关**；分页参考线改由设置页的 `showPageBreakGuides` 实现 |
| 深链编辑器中的部分二级文案 | 中英双语只覆盖了主要 chrome，编辑面板里的少量二级按钮仍是中文 |

导出 PDF 是 **html2canvas 截图 + jsPDF 分页**的位图 PDF（与原项目同路线），文字不可选中；
要矢量文本请用浏览器打印（下拉菜单里的「打印」+ `src/index.css` 的 `@media print`）。

---

## 5. 与原项目的技术差异

| 维度 | 上游 magic-resume | 本复刻 |
|---|---|---|
| 框架 | TanStack Start + Vite 7（从 Next.js 迁移而来） | Vite 5 + React Router 6（按你的要求） |
| UI | shadcn/ui（16 个 Radix 原语）+ HeroUI + magicui | shadcn 风格自写 9 个 Radix 原语，无 HeroUI |
| 状态 | zustand 4 + 30KB 的 `useResumeStore.ts` | zustand 4 + `useResumeStore`（含撤销/重做，逻辑等量拆分） |
| 富文本 | TipTap 3 | TipTap 2.27（StarterKit + Link/Underline/TextAlign/Placeholder） |
| 排序 | 上游 package.json 里**没有任何拖拽库** | 原生 HTML5 DnD（`hooks/useDragSort.ts`），未引入 dnd-kit |
| i18n | next-intl 兼容层 + `[locale]` 路由 | 轻量字典 `src/i18n/index.ts` + store 里的 locale |
| 缩略图 | playwright 预生成 PNG（9 套 × 2 语言） | 纯 DOM 画的 `TemplateThumb`，不引入二进制资源 |

---

## 6. 已验证内容

| 检查 | 结果 |
|---|---|
| `npx tsc --noEmit` | **0 error**（strict + noUnusedLocals/Parameters） |
| `npm run build` | 成功，2445 个模块，dist 主包 1.73MB / gzip 544KB（TipTap+html2canvas+jsPDF+MSW 同一 chunk，未做 code-split） |
| `npm run smoke` | **38/38 断言通过**：语法/润色规则引擎、多简历 CRUD、模块排序、自定义模块增删、撤销/重做逐条比对、视图模型、persist 只落 `resumes/currentResumeId` |
| 浏览器实测（无头 Edge/内置面板，`npm run dev` @5199） | MSW service worker 注册在 `http://localhost:5199/`；`POST /api/grammar` → 200、命中 3 条规则 `lowercase-pronoun-i / space-before-punctuation / more-better`；`POST /api/polish` → `<ul><li>I used extensive tools</li></ul>`（3 处改动）；`GET /api/proxy/image` → 200 `image/svg+xml` + `X-Mock-Source: magic-resume-clone` |
| 编辑器联动 | 列表页 1 张示例卡 → 点进 `/app/resumes/<uuid>/edit`：`.resume-page` 实测宽 **794px**、6 个 `[data-module]` 按 menuSections 顺序渲染；改「姓名」输入框 → 预览首行由 `张三` 实时变为 `王五测试`（这条改动留在了当时那个内置浏览器 profile 的 localStorage 里，回写被权限策略拦下；你自己的浏览器首次打开是干净的）；展开「工作经历」→ 2 个 TipTap 实例 + 20 个工具条按钮挂载 |
| 模板库 | 4 张卡片各自渲染真实简历（transform 后宽 286px = 794×0.36），left-right 的模块顺序变成「技能/教育/证书 → 经历/项目/自我评价」，timeline 出现 5 个时间轴圆点：4 套版式确实走的是不同布局 |
| 设置页 | Tabs/Switch/Slider 的 a11y 角色齐全，localStorage 占用为**实测值 2.8 KB** |
| 控制台 | 0 error / 0 warning（已加 React Router v7 future flags） |
| 未验证 | PDF 导出与打印、拖拽排序的手感、弹窗内按钮点击链路 —— 需要真实可见的浏览器窗口（内置面板视口 0×0，截图与点击被权限策略拦截），请按第 7 节人工过一遍 |

---

## 7. 验收清单（人工）

打开 `http://localhost:5199` 后逐条确认：

- [ ] 首页主视觉右侧是一张**真实渲染**的简历（不是图片），下方 FAQ 可展开
- [ ] 「进入工作台」→ 简历列表出现 1 张内置示例卡片
- [ ] 搜索框输入「张三」能过滤；模板下拉切 `timeline` 能过滤；清空后恢复
- [ ] 新建简历：填名字 + 选模板 + 勾选「用示例内容填充」→ 跳转到编辑器
- [ ] 编辑器：改「姓名」→ 右侧预览立即变化；改「标题」输入框 → 顶部标题变化
- [ ] 工作经历：添加一条 → 拖动手柄换序 → 预览顺序同步；点小眼睛隐藏 → 预览消失
- [ ] 富文本：加粗/项目符号生效；`AI 润色` 弹窗点「开始润色」→ 出改动清单 →「应用」写回
- [ ] `语法检查` 弹窗点「开始检查」：对英文文本能列出问题，「应用」就地替换
- [ ] 模块面板：拖动排序、开关显隐、新增/删除自定义模块，预览同步
- [ ] 布局设置：主题色/字体/字号/行高/页边距/模块间距全部实时生效
- [ ] 模板切换：4 套版式差异肉眼可辨；`/app/templates` 缩略图与编辑器一致
- [ ] 撤销/重做按钮 + `Ctrl+Z` / `Ctrl+Shift+Z`（光标在富文本内时由 TipTap 自己处理）
- [ ] 导出 PDF 生成多页 A4；导出 JSON 后可在列表页「导入 JSON」还原
- [ ] 刷新页面数据仍在（localStorage）；设置页显示占用体积，可恢复示例/清空
- [ ] 切英文 → 主要界面文案变化；切暗色 → chrome 变暗，简历纸张仍白底
