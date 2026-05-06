const WORDS = ["面孔", "天鹅绒", "教堂", "菊花", "红色"];
const TRAIL_EXPECTED = ["1", "甲", "2", "乙", "3", "丙", "4", "丁", "5", "戊"];
const VIGILANCE_DIGITS = "152945".split("");

const tasks = [
  {
    id: "trail",
    domain: "视空间与执行功能",
    title: "交替连线",
    maxScore: 1,
    type: "trail",
    modality: "画图/点选连线",
    prompt:
      "请按照从数字到汉字并逐渐升高的顺序连线：1 连向甲，再连向 2，一直连到戊。",
    scoring:
      "完全按照 1-甲-2-乙-3-丙-4-丁-5-戊，且没有任何交叉线，给 1 分；出现任何错误且未立刻自我纠正，给 0 分。"
  },
  {
    id: "cube",
    domain: "视空间与执行功能",
    title: "复制立方体",
    maxScore: 1,
    type: "drawing",
    drawingKind: "cube",
    modality: "画图+AI评分",
    prompt: "请照着这幅图，在空白区域尽可能精确地画一遍。",
    scoring:
      "图形为三维结构、所有线存在、无多余线、相对边基本平行且长度基本一致，全部满足给 1 分；任一标准不满足给 0 分。"
  },
  {
    id: "clock",
    domain: "视空间与执行功能",
    title: "画钟表",
    maxScore: 3,
    type: "drawing",
    drawingKind: "clock",
    modality: "画图+AI评分",
    prompt: "请画一个钟表，填上所有数字，并指示出 11 点过 10 分。",
    scoring:
      "轮廓 1 分：表面为圆，允许轻微缺陷；数字 1 分：数字完整、无多余、顺序正确且在所属象限；指针 1 分：两个指针指向正确时间，时针短于分针，中心接近钟表中心。"
  },
  {
    id: "naming",
    domain: "命名",
    title: "动物命名",
    maxScore: 3,
    type: "naming",
    modality: "选择题/可口述",
    prompt: "请从左到右说出或选择每个动物的名字。",
    scoring:
      "每答对一个给 1 分。正确答案依次为：狮子、犀牛、骆驼或单峰骆驼。",
    items: [
      { key: "lion", answer: "狮子", options: ["狮子", "老虎", "豹子", "狐狸"] },
      { key: "rhino", answer: "犀牛", options: ["河马", "犀牛", "水牛", "野猪"] },
      { key: "camel", answer: "骆驼", options: ["长颈鹿", "马", "骆驼", "羊驼"] }
    ]
  },
  {
    id: "memory1",
    domain: "记忆",
    title: "词语学习 第一次",
    maxScore: 0,
    type: "memory",
    modality: "语音/选择记录",
    prompt:
      "我会读几个词，请您注意听并记住。读完后，把记住的词告诉我，想到哪个说哪个。",
    scoring: "第一次学习不计入总分，但记录编码表现和用时。",
    trial: 1
  },
  {
    id: "memory2",
    domain: "记忆",
    title: "词语学习 第二次",
    maxScore: 0,
    type: "memory",
    modality: "语音/选择记录",
    prompt:
      "我把这些词再读一遍。请努力记住，并把刚才和这次记住的词都告诉我。",
    scoring: "第二次学习不计入总分，结束后提示稍后还要回忆这些词。",
    trial: 2
  },
  {
    id: "digitForward",
    domain: "注意",
    title: "数字顺背",
    maxScore: 1,
    type: "choice",
    modality: "语音+选择",
    prompt: "请听数字，读完后按原顺序复述。",
    scoring: "顺背 21854 完全正确给 1 分，否则 0 分。",
    stimulus: "21854",
    options: ["21854", "21584", "81254", "21845"],
    answer: "21854"
  },
  {
    id: "digitBackward",
    domain: "注意",
    title: "数字倒背",
    maxScore: 1,
    type: "choice",
    modality: "语音+选择",
    prompt: "请听数字，但在我读完后，按倒着的顺序复述。",
    scoring: "读出 742，倒背正确答案为 247；完全正确给 1 分，否则 0 分。",
    stimulus: "742",
    options: ["247", "742", "274", "427"],
    answer: "247"
  },
  {
    id: "vigilance",
    domain: "注意",
    title: "听到 1 就敲一下",
    maxScore: 1,
    type: "vigilance",
    modality: "听觉反应",
    prompt: "请听一串数字。每当听到数字 1 时，敲一下按钮；其他数字不要敲。",
    scoring:
      "完全正确或只有一次错误给 1 分；错误数大于或等于 2 给 0 分。错误包括听到 1 未敲、听到其他数字敲。"
  },
  {
    id: "serial7",
    domain: "注意",
    title: "100 连续减 7",
    maxScore: 3,
    type: "serial7",
    modality: "数字输入",
    prompt: "请从 100 中减去 7，再从得数中继续减 7，一直往下算 5 次。",
    scoring:
      "4-5 个正确给 3 分，2-3 个正确给 2 分，1 个正确给 1 分，0 个正确给 0 分。每一步按患者上一答案继续减 7 独立评定。"
  },
  {
    id: "sentence",
    domain: "语言",
    title: "句子复述",
    maxScore: 2,
    type: "sentence",
    modality: "语音/AI评分",
    prompt: "请尽可能原原本本地复述听到的句子。",
    scoring:
      "每句话准确复述给 1 分。省略、替换、增加或语序变化均不得分。",
    sentences: [
      "我只知道今天张亮是帮过忙的人",
      "当狗在房间里的时候，猫总是藏在沙发下"
    ]
  },
  {
    id: "fluency",
    domain: "语言",
    title: "动物词语流畅性",
    maxScore: 1,
    type: "fluency",
    modality: "60秒语音/AI评分",
    prompt: "请在 1 分钟内尽可能多地说出动物的名字。",
    scoring:
      "1 分钟内说出的动物名称不少于 11 个给 1 分，否则 0 分。龙、凤凰、麒麟等神化动物也算正确。"
  },
  {
    id: "abstraction",
    domain: "抽象",
    title: "词语相似性",
    maxScore: 2,
    type: "multiChoice",
    modality: "选择题/可口述",
    prompt: "请说出两样东西在什么方面相类似。",
    scoring:
      "火车-自行车回答运输工具、交通工具或旅行用的给 1 分；手表-尺子回答测量仪器或测量用的给 1 分。具体特征不给分。",
    items: [
      {
        key: "trainBike",
        pair: "火车 - 自行车",
        answer: "交通工具",
        options: ["交通工具", "都有轮子", "都很快", "都用金属做成"]
      },
      {
        key: "watchRuler",
        pair: "手表 - 尺子",
        answer: "测量工具",
        options: ["测量工具", "都有数字", "都能戴在身上", "都是文具"]
      }
    ]
  },
  {
    id: "delayedRecall",
    domain: "延迟回忆",
    title: "无提示延迟回忆",
    maxScore: 5,
    type: "recall",
    modality: "语音/AI评分",
    prompt: "刚才我给您读了几个词，请尽量回忆一下，告诉我这些词都有什么。",
    scoring:
      "只对未经提示自由回忆正确的词给分，每词 1 分；分类提示和多选提示仅记录临床信息，不计分。"
  },
  {
    id: "orientation",
    domain: "定向",
    title: "时间地点定向",
    maxScore: 6,
    type: "orientation",
    modality: "输入/AI评分",
    prompt: "请回答今天的日期，以及现在所在地点和城市。",
    scoring:
      "星期、月份、年份、日期、地点、城市各 1 分。日期必须精确；地点需为医院、诊所、办公室等具体名称。"
  }
];

