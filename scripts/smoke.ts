/**
 * Node 端冒烟测试：不依赖浏览器，用 esbuild 打包后直接跑。
 *   npm run smoke
 * 覆盖：mock 规则引擎、store 行为（CRUD / 撤销 / 拖拽排序 / 自定义模块）、视图模型。
 */
const store = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  },
  configurable: true,
  writable: true,
});

let failures = 0;
const check = (name: string, condition: unknown, detail?: unknown) => {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail === undefined ? "" : ` → ${JSON.stringify(detail)}`}`);
  }
};

const run = async () => {
  const { checkGrammar, polishText, polishHtml } = await import("@/mocks/logic");
  const { useResumeStore } = await import("@/store/useResumeStore");
  const { buildModuleViews } = await import("@/components/templates/views");
  const { createDemoResume } = await import("@/config/initialResumeData");

  console.log("\n[1] mock 规则引擎");
  const grammar = checkGrammar("i have 2 year experiance . This work was more better than before", "en");
  check("检出问题", grammar.issues.length >= 3, grammar.issues.map((i) => i.ruleId));
  check("含重复比较级", grammar.issues.some((i) => i.ruleId === "more-better"));
  check("标点前空格被识别", grammar.issues.some((i) => i.ruleId === "space-before-punctuation"));
  check(
    "matched 可用于回替",
    grammar.issues.every((i) => typeof i.matched === "string" && i.matched.length > 0),
  );

  const polished = polishText("i utilized a lot of tools and it was more better  now");
  check("小写 i 被修正", /^I\b/.test(polished.polished), polished.polished);
  check("utilized → used", polished.polished.includes("used"), polished.polished);
  check("more better → better", !polished.polished.includes("more better"), polished.polished);
  check("双空格被压缩", !polished.polished.includes("  "), polished.polished);

  const htmlPolish = polishHtml(
    "<ul><li>i delivered a lot of features</li><li>i fixed more better bugs</li></ul>",
  );
  check("块级结构保留 <li>", htmlPolish.html.includes("<li>"), htmlPolish.html);
  check("块内文本被润色", htmlPolish.html.includes("I delivered"), htmlPolish.html);
  check("记录了改动", htmlPolish.changes.length > 0, htmlPolish.changes);

  console.log("\n[2] resume store（localStorage + 撤销 + 排序 + 自定义模块）");
  const s = () => useResumeStore.getState();
  const current = () => s().resumes.find((r) => r.id === s().currentResumeId);

  const id = s().addResume("冒烟测试简历");
  check("新建后成为当前简历", s().currentResumeId === id);
  check("初始为空经历列表", current()?.experience.length === 0);

  s().addExperience({ company: "A 公司", position: "工程师" });
  s().addExperience({ company: "B 公司", position: "架构师" });
  s().addExperience({ company: "C 公司", position: "实习生" });
  check("新增 3 条经历", current()?.experience.length === 3);

  const first = current()!.experience[0];
  s().updateExperience(first.id, { company: "A 公司(改)" });
  check("按 id 更新", current()?.experience[0].company === "A 公司(改)");

  const orderBefore = current()!.experience.map((e) => e.company).join(",");
  s().sortExperience(current()!.experience[2].id, current()!.experience[0].id);
  const orderAfter = current()!.experience.map((e) => e.company).join(",");
  check("拖拽排序改变了顺序", orderBefore !== orderAfter, { orderBefore, orderAfter });
  check("排序后 C 在最前", current()!.experience[0].company === "C 公司", current()!.experience.map((e) => e.company));

  s().updateBasicInfo({ name: "李四", layout: "center" });
  check("基本信息写入", current()?.basic.name === "李四" && current()?.basic.layout === "center");

  s().setTemplate("timeline");
  check("模板切换", current()?.templateId === "timeline");

  s().updateSettings({ themeColor: "#123456", baseFontSize: 15 });
  check("globalSettings 合并", current()?.globalSettings.themeColor === "#123456");

  const sectionId = s().addCustomModule("开源贡献");
  s().addCustomItem(sectionId, { title: "vue-x", description: "维护者" });
  check("自定义模块进入菜单序列", current()!.menuSections.some((m) => m.id === sectionId));
  check("自定义条目已写入", (current()?.customData[sectionId]?.length ?? 0) === 1);

  s().toggleModule(sectionId);
  check("模块可隐藏", current()!.menuSections.find((m) => m.id === sectionId)?.enabled === false);
  s().toggleModule(sectionId);
  s().removeCustomModule(sectionId);
  check("自定义模块可删除", !current()!.menuSections.some((m) => m.id === sectionId));

  // 精确验证撤销/重做：关闭 700ms 合并窗口，逐条比对
  const historyId = s().addResume("历史测试");
  const setState = useResumeStore.setState;
  setState({ lastCommitAt: 0 });
  s().updateBasicInfo({ name: "第一版" });
  setState({ lastCommitAt: 0 });
  s().updateBasicInfo({ name: "第二版" });
  check("改名生效", current()?.basic.name === "第二版", current()?.basic.name);
  s().undo(historyId);
  check("撤销回退一次改动", current()?.basic.name === "第一版", current()?.basic.name);
  s().undo(historyId);
  check("再撤销回到初始", current()?.basic.name === "", JSON.stringify(current()?.basic.name));
  s().redo(historyId);
  check("重做前进一次", current()?.basic.name === "第一版", current()?.basic.name);
  s().deleteResume(historyId);

  const beforeDelete = s().resumes.length;
  s().deleteResume(id);
  check("删除生效", s().resumes.length === beforeDelete - 1);

  console.log("\n[3] 视图模型");
  const views = buildModuleViews(createDemoResume());
  check("示例简历产出模块", views.length >= 5, views.map((v) => v.id));
  check("经历条目含 HTML", views.find((v) => v.id === "experience")?.entries[0].html?.includes("<li>") === true);
  check("模板标题为 i18n key", views[0].title.startsWith("module."));

  console.log("\n[4] localStorage 持久化");
  check("persist 写了 storage key", store.has("magic-resume-clone-storage"), [...store.keys()]);
  const persisted = JSON.parse(store.get("magic-resume-clone-storage") ?? "{}");
  check("只持久化 resumes/currentResumeId", Array.isArray(persisted.state?.resumes) && !("past" in (persisted.state ?? {})), Object.keys(persisted.state ?? {}));

  console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
};

void run();