const root = document.querySelector("#app");
const persisted = localStorage.getItem("moca-game-draft");
const initialState = persisted ? JSON.parse(persisted) : null;
const educationLevels = ["", "小学", "初中", "中专", "高中", "大专", "本科及以上"];

let state =
  initialState || {
    view: "setup",
    activeTaskIndex: 0,
    sessionId: crypto.randomUUID(),
    startedAt: null,
    finishedAt: null,
    participant: {
      name: "",
      age: "",
      sex: "",
      educationLevel: ""
    },
    responses: {},
    drawings: {},
    trail: { sequence: [], errors: 0, undoCount: 0 },
    adminSessions: [],
    selectedSession: null
  };

migrateState();

let activeCanvas = null;
let activeCtx = null;
let drawing = false;
let vigilanceTimer = null;
let fluencyTimer = null;

function saveDraft() {
  localStorage.setItem("moca-game-draft", JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem("moca-game-draft");
  state = {
    view: "setup",
    activeTaskIndex: 0,
    sessionId: crypto.randomUUID(),
    startedAt: null,
    finishedAt: null,
    participant: {
      name: "",
      age: "",
      sex: "",
      educationLevel: ""
    },
    responses: {},
    drawings: {},
    trail: { sequence: [], errors: 0, undoCount: 0 },
    adminSessions: [],
    selectedSession: null
  };
}

function migrateState() {
  state.participant = state.participant || {};
  if (!state.participant.name && state.participant.code) {
    state.participant.name = state.participant.code;
  }
  if (!state.participant.educationLevel && state.participant.educationYears) {
    const years = Number(state.participant.educationYears);
    if (Number.isFinite(years)) {
      if (years <= 6) state.participant.educationLevel = "小学";
      else if (years <= 9) state.participant.educationLevel = "初中";
      else if (years <= 12) state.participant.educationLevel = "高中";
      else if (years <= 15) state.participant.educationLevel = "大专";
      else state.participant.educationLevel = "本科及以上";
    }
  }
  delete state.participant.code;
  delete state.participant.educationYears;
  delete state.participant.expectedPlace;
  delete state.participant.expectedCity;
}

function html(strings, ...values) {
  return strings
    .map((part, index) => `${part}${values[index] ?? ""}`)
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getResponse(taskId) {
  if (!state.responses[taskId]) {
    state.responses[taskId] = {
      taskId,
      startedAt: null,
      endedAt: null,
      durationMs: 0,
      score: 0,
      maxScore: tasks.find((task) => task.id === taskId)?.maxScore || 0,
      answer: {},
      behavior: {}
    };
  }
  return state.responses[taskId];
}

function beginTask(taskId) {
  const response = getResponse(taskId);
  if (!response.startedAt) {
    response.startedAt = new Date().toISOString();
    response.startedTick = Date.now();
  }
}

function finishTask(taskId) {
  const response = getResponse(taskId);
  if (!response.startedAt) beginTask(taskId);
  response.endedAt = new Date().toISOString();
  const previous = response.durationMs || 0;
  const current = response.startedTick ? Date.now() - response.startedTick : 0;
  response.durationMs = Math.max(previous, current);
  response.submitted = true;
  delete response.startedTick;
}

function formatMs(ms) {
  if (!ms) return "0秒";
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes ? `${minutes}分${seconds}秒` : `${seconds}秒`;
}

function todayParts() {
  const now = new Date();
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1),
    day: String(now.getDate()),
    weekday: weekdays[now.getDay()]
  };
}

function speakText(text, spell = false) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(spell ? text.split("").join(" ") : text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function render() {
  saveDraft();
  if (state.view === "setup") {
    root.innerHTML = renderSetup();
    return;
  }

  const current = tasks[state.activeTaskIndex];
  if (state.view === "test") beginTask(current.id);
  root.innerHTML = renderShell(current);
  if (state.view === "test") {
    setupCurrentTask(current);
  }
}

function renderSetup() {
  return html`
    <div class="setup-screen">
      <section class="setup-panel">
        <div class="brand-row">
          <div class="mascot" aria-hidden="true">
            <span></span>
          </div>
          <div>
            <p class="eyebrow">基层老年认知筛查</p>
            <h1>参加者登录</h1>
          </div>
        </div>
        <div class="setup-grid">
          ${inputField("participant.name", "参加者姓名", state.participant.name, "")}
          ${inputField("participant.age", "年龄", state.participant.age, "", "number")}
          ${selectField("participant.sex", "性别", state.participant.sex, ["", "男", "女"])}
          ${selectField("participant.educationLevel", "教育水平", state.participant.educationLevel, educationLevels)}
        </div>
        <div class="setup-actions">
          <button class="primary" data-action="startSession">开始测评</button>
          <button class="ghost" data-action="openDesign">查看技术细节</button>
        </div>
        <p class="fineprint">原型按附件 MoCA 中文版题目和分值映射实现；正式研究需进行授权、伦理审查、设备一致性和常模校准。</p>
      </section>
    </div>
  `;
}

function inputField(path, label, value, placeholder, type = "text") {
  return html`
    <label class="field">
      <span>${label}</span>
      <input data-bind="${path}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function selectField(path, label, value, options) {
  return html`
    <label class="field">
      <span>${label}</span>
      <select data-bind="${path}">
        ${options
          .map(
            (option) =>
              `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${option || "请选择"}</option>`
          )
          .join("")}
      </select>
    </label>
  `;
}

function renderShell(current) {
  const totals = computeTotals();
  const sidebarMetric =
    state.view === "test"
      ? { value: state.activeTaskIndex + 1, suffix: `/${tasks.length}`, label: "进度" }
      : { value: totals.totalScore, suffix: "/30", label: "总分" };
  return html`
    <div class="app-shell">
      <aside class="sidebar">
        <div class="mini-brand">
          <div class="mascot small" aria-hidden="true"><span></span></div>
          <div>
            <strong>MoCA Quest</strong>
            <span>${escapeHtml(state.participant.name || "未填写姓名")}</span>
          </div>
        </div>
        <div class="score-orb">
          <em>${sidebarMetric.label}</em>
          <span>${sidebarMetric.value}</span>
          <small>${sidebarMetric.suffix}</small>
        </div>
        <nav class="task-list">
          ${tasks.map((task, index) => renderTaskNav(task, index)).join("")}
        </nav>
      </aside>
      <main class="main-panel">
        <header class="topbar">
          <div>
            <p class="eyebrow">${escapeHtml(current.domain)} · ${escapeHtml(current.modality)}</p>
            <h2>${state.view === "test" ? escapeHtml(current.title) : viewTitle()}</h2>
          </div>
          <div class="top-actions">
            <button class="${state.view === "test" ? "selected" : "ghost"}" data-action="navView" data-view="test">任务</button>
            <button class="${state.view === "results" ? "selected" : "ghost"}" data-action="navView" data-view="results">结果</button>
            <button class="${state.view === "admin" ? "selected" : "ghost"}" data-action="navView" data-view="admin">后台</button>
            <button class="${state.view === "design" ? "selected" : "ghost"}" data-action="navView" data-view="design">技术细节</button>
            <button class="ghost" data-action="newSession">登录页</button>
          </div>
        </header>
        ${renderMainView(current)}
      </main>
    </div>
  `;
}

function viewTitle() {
  if (state.view === "results") return "测评结果";
  if (state.view === "admin") return "后台数据库";
  if (state.view === "design") return "游戏设计技术细节";
  return "任务";
}

function renderTaskNav(task, index) {
  const response = state.responses[task.id];
  const done = response?.submitted;
  const active = state.view === "test" && index === state.activeTaskIndex;
  return html`
    <button class="task-pill ${active ? "active" : ""} ${done ? "done" : ""}" data-action="selectTask" data-index="${index}">
      <span>${index + 1}</span>
      <strong>${escapeHtml(task.title)}</strong>
      <small>${done ? "已完成" : "待完成"}</small>
    </button>
  `;
}

function renderMainView(current) {
  if (state.view === "results") return renderResults();
  if (state.view === "admin") return renderAdmin();
  if (state.view === "design") return renderDesign();
  return renderTask(current);
}

function renderTask(task) {
  const progress = Math.round(((state.activeTaskIndex + 1) / tasks.length) * 100);
  return html`
    <section class="task-stage">
      <div class="progress-track"><span style="width:${progress}%"></span></div>
      <article class="task-card">
        <div class="task-copy">
          <p class="domain-badge">${escapeHtml(task.domain)}</p>
          <h3>${escapeHtml(task.title)}</h3>
          <p class="prompt">${escapeHtml(task.prompt)}</p>
        </div>
        <div class="task-workspace">
          ${renderTaskWorkspace(task)}
        </div>
      </article>
      <footer class="task-footer">
        <button class="ghost" data-action="previousTask" ${state.activeTaskIndex === 0 ? "disabled" : ""}>上一题</button>
        <div class="footer-score">${renderResponseStatus(task)}</div>
        <button class="primary" data-action="nextTask">${state.activeTaskIndex === tasks.length - 1 ? "查看结果" : "下一题"}</button>
      </footer>
    </section>
  `;
}

function renderResponseStatus(task) {
  const response = getResponse(task.id);
  const duration = response.durationMs || (response.startedTick ? Date.now() - response.startedTick : 0);
  return `用时 ${formatMs(duration)}`;
}

function renderTaskWorkspace(task) {
  if (task.type === "trail") return renderTrailTask(task);
  if (task.type === "drawing") return renderDrawingTask(task);
  if (task.type === "naming") return renderNamingTask(task);
  if (task.type === "memory") return renderMemoryTask(task);
  if (task.type === "choice") return renderChoiceTask(task);
  if (task.type === "vigilance") return renderVigilanceTask(task);
  if (task.type === "serial7") return renderSerial7Task(task);
  if (task.type === "sentence") return renderSentenceTask(task);
  if (task.type === "fluency") return renderFluencyTask(task);
  if (task.type === "multiChoice") return renderMultiChoiceTask(task);
  if (task.type === "recall") return renderRecallTask(task);
  if (task.type === "orientation") return renderOrientationTask(task);
  return "";
}

function renderTrailTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="canvas-shell trail-shell">
      <canvas id="taskCanvas" class="task-canvas" aria-label="交替连线画图区域"></canvas>
    </div>
    <div class="control-row">
      <button class="ghost" data-action="undoTrail">撤销一步</button>
      <button class="ghost" data-action="clearTrail">清空</button>
    </div>
    <div class="score-editor">
      <span>序列：${state.trail.sequence.join(" - ") || "未连线"}</span>
    </div>
  `;
}

function renderDrawingTask(task) {
  const response = getResponse(task.id);
  const drawingClass = task.drawingKind === "cube" ? "drawing-layout" : "drawing-layout no-reference";
  return html`
    <div class="${drawingClass}">
      ${task.drawingKind === "cube" ? `<div class="reference-panel">${cubeReferenceSvg()}</div>` : ""}
      <div class="canvas-shell">
        <canvas id="taskCanvas" class="task-canvas" aria-label="${escapeHtml(task.title)}画图区域"></canvas>
      </div>
    </div>
    <div class="control-row">
      <button class="ghost" data-action="clearDrawing">清空画布</button>
    </div>
  `;
}

function renderNamingTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="animal-grid">
      ${task.items
        .map(
          (item) => html`
            <section class="animal-card">
              ${animalSvg(item.key)}
              <div class="option-grid">
                ${item.options
                  .map(
                    (option) => `
                      <button class="option ${response.answer?.[item.key] === option ? "picked" : ""}" data-action="answerSubitem" data-key="${item.key}" data-value="${escapeHtml(option)}">
                        ${escapeHtml(option)}
                      </button>`
                  )
                  .join("")}
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderMemoryTask(task) {
  const response = getResponse(task.id);
  const remembered = response.answer?.remembered || [];
  const distractors = ["学校", "蓝色", "棉布", "鼻子", "牡丹"];
  return html`
    <div class="memory-panel">
      <button class="primary" data-action="speakWords">播放五个词</button>
      <div class="word-ribbon">
        ${WORDS.map((word) => `<span>${word}</span>`).join("")}
      </div>
      <p class="assessor-only">记录本轮立即回忆到的词；该项不计入 MoCA 总分。</p>
      <div class="choice-bank">
        ${WORDS.concat(distractors)
          .map(
            (word) => `
              <button class="option ${remembered.includes(word) ? "picked" : ""}" data-action="toggleMemoryWord" data-word="${word}">
                ${word}
              </button>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderChoiceTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="listening-card">
      <div class="digit-chip">${task.stimulus.split("").join(" ")}</div>
      <button class="primary" data-action="speakStimulus">播放数字</button>
    </div>
    <div class="option-grid wide">
      ${task.options
        .map(
          (option) => `
            <button class="option ${response.answer?.value === option ? "picked" : ""}" data-action="answerValue" data-value="${option}">
              ${option.split("").join(" - ")}
            </button>`
        )
        .join("")}
    </div>
  `;
}

function renderVigilanceTask(task) {
  const response = getResponse(task.id);
  const taps = response.answer?.taps || [];
  const status = response.answer?.running ? "播放中" : "待播放";
  return html`
    <div class="vigilance-board">
      <div class="digit-stream">${VIGILANCE_DIGITS.map((digit) => `<span>${digit}</span>`).join("")}</div>
      <div class="control-row centered">
        <button class="primary" data-action="startVigilance">开始播放</button>
        <button class="tap-button" data-action="tapVigilance">敲一下</button>
      </div>
      <div class="score-editor">
        <span>状态：${status}</span>
        <span>已敲 ${taps.length} 次</span>
      </div>
    </div>
  `;
}

function renderSerial7Task(task) {
  const response = getResponse(task.id);
  const values = response.answer?.values || ["", "", "", "", ""];
  return html`
    <div class="serial-row">
      ${values
        .map(
          (value, index) => `
            <label class="number-step">
              <span>第 ${index + 1} 次</span>
              <input inputmode="numeric" data-serial-index="${index}" value="${escapeHtml(value)}" />
            </label>`
        )
        .join("")}
    </div>
    <div class="score-editor">
      <span>请按顺序填写每一次的结果</span>
    </div>
  `;
}

function renderSentenceTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="sentence-list">
      ${task.sentences
        .map(
          (sentence, index) => `
            <section class="sentence-card">
              <button class="primary" data-action="speakSentence" data-index="${index}">播放第 ${index + 1} 句</button>
              <textarea data-transcript-index="${index}" placeholder="语音识别转写内容">${escapeHtml(response.answer?.transcript?.[index] || "")}</textarea>
            </section>`
        )
        .join("")}
    </div>
  `;
}

function renderFluencyTask(task) {
  const response = getResponse(task.id);
  const animals = response.answer?.animals || [];
  const remaining = response.answer?.remaining ?? 60;
  return html`
    <div class="fluency-panel">
      <div class="timer-face">${remaining}</div>
      <div class="control-row centered">
        <button class="primary" data-action="startFluency">开始60秒</button>
        <input id="animalInput" placeholder="输入听到的动物名" />
        <button class="secondary" data-action="addAnimal">添加</button>
      </div>
      <div class="animal-tags">
        ${animals.map((animal) => `<button data-action="removeAnimal" data-word="${escapeHtml(animal)}">${escapeHtml(animal)}</button>`).join("")}
      </div>
      <div class="score-editor">
        <span>已记录 ${animals.length} 个</span>
      </div>
    </div>
  `;
}

function renderMultiChoiceTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="abstract-panel">
      <div class="practice-card">
        <span>练习</span>
        <strong>香蕉 - 桔子 = 水果</strong>
      </div>
      ${task.items
        .map(
          (item) => `
            <section class="abstract-card">
              <h4>${item.pair}</h4>
              <div class="option-grid">
                ${item.options
                  .map(
                    (option) => `
                      <button class="option ${response.answer?.[item.key] === option ? "picked" : ""}" data-action="answerSubitem" data-key="${item.key}" data-value="${escapeHtml(option)}">
                        ${escapeHtml(option)}
                      </button>`
                  )
                  .join("")}
              </div>
            </section>`
        )
        .join("")}
    </div>
  `;
}

function renderRecallTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="recall-ai-panel">
      <textarea data-recall-free-text placeholder="语音识别转写：请记录参加者无提示自由回忆的内容">${escapeHtml(response.answer?.freeText || "")}</textarea>
    </div>
  `;
}

function renderOrientationTask(task) {
  const response = getResponse(task.id);
  const answer = response.answer || {};
  return html`
    <div class="orientation-grid">
      ${orientationInput("weekday", "星期", answer.weekday, "如 星期三")}
      ${orientationInput("month", "月份", answer.month, "如 5")}
      ${orientationInput("year", "年份", answer.year, "如 2026")}
      ${orientationInput("day", "日期", answer.day, "如 6")}
      ${orientationInput("place", "地点", answer.place, "请输入具体地点")}
      ${orientationInput("city", "城市", answer.city, "请输入所在城市")}
    </div>
    <div class="score-editor">
      <span>请按实际回答填写</span>
    </div>
  `;
}

function orientationInput(key, label, value, placeholder) {
  return html`
    <label class="field">
      <span>${label}</span>
      <input data-orientation-key="${key}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function renderResults() {
  const totals = computeTotals();
  return html`
    <section class="results-grid">
      <div class="result-hero">
        <p class="eyebrow">总分</p>
        <strong>${totals.totalScore}</strong>
        <span>/30</span>
        <p>${totals.riskBand}</p>
      </div>
      <div class="domain-table">
        ${Object.entries(totals.domainScores)
          .map(([domain, value]) => `<div><span>${domain}</span><strong>${value.score}/${value.max}</strong></div>`)
          .join("")}
      </div>
      <div class="metric-strip">
        <div><span>原始分</span><strong>${totals.rawScore}</strong></div>
        <div><span>教育加分</span><strong>${totals.educationBonus}</strong></div>
        <div><span>总用时</span><strong>${formatMs(totals.totalDurationMs)}</strong></div>
        <div><span>完成题数</span><strong>${totals.completed}/${tasks.length}</strong></div>
      </div>
      <div class="control-row">
        <button class="primary" data-action="saveSession">保存到后台数据库</button>
        <button class="ghost" data-action="newSession">新测评</button>
      </div>
    </section>
  `;
}

function renderAdmin() {
  return html`
    <section class="admin-layout">
      <div class="admin-toolbar">
        <button class="primary" data-action="loadSessions">刷新数据库</button>
        <button class="secondary" data-action="saveSession">保存当前测评</button>
      </div>
      <div class="admin-table">
        <div class="admin-head">
          <span>参加者</span><span>总分</span><span>原始分</span><span>总用时</span><span>保存时间</span>
        </div>
        ${(state.adminSessions || [])
          .map(
            (session) => `
              <button class="admin-row" data-action="selectSavedSession" data-id="${session.id}">
                <span>${escapeHtml(session.participant?.name || session.participant?.code || session.id.slice(0, 8))}</span>
                <strong>${session.totalScore ?? "-"}/30</strong>
                <span>${session.rawScore ?? "-"}</span>
                <span>${formatMs(session.totalDurationMs)}</span>
                <span>${session.finishedAt ? new Date(session.finishedAt).toLocaleString() : "-"}</span>
              </button>`
          )
          .join("") || `<p class="empty">暂无保存记录</p>`}
      </div>
      <pre class="json-preview">${escapeHtml(state.selectedSession ? JSON.stringify(state.selectedSession, null, 2) : databaseSchemaText())}</pre>
    </section>
  `;
}

function renderDesign() {
  return html`
    <section class="design-layout">
      <div class="design-note">
        <h3>核心设计</h3>
        <p>每道题是一张任务卡，保留附件 MoCA 的指导语、题目和分值。选择题用于降低平板操作负担；画图、复述、流畅性、延迟回忆和定向题提交后由 AI 直接评分。</p>
        <p>改变题型会影响 MoCA 原常模，研究版需要与纸笔标准版并测，建立等值、信度和阈值。</p>
      </div>
      <div class="design-table">
        ${tasks
          .map(
            (task) => `
              <article>
                <span>${task.domain}</span>
                <h4>${task.title} · ${task.maxScore}分</h4>
                <p><strong>题型：</strong>${task.modality}</p>
                <p><strong>提示：</strong>${task.prompt}</p>
                <p><strong>评分：</strong>${task.scoring}</p>
              </article>`
          )
          .join("")}
      </div>
    </section>
  `;
}

function databaseSchemaText() {
  return `后台数据库字段
sessions:
  id, participant, startedAt, finishedAt, totalDurationMs
  rawScore, educationBonus, totalScore, riskBand
  itemResponses[]

itemResponses:
  taskId, domain, title, modality, maxScore, score
  startedAt, endedAt, durationMs
  answer, behavior, drawingImage, ai

behavior:
  taps, strokes, undoCount, sequence, errors, timerEvents

AI评分接口:
  POST /api/ai-score
  body: { taskId, image, answer, rubric, maxScore, clientAutoScore }
  response: { scoreSuggestion, confidence, requiresHumanReview, comment }`;
}

function setupCurrentTask(task) {
  if (task.type === "drawing") setupFreeCanvas(task);
  if (task.type === "trail") setupTrailCanvas(task);
}

function setupFreeCanvas(task) {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  activeCanvas = canvas;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  activeCtx = canvas.getContext("2d");
  activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  activeCtx.lineCap = "round";
  activeCtx.lineJoin = "round";
  activeCtx.lineWidth = 4;
  activeCtx.strokeStyle = "#243447";
  activeCtx.fillStyle = "#fffdf7";
  activeCtx.fillRect(0, 0, rect.width, rect.height);

  if (state.drawings[task.id]) {
    const image = new Image();
    image.onload = () => activeCtx.drawImage(image, 0, 0, rect.width, rect.height);
    image.src = state.drawings[task.id];
  }

  canvas.onpointerdown = (event) => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    const point = canvasPoint(event, canvas);
    activeCtx.beginPath();
    activeCtx.moveTo(point.x, point.y);
    const response = getResponse(task.id);
    response.behavior.strokes = (response.behavior.strokes || 0) + 1;
  };
  canvas.onpointermove = (event) => {
    if (!drawing) return;
    const point = canvasPoint(event, canvas);
    activeCtx.lineTo(point.x, point.y);
    activeCtx.stroke();
  };
  canvas.onpointerup = (event) => {
    drawing = false;
    canvas.releasePointerCapture(event.pointerId);
    state.drawings[task.id] = canvas.toDataURL("image/png");
    saveDraft();
  };
}

function setupTrailCanvas(task) {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  activeCanvas = canvas;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  activeCtx = canvas.getContext("2d");
  activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawTrailCanvas(canvas);
  canvas.onpointerdown = (event) => {
    const point = canvasPoint(event, canvas);
    const node = nearestTrailNode(point, canvas);
    if (!node) return;
    const expected = TRAIL_EXPECTED[state.trail.sequence.length];
    if (node.label !== expected) state.trail.errors += 1;
    state.trail.sequence.push(node.label);
    const response = getResponse(task.id);
    response.behavior.sequence = [...state.trail.sequence];
    response.behavior.errors = state.trail.errors;
    drawTrailCanvas(canvas);
    state.drawings[task.id] = canvas.toDataURL("image/png");
    saveDraft();
    render();
  };
}

function drawTrailCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  activeCtx.clearRect(0, 0, rect.width, rect.height);
  activeCtx.fillStyle = "#fffdf7";
  activeCtx.fillRect(0, 0, rect.width, rect.height);
  activeCtx.setLineDash([10, 8]);
  activeCtx.strokeStyle = "#8fa1b3";
  activeCtx.lineWidth = 2;
  activeCtx.strokeRect(14, 14, rect.width - 28, rect.height - 28);
  activeCtx.setLineDash([]);

  const nodes = trailNodes(canvas);
  activeCtx.strokeStyle = "#20a66b";
  activeCtx.lineWidth = 5;
  activeCtx.beginPath();
  state.trail.sequence.forEach((label, index) => {
    const node = nodes.find((entry) => entry.label === label);
    if (!node) return;
    if (index === 0) activeCtx.moveTo(node.x, node.y);
    else activeCtx.lineTo(node.x, node.y);
  });
  activeCtx.stroke();

  nodes.forEach((node) => {
    activeCtx.beginPath();
    activeCtx.fillStyle = "#ffffff";
    activeCtx.strokeStyle = state.trail.sequence.includes(node.label) ? "#20a66b" : "#243447";
    activeCtx.lineWidth = 3;
    activeCtx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    activeCtx.fill();
    activeCtx.stroke();
    activeCtx.fillStyle = "#243447";
    activeCtx.font = "700 22px system-ui";
    activeCtx.textAlign = "center";
    activeCtx.textBaseline = "middle";
    activeCtx.fillText(node.label, node.x, node.y);
  });

  activeCtx.font = "600 16px system-ui";
  activeCtx.fillStyle = "#718094";
  const start = nodes.find((node) => node.label === "1");
  const end = nodes.find((node) => node.label === "5");
  activeCtx.fillText("开始", start.x, start.y + start.r + 18);
  activeCtx.fillText("结束", end.x, end.y + end.r + 18);
}

function trailNodes(canvas) {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const points = [
    ["戊", 0.28, 0.15],
    ["甲", 0.55, 0.15],
    ["5", 0.12, 0.26],
    ["2", 0.82, 0.32],
    ["乙", 0.55, 0.43],
    ["1", 0.28, 0.51],
    ["丁", 0.12, 0.70],
    ["4", 0.50, 0.66],
    ["3", 0.78, 0.80],
    ["丙", 0.28, 0.86]
  ];
  return points.map(([label, x, y]) => ({ label, x: x * w, y: y * h, r: 26 }));
}

function nearestTrailNode(point, canvas) {
  return trailNodes(canvas).find((node) => {
    const dx = point.x - node.x;
    const dy = point.y - node.y;
    return Math.sqrt(dx * dx + dy * dy) <= node.r + 10;
  });
}

function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function captureCanvas(taskId) {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return state.drawings[taskId] || null;
  const image = canvas.toDataURL("image/png");
  state.drawings[taskId] = image;
  return image;
}

async function uploadDrawingForTask(task) {
  await scoreTaskWithAi(task, { renderAfter: true });
}

async function scoreTaskWithAi(task, { renderAfter = false } = {}) {
  const image = task.type === "drawing" || task.type === "trail" ? captureCanvas(task.id) : null;
  const response = getResponse(task.id);
  const clientAutoScore = clientAutoScoreForAi(task, response);
  const result = await fetch("/api/ai-score", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      taskId: task.id,
      taskType: task.type,
      image,
      answer: response.answer,
      rubric: task.scoring,
      maxScore: task.maxScore,
      clientAutoScore
    })
  }).then((entry) => entry.json());
  response.ai = result;
  if (image) response.drawingImage = image;
  response.score = computeTaskScore(task, response);
  saveDraft();
  if (renderAfter) render();
}

function needsAiScore(task) {
  return ["trail", "drawing", "sentence", "fluency", "recall", "orientation"].includes(task.type);
}

function clientAutoScoreForAi(task, response) {
  if (task.type === "trail") return scoreTrail().score;
  if (task.type === "sentence") return scoreSentenceTranscript(task, response);
  if (task.type === "fluency") return uniqueWords(response.answer?.animals || []).length >= 11 ? 1 : 0;
  if (task.type === "recall") return scoreRecallText(response);
  if (task.type === "orientation") return scoreOrientationByInputs(response);
  return null;
}

function scoreTrail() {
  const exact =
    state.trail.sequence.length === TRAIL_EXPECTED.length &&
    state.trail.sequence.every((label, index) => label === TRAIL_EXPECTED[index]);
  const crossings = trailHasCrossing();
  return {
    score: exact && !crossings ? 1 : 0,
    exact,
    crossings
  };
}

function trailHasCrossing() {
  if (state.trail.sequence.length < 4) return false;
  const canvas = activeCanvas || document.querySelector("#taskCanvas");
  if (!canvas) return false;
  const nodes = trailNodes(canvas);
  const points = state.trail.sequence
    .map((label) => nodes.find((node) => node.label === label))
    .filter(Boolean);
  for (let i = 0; i < points.length - 1; i += 1) {
    for (let j = i + 2; j < points.length - 1; j += 1) {
      if (j === i + 1) continue;
      if (segmentsIntersect(points[i], points[i + 1], points[j], points[j + 1])) return true;
    }
  }
  return false;
}

function segmentsIntersect(a, b, c, d) {
  const det = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const abC = det(a, b, c);
  const abD = det(a, b, d);
  const cdA = det(c, d, a);
  const cdB = det(c, d, b);
  return abC * abD < 0 && cdA * cdB < 0;
}

function computeTaskScore(task, response = getResponse(task.id)) {
  const aiScore = aiScoreValue(task, response);
  if (task.type === "trail") return scoreTrail().score;
  if (task.id === "cube" || task.id === "clock") return aiScore ?? 0;
  if (task.type === "naming") {
    return task.items.reduce((sum, item) => sum + (response.answer?.[item.key] === item.answer ? 1 : 0), 0);
  }
  if (task.type === "memory") return 0;
  if (task.type === "choice") return response.answer?.value === task.answer ? 1 : 0;
  if (task.type === "vigilance") return scoreVigilance(response);
  if (task.type === "serial7") return scoreSerial7(response).score;
  if (task.type === "sentence") return aiScore ?? 0;
  if (task.type === "fluency") {
    return aiScore ?? (uniqueWords(response.answer?.animals || []).length >= 11 ? 1 : 0);
  }
  if (task.type === "multiChoice") {
    return task.items.reduce((sum, item) => sum + (response.answer?.[item.key] === item.answer ? 1 : 0), 0);
  }
  if (task.type === "recall") return aiScore ?? 0;
  if (task.type === "orientation") return aiScore ?? 0;
  return 0;
}

function aiScoreValue(task, response) {
  const value = response.ai?.scoreSuggestion;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(task.maxScore, Math.round(value)));
}

function scoreVigilance(response) {
  const taps = response.answer?.taps || [];
  const startedAt = response.answer?.startedAt || 0;
  if (!startedAt) return 0;
  const expectedWindows = VIGILANCE_DIGITS.map((digit, index) => ({
    digit,
    start: startedAt + index * 1000,
    end: startedAt + index * 1000 + 850
  })).filter((entry) => entry.digit === "1");
  let misses = 0;
  let hits = 0;
  expectedWindows.forEach((window) => {
    const matched = taps.some((tap) => tap >= window.start && tap <= window.end);
    if (matched) hits += 1;
    else misses += 1;
  });
  const falseTaps = taps.filter(
    (tap) => !expectedWindows.some((window) => tap >= window.start && tap <= window.end)
  ).length;
  const errors = misses + falseTaps;
  response.behavior.vigilance = { hits, misses, falseTaps, errors };
  return errors >= 2 ? 0 : 1;
}

function scoreSerial7(response) {
  const values = (response.answer?.values || []).map((value) => Number(value));
  let correct = 0;
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) return;
    if (index === 0) {
      if (value === 93) correct += 1;
      return;
    }
    const prev = values[index - 1];
    if (Number.isFinite(prev) && value === prev - 7) correct += 1;
  });
  const score = correct >= 4 ? 3 : correct >= 2 ? 2 : correct === 1 ? 1 : 0;
  response.behavior.serial7CorrectSteps = correct;
  return { correct, score };
}

function scoreSentenceTranscript(task, response) {
  const transcript = response.answer?.transcript || {};
  return task.sentences.reduce((sum, sentence, index) => {
    return sum + (normalizeText(transcript[index]) === normalizeText(sentence) ? 1 : 0);
  }, 0);
}

function scoreRecallText(response) {
  const text = normalizeText(response.answer?.freeText || "");
  return WORDS.reduce((sum, word) => sum + (text.includes(normalizeText(word)) ? 1 : 0), 0);
}

function scoreOrientationByInputs(response) {
  const answer = response.answer || {};
  const today = todayParts();
  let score = 0;
  if (normalizeText(answer.weekday) === normalizeText(today.weekday)) score += 1;
  if (String(Number(answer.month)) === today.month) score += 1;
  if (String(Number(answer.year)) === today.year) score += 1;
  if (String(Number(answer.day)) === today.day) score += 1;
  if (normalizeText(answer.place)) score += 1;
  if (normalizeText(answer.city)) score += 1;
  return score;
}

function normalizeText(text) {
  return String(text || "").replace(/\s/g, "").replace(/市$/, "");
}

function uniqueWords(words) {
  return [...new Set(words.map((word) => normalizeText(word)).filter(Boolean))];
}

function computeTotals() {
  const domainScores = {};
  let rawScore = 0;
  let completed = 0;
  tasks.forEach((task) => {
    const response = getResponse(task.id);
    const score = computeTaskScore(task, response);
    response.score = score;
    response.maxScore = task.maxScore;
    if (!domainScores[task.domain]) domainScores[task.domain] = { score: 0, max: 0 };
    domainScores[task.domain].score += score;
    domainScores[task.domain].max += task.maxScore;
    rawScore += score;
    if (response.submitted) completed += 1;
  });
  const educationBonus = educationBonusForLevel(state.participant.educationLevel);
  const totalScore = Math.min(30, rawScore + educationBonus);
  const durations = Object.values(state.responses).map((response) => response.durationMs || 0);
  const totalDurationMs = durations.reduce((sum, value) => sum + value, 0);
  return {
    rawScore,
    educationBonus,
    totalScore,
    totalDurationMs,
    completed,
    domainScores,
    riskBand: totalScore >= 26 ? "正常范围（附件阈值 ≥26）" : "低于 26 分，建议进一步评估"
  };
}

function educationBonusForLevel(level) {
  return ["小学", "初中", "中专", "高中"].includes(level) ? 1 : 0;
}

function buildSessionPayload() {
  const totals = computeTotals();
  const now = new Date().toISOString();
  return {
    id: state.sessionId,
    participant: state.participant,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt || now,
    totalDurationMs: totals.totalDurationMs,
    rawScore: totals.rawScore,
    educationBonus: totals.educationBonus,
    totalScore: totals.totalScore,
    riskBand: totals.riskBand,
    domainScores: totals.domainScores,
    itemResponses: tasks.map((task) => {
      const response = getResponse(task.id);
      return {
        taskId: task.id,
        domain: task.domain,
        title: task.title,
        modality: task.modality,
        maxScore: task.maxScore,
        score: computeTaskScore(task, response),
        startedAt: response.startedAt,
        endedAt: response.endedAt,
        durationMs: response.durationMs,
        answer: response.answer,
        behavior: response.behavior,
        drawingImage: response.drawingImage || state.drawings[task.id],
        ai: response.ai
      };
    })
  };
}

function cubeReferenceSvg() {
  return `
    <svg class="reference-svg" viewBox="0 0 220 180" role="img" aria-label="立方体参考图">
      <path d="M58 58 L140 58 L176 24 L94 24 Z" fill="#f7fbff" stroke="#243447" stroke-width="5" />
      <path d="M140 58 L176 24 L176 112 L140 150 Z" fill="#d6dee8" stroke="#243447" stroke-width="5" />
      <path d="M58 58 L140 58 L140 150 L58 150 Z" fill="#ffffff" stroke="#243447" stroke-width="5" />
    </svg>
  `;
}

function animalSvg(key) {
  if (key === "lion") {
    return `
      <svg class="animal-svg" viewBox="0 0 240 170" role="img" aria-label="狮子">
        <circle cx="86" cy="72" r="48" fill="#f5a623"/>
        <circle cx="86" cy="72" r="34" fill="#ffd46b"/>
        <rect x="104" y="82" width="82" height="42" rx="21" fill="#f4bd5f"/>
        <path d="M180 87 C207 68 216 100 192 105" fill="none" stroke="#c47b2d" stroke-width="8" stroke-linecap="round"/>
        <circle cx="75" cy="66" r="5" fill="#243447"/><circle cx="99" cy="66" r="5" fill="#243447"/>
        <path d="M86 75 L78 89 L95 89 Z" fill="#9c5a2d"/>
        <path d="M56 122 L56 148 M124 122 L124 148 M157 122 L157 148" stroke="#9c5a2d" stroke-width="8" stroke-linecap="round"/>
      </svg>`;
  }
  if (key === "rhino") {
    return `
      <svg class="animal-svg" viewBox="0 0 240 170" role="img" aria-label="犀牛">
        <rect x="54" y="70" width="120" height="58" rx="27" fill="#b7c4ca"/>
        <circle cx="174" cy="78" r="29" fill="#cbd5da"/>
        <path d="M192 72 L224 58 L198 86 Z" fill="#f4efe4" stroke="#70808b" stroke-width="4"/>
        <path d="M69 70 C78 46 99 49 102 70" fill="#9facb3"/>
        <circle cx="180" cy="75" r="5" fill="#243447"/>
        <path d="M76 125 L70 150 M111 127 L108 150 M151 126 L158 150" stroke="#70808b" stroke-width="9" stroke-linecap="round"/>
      </svg>`;
  }
  return `
    <svg class="animal-svg" viewBox="0 0 240 170" role="img" aria-label="骆驼">
      <path d="M62 110 C70 70 88 70 100 104 C109 72 132 70 144 110 L182 110 C174 82 183 55 205 48 C217 45 222 56 214 66 C202 80 199 96 202 110 L212 110 L212 125 L52 125 Z" fill="#d69a55"/>
      <circle cx="205" cy="49" r="17" fill="#d69a55"/>
      <circle cx="210" cy="46" r="4" fill="#243447"/>
      <path d="M70 122 L64 150 M108 122 L104 150 M152 122 L156 150 M196 122 L202 150" stroke="#9c6639" stroke-width="8" stroke-linecap="round"/>
    </svg>`;
}

root.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const current = tasks[state.activeTaskIndex];

  if (action === "startSession") {
    state.startedAt = new Date().toISOString();
    state.view = "test";
    render();
  }
  if (action === "openDesign") {
    state.startedAt = state.startedAt || new Date().toISOString();
    state.view = "design";
    render();
  }
  if (action === "navView") {
    state.view = target.dataset.view;
    if (state.view === "admin") await loadSessions(false);
    render();
  }
  if (action === "selectTask") {
    state.activeTaskIndex = Number(target.dataset.index);
    state.view = "test";
    render();
  }
  if (action === "previousTask") {
    state.activeTaskIndex = Math.max(0, state.activeTaskIndex - 1);
    render();
  }
  if (action === "nextTask") {
    await submitActiveTask(false);
    if (state.activeTaskIndex === tasks.length - 1) {
      state.view = "results";
      state.finishedAt = new Date().toISOString();
    } else {
      state.activeTaskIndex += 1;
    }
    render();
  }
  if (action === "answerSubitem") {
    const response = getResponse(current.id);
    response.answer[target.dataset.key] = target.dataset.value;
    render();
  }
  if (action === "answerValue") {
    const response = getResponse(current.id);
    response.answer.value = target.dataset.value;
    render();
  }
  if (action === "speakWords") speakText(WORDS.join("，"));
  if (action === "speakStimulus") speakText(current.stimulus, true);
  if (action === "speakSentence") speakText(current.sentences[Number(target.dataset.index)]);
  if (action === "toggleMemoryWord") {
    const response = getResponse(current.id);
    response.answer.remembered = toggleValue(response.answer.remembered || [], target.dataset.word);
    render();
  }
  if (action === "uploadDrawing") {
    await uploadDrawingForTask(current);
  }
  if (action === "clearDrawing") {
    delete state.drawings[current.id];
    const response = getResponse(current.id);
    delete response.drawingImage;
    render();
  }
  if (action === "undoTrail") {
    state.trail.sequence.pop();
    state.trail.undoCount += 1;
    render();
  }
  if (action === "clearTrail") {
    state.trail = { sequence: [], errors: 0, undoCount: 0 };
    delete state.drawings.trail;
    render();
  }
  if (action === "startVigilance") startVigilance();
  if (action === "tapVigilance") tapVigilance();
  if (action === "startFluency") startFluency();
  if (action === "addAnimal") addAnimal();
  if (action === "removeAnimal") {
    const response = getResponse(current.id);
    response.answer.animals = (response.answer.animals || []).filter((word) => word !== target.dataset.word);
    render();
  }
  if (action === "saveSession") await saveSession();
  if (action === "newSession") {
    resetState();
    render();
  }
  if (action === "loadSessions") await loadSessions(true);
  if (action === "selectSavedSession") await selectSavedSession(target.dataset.id);
});

root.addEventListener("input", (event) => {
  const target = event.target;
  if (target.dataset.bind) {
    const [, key] = target.dataset.bind.split(".");
    state.participant[key] = target.value;
    saveDraft();
  }
  if (target.dataset.serialIndex) {
    const response = getResponse("serial7");
    response.answer.values = response.answer.values || ["", "", "", "", ""];
    response.answer.values[Number(target.dataset.serialIndex)] = target.value;
    saveDraft();
  }
  if (target.dataset.orientationKey) {
    const response = getResponse("orientation");
    response.answer[target.dataset.orientationKey] = target.value;
    saveDraft();
  }
  if (target.dataset.transcriptIndex) {
    const response = getResponse("sentence");
    response.answer.transcript = response.answer.transcript || {};
    response.answer.transcript[target.dataset.transcriptIndex] = target.value;
    saveDraft();
  }
  if (target.dataset.recallFreeText !== undefined) {
    const response = getResponse("delayedRecall");
    response.answer.freeText = target.value;
    saveDraft();
  }
});

root.addEventListener("change", (event) => {
  const target = event.target;
  const current = tasks[state.activeTaskIndex];
  if (target.dataset.bind) {
    const [, key] = target.dataset.bind.split(".");
    state.participant[key] = target.value;
    saveDraft();
  }
});

async function submitActiveTask(shouldRender) {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  if (task.type === "drawing" || task.type === "trail") {
    response.drawingImage = captureCanvas(task.id);
  }
  finishTask(task.id);
  if (needsAiScore(task)) {
    await scoreTaskWithAi(task);
  }
  response.score = computeTaskScore(task, response);
  saveDraft();
  if (shouldRender) render();
}

function toggleValue(values, value, forced) {
  const set = new Set(values || []);
  if (typeof forced === "boolean") {
    if (forced) set.add(value);
    else set.delete(value);
  } else if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
  return [...set];
}

function startVigilance() {
  const response = getResponse("vigilance");
  response.answer.taps = [];
  response.answer.startedAt = Date.now();
  response.answer.running = true;
  let index = 0;
  window.clearInterval(vigilanceTimer);
  speakText(VIGILANCE_DIGITS.join(""), true);
  vigilanceTimer = window.setInterval(() => {
    index += 1;
    if (index >= VIGILANCE_DIGITS.length) {
      window.clearInterval(vigilanceTimer);
      response.answer.running = false;
      render();
    }
  }, 1000);
  render();
}

function tapVigilance() {
  const response = getResponse("vigilance");
  response.answer.taps = response.answer.taps || [];
  response.answer.taps.push(Date.now());
  render();
}

function startFluency() {
  const response = getResponse("fluency");
  response.answer.remaining = 60;
  response.answer.timerStartedAt = Date.now();
  window.clearInterval(fluencyTimer);
  fluencyTimer = window.setInterval(() => {
    response.answer.remaining -= 1;
    if (response.answer.remaining <= 0) {
      response.answer.remaining = 0;
      window.clearInterval(fluencyTimer);
    }
    render();
  }, 1000);
  render();
}

function addAnimal() {
  const input = document.querySelector("#animalInput");
  const value = normalizeText(input?.value);
  if (!value) return;
  const response = getResponse("fluency");
  response.answer.animals = response.answer.animals || [];
  response.answer.animals.push(value);
  render();
}

async function saveSession() {
  state.finishedAt = state.finishedAt || new Date().toISOString();
  const payload = buildSessionPayload();
  const saved = await fetch("/api/sessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }).then((entry) => entry.json());
  state.sessionId = saved.id;
  state.selectedSession = saved;
  await loadSessions(false);
  state.view = "admin";
  render();
}

async function loadSessions(shouldRender = false) {
  const sessions = await fetch("/api/sessions").then((entry) => entry.json());
  state.adminSessions = sessions;
  if (shouldRender) render();
}

async function selectSavedSession(id) {
  state.selectedSession = await fetch(`/api/sessions/${encodeURIComponent(id)}`).then((entry) => entry.json());
  render();
}

render();
