const WORDS = ["面孔", "天鹅绒", "教堂", "菊花", "红色"];
const TRAIL_EXPECTED = ["1", "甲", "2", "乙", "3", "丙", "4", "丁", "5", "戊"];
const VIGILANCE_DIGITS = "152945".split("");
const DIGIT_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const MEMORY_WAIT_MS = 5 * 60 * 1000;
const LOCAL_SESSIONS_KEY = "moca-game-local-sessions";
const LOGO_SRC = "./assets/logo.svg";
const NATURAL_VOICE_HINTS = ["xiaoxiao", "ting-ting", "tingting", "google 普通话", "google 國語", "mandarin", "普通话", "美佳", "sin-ji"];

const animalEmojis = {
  lion: "🦁",
  rhino: "🦏",
  camel: "🐫"
};

const animalNameBank = [
  "狗", "猫", "牛", "马", "羊", "猪", "鸡", "鸭", "鹅", "兔", "鼠", "虎", "狮子", "犀牛", "骆驼",
  "大象", "猴", "猩猩", "熊", "鹿", "长颈鹿", "斑马", "豹子", "狼", "狐狸", "河马", "袋鼠", "熊猫",
  "蛇", "乌龟", "鳄鱼", "青蛙", "鱼", "鲸", "海豚", "鲨鱼", "鸟", "鹰", "孔雀", "企鹅", "龙", "凤凰", "麒麟"
];

const orientationPrompts = [
  { key: "year", label: "今年是哪一年？", fields: ["year"] },
  { key: "date", label: "今天是几月几号？", fields: ["month", "day"] },
  { key: "weekday", label: "今天星期几？", fields: ["weekday"] },
  { key: "city", label: "你现在在哪个城市？", fields: ["city"] },
  { key: "place", label: "这里是什么地方？", fields: ["place"] }
];

const tasks = [
  {
    id: "trail",
    domain: "视空间与执行功能",
    title: "交替连线",
    maxScore: 1,
    type: "trail",
    modality: "点选连线",
    prompt: "请按数字、汉字交替上升的规则点击圆圈，每个圆圈只点一次。",
    scoring: "完全按照 1-甲-2-乙-3-丙-4-丁-5-戊，且没有任何交叉线，给 1 分；出现任何错误且未立刻自我纠正，给 0 分。"
  },
  {
    id: "cube",
    domain: "视空间与执行功能",
    title: "复制立方体",
    maxScore: 1,
    type: "drawing",
    drawingKind: "cube",
    modality: "画图",
    prompt: "请照着左侧图形，在空白区域尽可能精确地画一遍。",
    scoring: "图形为三维结构、所有线存在、无多余线、相对边基本平行且长度基本一致，全部满足给 1 分；任一标准不满足给 0 分。"
  },
  {
    id: "clock",
    domain: "视空间与执行功能",
    title: "画钟表",
    maxScore: 3,
    type: "drawing",
    drawingKind: "clock",
    modality: "画图",
    prompt: "请画一个钟表，填上所有数字，并指示出 11 点过 10 分。",
    scoring: "轮廓 1 分；数字 1 分；指针 1 分。"
  },
  {
    id: "naming",
    domain: "命名",
    title: "动物命名",
    maxScore: 3,
    type: "naming",
    modality: "逐张看图选择",
    prompt: "请看屏幕上的小动物，选择它的名字。",
    scoring: "狮子、犀牛、骆驼或单峰骆驼，各 1 分。",
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
    modality: "语音",
    prompt: "我会读几个词，请您注意听并记住。读完后，把记住的词告诉我。",
    scoring: "第一次学习不计入总分，仅记录编码表现和用时。",
    trial: 1
  },
  {
    id: "memory2",
    domain: "记忆",
    title: "词语学习 第二次",
    maxScore: 0,
    type: "memory",
    modality: "语音",
    prompt: "我把这些词再读一遍。请努力记住，并把刚才和这次记住的词都告诉我。",
    scoring: "第二次学习不计入总分，结束后提示稍后还要回忆这些词。",
    trial: 2
  },
  {
    id: "digitForward",
    domain: "注意",
    title: "数字顺背",
    maxScore: 1,
    type: "choice",
    modality: "听觉+数字卡",
    prompt: "请听一串数字，听完后按原顺序点击数字卡。",
    scoring: "顺背 21854 完全正确给 1 分，否则 0 分。",
    stimulus: "21854",
    answer: "21854"
  },
  {
    id: "digitBackward",
    domain: "注意",
    title: "数字倒背",
    maxScore: 1,
    type: "choice",
    modality: "听觉+数字卡",
    prompt: "请听一串数字，听完后按倒着的顺序点击数字卡。",
    scoring: "读出 742，倒背正确答案为 247；完全正确给 1 分，否则 0 分。",
    stimulus: "742",
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
    scoring: "完全正确或只有一次错误给 1 分；错误数大于或等于 2 给 0 分。"
  },
  {
    id: "serial7",
    domain: "注意",
    title: "100 连续减 7",
    maxScore: 3,
    type: "serial7",
    modality: "数字键盘",
    prompt: "请从 100 中减去 7，再从得数中继续减 7，一共算 5 次。",
    scoring: "4-5 个正确给 3 分，2-3 个正确给 2 分，1 个正确给 1 分，0 个正确给 0 分。"
  },
  {
    id: "sentence",
    domain: "语言",
    title: "句子复述",
    maxScore: 2,
    type: "sentence",
    modality: "语音识别",
    prompt: "请尽可能原原本本地复述听到的句子。",
    scoring: "每句话准确复述给 1 分。省略、替换、增加或语序变化均不得分。",
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
    modality: "60秒语音",
    prompt: "请在 1 分钟内尽可能多地说出动物的名字。",
    scoring: "1 分钟内说出的动物名称不少于 11 个给 1 分，否则 0 分。神化动物也算正确。"
  },
  {
    id: "abstraction",
    domain: "抽象",
    title: "词语相似性",
    maxScore: 2,
    type: "abstractionSpeech",
    modality: "语音识别",
    prompt: "请听两个词，说出它们在什么方面相类似。",
    scoring: "交通/运输工具 1 分；测量仪器/测量用的 1 分。",
    items: [
      { key: "trainBike", pair: "火车 - 自行车", answer: "交通工具", accepted: ["交通", "运输", "出行", "旅行"] },
      { key: "watchRuler", pair: "手表 - 尺子", answer: "测量工具", accepted: ["测量", "量", "工具", "仪器"] }
    ]
  },
  {
    id: "delayedRecall",
    domain: "延迟回忆",
    title: "无提示延迟回忆",
    maxScore: 5,
    type: "recall",
    modality: "语音识别",
    prompt: "刚才我给您读了几个词，请尽量回忆一下，告诉我这些词都有什么。",
    scoring: "只对未经提示自由回忆正确的词给分，每词 1 分。"
  },
  {
    id: "orientation",
    domain: "定向",
    title: "时间地点定向",
    maxScore: 6,
    type: "orientation",
    modality: "选择题+定位",
    prompt: "请选择现在的时间和地点。",
    scoring: "星期、月份、年份、日期、地点、城市各 1 分。"
  }
];

const root = document.querySelector("#app");
const educationLevels = ["", "小学", "初中", "中专", "高中", "大专", "本科及以上"];
const initialState = safeJson(localStorage.getItem("moca-game-draft"));

let state = initialState || createInitialState();
let activeCanvas = null;
let activeCtx = null;
let drawing = false;
let menuOpen = false;
let playState = "开始";
let voiceState = "待说";
let speechRecognition = null;
let recognizing = false;
let mediaRecorder = null;
let micStream = null;
let recordingAudio = false;
let audioChunks = [];
let vigilanceTimer = null;
let fluencyTimer = null;
let trailGuideFrame = null;
let trailGuideTick = 0;

migrateState();
render();

function createInitialState() {
  return {
    view: "setup",
    activeTaskIndex: 0,
    sessionId: crypto.randomUUID(),
    startedAt: null,
    finishedAt: null,
    participant: { name: "", birthYear: "", sex: "", educationLevel: "" },
    responses: {},
    drawings: {},
    trail: { sequence: [], errors: 0, undoCount: 0 },
    memoryWaitStartedAt: null,
    resumeAfterMemory2Index: null,
    adminSessions: [],
    selectedSession: null
  };
}

function safeJson(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function migrateState() {
  state.participant = state.participant || {};
  if (!state.participant.name && state.participant.code) state.participant.name = state.participant.code;
  if (!state.participant.birthYear && state.participant.age) {
    const age = Number(state.participant.age);
    if (Number.isFinite(age) && age > 0) state.participant.birthYear = String(new Date().getFullYear() - age);
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
  delete state.participant.age;
  delete state.participant.educationYears;
  delete state.participant.expectedPlace;
  delete state.participant.expectedCity;
  state.responses = state.responses || {};
  state.drawings = state.drawings || {};
  state.trail = state.trail || { sequence: [], errors: 0, undoCount: 0 };
  state.resumeAfterMemory2Index = Number.isInteger(state.resumeAfterMemory2Index) ? state.resumeAfterMemory2Index : null;
}

function saveDraft() {
  localStorage.setItem("moca-game-draft", JSON.stringify(state));
}

function resetState() {
  stopTimers();
  localStorage.removeItem("moca-game-draft");
  state = createInitialState();
  menuOpen = false;
  playState = "开始";
  voiceState = "待说";
}

function html(strings, ...values) {
  return strings.map((part, index) => `${part}${values[index] ?? ""}`).join("");
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
    const task = tasks.find((entry) => entry.id === taskId);
    state.responses[taskId] = {
      taskId,
      startedAt: null,
      endedAt: null,
      durationMs: 0,
      score: 0,
      maxScore: task ? task.maxScore : 0,
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

function render() {
  saveDraft();
  stopTrailGuide();
  if (state.view === "setup") {
    root.innerHTML = renderSetup();
    return;
  }

  ensureRenderableTask();
  const current = tasks[state.activeTaskIndex] || tasks[0];
  if (state.view === "test") beginTask(current.id);
  root.innerHTML = renderShell(current);
  if (state.view === "test") setupCurrentTask(current);
}

function renderSetup() {
  return html`
    <div class="setup-screen">
      <div class="floating-stars"><i></i><i></i><i></i></div>
      <section class="setup-panel">
        <div class="brand-row">
          <img class="logo-image bounce-in" src="${LOGO_SRC}" alt="MoCA Quest" />
          <div>
            <p class="eyebrow">欢迎来闯关</p>
            <h1>脑力闯关</h1>
          </div>
        </div>
        <div class="setup-grid">
          ${inputField("participant.name", "姓名", state.participant.name, "")}
          ${inputField("participant.birthYear", "出生年份", state.participant.birthYear, "", "number")}
          ${segmentedField("sex", "性别", state.participant.sex, ["男", "女"])}
          ${selectField("participant.educationLevel", "教育水平", state.participant.educationLevel, educationLevels)}
        </div>
        <div class="setup-actions">
          <button class="primary big-button" data-action="startSession">开始游戏</button>
        </div>
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
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${option || "请选择"}</option>`).join("")}
      </select>
    </label>
  `;
}

function segmentedField(key, label, value, options) {
  return html`
    <div class="field segmented-field">
      <span>${label}</span>
      <div class="segmented-options">
        ${options.map((option) => `<button type="button" class="segment-option ${value === option ? "picked" : ""}" data-action="chooseParticipant" data-key="${key}" data-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderShell(current) {
  const totals = computeTotals();
  return html`
    <div class="app-shell">
      <aside class="hidden-drawer ${menuOpen ? "open" : ""}">
        <button class="drawer-mask" data-action="closeMenu" aria-label="关闭菜单"></button>
        <div class="drawer-panel">
          <div class="drawer-brand">
            <img class="drawer-logo" src="${LOGO_SRC}" alt="" />
            <div>
              <strong>MoCA Quest</strong>
              <span>${escapeHtml(state.participant.name || "未填写姓名")}</span>
            </div>
          </div>
          <button class="drawer-item" data-action="navView" data-view="test">任务</button>
          <button class="drawer-item" data-action="navView" data-view="results">结果</button>
          <button class="drawer-item" data-action="navView" data-view="admin">后台</button>
          <button class="drawer-item" data-action="navView" data-view="design">技术细节</button>
          <button class="drawer-item" data-action="goHome">返回首页</button>
          <div class="drawer-score"><span>${state.view === "test" ? `${state.activeTaskIndex + 1}/${tasks.length}` : `${totals.totalScore}/30`}</span></div>
          <nav class="drawer-task-list">
            ${tasks.map((task, index) => renderTaskNav(task, index)).join("")}
          </nav>
        </div>
      </aside>
      <main class="page-shell">
        <header class="page-header">
          <button class="icon-button" data-action="openMenu" aria-label="打开菜单">≡</button>
          <div class="header-title">
            <h2>${state.view === "test" ? escapeHtml(current.title) : viewTitle()}</h2>
            ${state.view === "test" ? `<p class="header-prompt">${escapeHtml(current.prompt)}</p>` : ""}
          </div>
          <div class="header-progress">
            <span>${state.activeTaskIndex + 1}/${tasks.length}</span>
            <div class="progress-track"><span style="width:${((state.activeTaskIndex + 1) / tasks.length) * 100}%"></span></div>
          </div>
        </header>
        ${renderMainView(current)}
      </main>
    </div>
  `;
}

function renderTaskNav(task, index) {
  const done = state.responses[task.id]?.submitted;
  const active = state.view === "test" && state.activeTaskIndex === index;
  return html`
    <button class="drawer-task ${active ? "active" : ""} ${done ? "done" : ""}" data-action="selectTask" data-index="${index}">
      <span>${index + 1}</span>
      <strong>${escapeHtml(task.title)}</strong>
    </button>
  `;
}

function viewTitle() {
  if (state.view === "results") return "闯关结果";
  if (state.view === "admin") return "后台数据库";
  if (state.view === "design") return "技术细节";
  return "任务";
}

function renderMainView(current) {
  if (state.view === "results") return renderResults();
  if (state.view === "admin") return renderAdmin();
  if (state.view === "design") return renderDesign();
  return renderTask(current);
}

function renderTask(task) {
  const step = getTaskStep(task);
  return html`
    <section class="single-page task-page">
      <div class="task-workspace">${renderTaskWorkspace(task, step)}</div>
      <footer class="task-footer">
        <button class="ghost" data-action="previousTask" ${state.activeTaskIndex === 0 && step === 0 ? "disabled" : ""}>上一题</button>
        <button class="primary" data-action="nextTask">${nextLabel(task, step)}</button>
      </footer>
    </section>
  `;
}

function getTaskStep(task) {
  const response = getResponse(task.id);
  return Math.min(Number(response.answer?.step || 0), getTaskStepCount(task) - 1);
}

function getTaskStepCount(task) {
  if (task.type === "naming") return task.items.length;
  if (task.type === "serial7") return 5;
  if (task.type === "sentence") return task.sentences.length;
  if (task.type === "abstractionSpeech") return task.items.length;
  if (task.type === "orientation") return orientationPrompts.length;
  return 1;
}

function nextLabel(task, step) {
  if (step < getTaskStepCount(task) - 1) return "下一题";
  if (task.id === "trail" && state.trail.sequence.length === TRAIL_EXPECTED.length) return "确认";
  const hasPendingMemory2 = task.id !== "memory2" && state.memoryWaitStartedAt && !isMemory2Submitted();
  if (hasPendingMemory2) return "下一题";
  return state.activeTaskIndex === tasks.length - 1 ? "查看结果" : "下一题";
}

function renderTaskWorkspace(task, step) {
  if (task.type === "trail") return renderTrailTask();
  if (task.type === "drawing") return renderDrawingTask(task);
  if (task.type === "naming") return renderNamingTask(task, step);
  if (task.type === "memory") return renderMemoryTask(task);
  if (task.type === "choice") return renderChoiceTask(task);
  if (task.type === "vigilance") return renderVigilanceTask();
  if (task.type === "serial7") return renderSerial7Task(step);
  if (task.type === "sentence") return renderSentenceTask(task, step);
  if (task.type === "fluency") return renderFluencyTask();
  if (task.type === "abstractionSpeech") return renderAbstractionTask(task, step);
  if (task.type === "recall") return renderRecallTask();
  if (task.type === "orientation") return renderOrientationTask(step);
  return "";
}

function renderTrailTask() {
  return html`
    <div class="trail-page">
      <canvas id="taskCanvas" class="task-canvas" aria-label="交替连线画图区域"></canvas>
      <div class="control-row">
        <button class="ghost" data-action="undoTrail">撤销一步</button>
        <button class="ghost" data-action="clearTrail">重画</button>
      </div>
    </div>
  `;
}

function renderDrawingTask(task) {
  return html`
    <div class="drawing-page ${task.drawingKind === "clock" ? "clock-page" : ""}">
      ${task.drawingKind === "cube" ? `<div class="reference-panel">${cubeReferenceSvg()}</div>` : ""}
      <div class="canvas-wrap">
        ${task.drawingKind === "clock" ? `<div class="clock-label">11:10</div>` : ""}
        <canvas id="taskCanvas" class="task-canvas" aria-label="${escapeHtml(task.title)}画图区域"></canvas>
        <button class="ghost redraw-button" data-action="clearDrawing">重画</button>
      </div>
    </div>
  `;
}

function renderNamingTask(task, step) {
  const response = getResponse(task.id);
  const item = task.items[step];
  return html`
    <div class="naming-page">
      <div class="animal-emoji pop-in" role="img" aria-label="${escapeHtml(item.answer)}">${animalEmojis[item.key]}</div>
      <div class="animal-side">
        <h4>这只小动物叫什么名字？</h4>
        <div class="option-grid">
          ${item.options.map((option) => `<button class="option ${response.answer[item.key] === option ? "picked" : ""}" data-action="chooseNaming" data-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMemoryTask(task) {
  const response = getResponse(task.id);
  return html`
    <div class="speech-page">
      ${renderAudioWave()}
      ${renderAudioButton("playCurrentAudio")}
      <textarea class="transcript-input" data-voice-manual>${escapeHtml(response.answer.freeText || "")}</textarea>
    </div>
  `;
}

function renderChoiceTask(task) {
  const response = getResponse(task.id);
  const sequence = response.answer.sequence || [];
  const ready = Boolean(response.answer.audioReady);
  return html`
    <div class="digit-page">
      ${renderAudioWave()}
      ${ready ? `
        <div class="digit-answer">${sequence.map((digit) => `<span>${digit}</span>`).join("")}</div>
        <div class="keypad digit-keypad">
          ${DIGIT_PAD.slice(0, 9).map((digit) => `<button data-action="appendDigit" data-digit="${digit}">${digit}</button>`).join("")}
          <button class="key-action" data-action="backspaceDigit">删除</button>
          <button data-action="appendDigit" data-digit="0">0</button>
          <button class="key-action confirm" data-action="confirmDigit" ${sequence.length === 0 ? "disabled" : ""}>确认</button>
        </div>
      ` : renderAudioButton("playCurrentAudio")}
    </div>
  `;
}

function renderVigilanceTask() {
  const response = getResponse("vigilance");
  const started = Boolean(response.answer.startedAt);
  const taps = response.answer.taps || [];
  return html`
    <div class="vigilance-page">
      <strong class="tap-instruction">听到 1 敲一下</strong>
      ${renderAudioWave()}
      ${started ? `<button class="tap-button pulse" data-action="tapVigilance">敲一下</button><span class="tap-count">已敲 ${taps.length} 次</span>` : `<button class="primary circle-button" data-action="playCurrentAudio">开始</button>`}
    </div>
  `;
}

function renderSerial7Task(step) {
  const response = getResponse("serial7");
  const values = response.answer.values || ["", "", "", "", ""];
  const previous = step === 0 ? 100 : Number(values[step - 1] || 100 - step * 7);
  return html`
    <div class="serial-page">
      <div class="math-question">${previous} - 7 = ?</div>
      <div class="serial-display">${escapeHtml(values[step] || " ")}</div>
      <div class="keypad">
        ${DIGIT_PAD.map((digit) => `<button data-action="inputSerialDigit" data-digit="${digit}">${digit}</button>`).join("")}
        <button class="key-wide" data-action="backspaceSerial">退格</button>
      </div>
    </div>
  `;
}

function renderSentenceTask(task, step) {
  const response = getResponse(task.id);
  const value = response.answer.transcript?.[step] || "";
  return renderSpeechCard(value || "等待语音识别...");
}

function renderFluencyTask() {
  const response = getResponse("fluency");
  const remaining = response.answer.remaining ?? 60;
  const running = Boolean(response.answer.running);
  const animals = uniqueWords(response.answer.animals || []);
  return html`
    <div class="fluency-page">
      ${renderAudioWave()}
      <button class="timer-button ${running ? "running" : ""}" data-action="startFluency">${running ? remaining : "开始"}</button>
      <strong>已识别 ${animals.length} 个</strong>
      <textarea class="transcript-input" data-fluency-manual>${escapeHtml((response.answer.rawTranscript || animals.join("、")) || "点击开始后说动物名")}</textarea>
    </div>
  `;
}

function renderAbstractionTask(task, step) {
  const response = getResponse(task.id);
  const value = response.answer.transcript?.[step] || "";
  return html`
    <div class="speech-page">
      <div class="pair-title">${escapeHtml(task.items[step].pair)}</div>
      ${renderSpeechControls(value || "等待语音识别...")}
    </div>
  `;
}

function renderRecallTask() {
  const response = getResponse("delayedRecall");
  return html`
    <div class="speech-page">
      ${renderAudioWave()}
      ${renderAudioButton("playCurrentAudio")}
      <textarea class="transcript-input" data-recall-free-text>${escapeHtml(response.answer.freeText || "")}</textarea>
    </div>
  `;
}

function renderOrientationTask(step) {
  const response = getResponse("orientation");
  const prompt = orientationPrompts[step];
  const options = orientationOptions(prompt);
  const picked = response.answer.orientationChoices?.[prompt.key] || "";
  return html`
    <div class="orientation-page">
      <h4 class="orientation-question">${escapeHtml(prompt.label)}</h4>
      ${prompt.key === "city" || prompt.key === "place" ? `<p class="location-text">${escapeHtml(locationStatus())}</p>` : ""}
      <div class="option-grid orientation-options">
        ${options.map((option) => `<button class="option ${picked === option.value ? "picked" : ""}" data-action="chooseOrientation" data-key="${prompt.key}" data-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderSpeechCard(transcript) {
  return html`
    <div class="speech-page">
      ${renderAudioWave()}
      ${renderAudioButton("playCurrentAudio")}
      <textarea class="transcript-input" data-voice-manual>${escapeHtml(transcript)}</textarea>
    </div>
  `;
}

function renderSpeechControls(transcript) {
  return html`
    ${renderAudioWave()}
    ${renderAudioButton("playCurrentAudio")}
    <textarea class="transcript-input" data-voice-manual>${escapeHtml(transcript)}</textarea>
  `;
}

function renderAudioWave() {
  const active = playState === "播放中..." || recognizing || recordingAudio;
  const label = playState === "播放中..." ? "播放中..." : recognizing || recordingAudio ? "请说" : "准备好了";
  return html`
    <div class="audio-wave ${active ? "active" : ""}" aria-label="${escapeHtml(label)}">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <strong class="voice-status">${escapeHtml(label)}</strong>
  `;
}

function renderAudioButton(action) {
  if (playState === "播放中...") return `<button class="primary sound-button" disabled>播放中...</button>`;
  if (recognizing || recordingAudio) return `<button class="ghost sound-button" data-action="toggleVoiceInput">请说</button>`;
  return `<button class="primary sound-button" data-action="${action}">开始</button>`;
}

function renderResults() {
  const totals = computeTotals();
  const success = totals.totalScore >= 26;
  return html`
    <section class="single-page results-page">
      <div class="result-hero ${success ? "celebrate" : "soft-alert"}">
        <div class="confetti"><i></i><i></i><i></i><i></i><i></i></div>
        <img class="result-logo ${success ? "bounce-in" : "floaty"}" src="${LOGO_SRC}" alt="" />
        <span>${success ? "闯关完成" : "闯关结束"}</span>
        <strong>${totals.totalScore}<em>/30</em></strong>
        <p>${success ? "表现很棒，继续保持。" : "这次有点吃力，建议再做一次专业评估。"}</p>
      </div>
      <div class="control-row results-actions">
        <button class="primary" data-action="saveSession">保存到后台数据库</button>
        <button class="ghost" data-action="newSession">再玩一次</button>
      </div>
    </section>
  `;
}

function renderAdmin() {
  return html`
    <section class="single-page admin-page">
      <div class="admin-toolbar">
        <button class="primary" data-action="loadSessions">刷新数据库</button>
        <button class="secondary" data-action="saveSession">保存当前测评</button>
      </div>
      <div class="admin-table">
        <div class="admin-head"><span>参加者</span><span>总分</span><span>原始分</span><span>保存时间</span></div>
        ${(state.adminSessions || []).map((session) => `
          <button class="admin-row" data-action="selectSavedSession" data-id="${session.id}">
            <span>${escapeHtml(session.participant?.name || session.id.slice(0, 8))}</span>
            <strong>${session.totalScore ?? "-"}/30</strong>
            <span>${session.rawScore ?? "-"}</span>
            <span>${session.finishedAt ? new Date(session.finishedAt).toLocaleString() : "-"}</span>
          </button>
        `).join("") || `<p class="empty">暂无保存记录</p>`}
      </div>
      <pre class="json-preview">${escapeHtml(state.selectedSession ? JSON.stringify(state.selectedSession, null, 2) : databaseSchemaText())}</pre>
    </section>
  `;
}

function renderDesign() {
  return html`
    <section class="single-page design-page">
      <div class="design-note">
        <h3>核心设计</h3>
        <p>每道题是一张横屏任务页。选择、语音、画图、定位和行为记录统一写入后台；作答端保持简洁卡通风格。</p>
      </div>
      <div class="design-grid">
        ${tasks.map((task) => `<article><span>${escapeHtml(task.domain)}</span><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.modality)}</small></article>`).join("")}
      </div>
    </section>
  `;
}

function databaseSchemaText() {
  return `Cloudflare D1 后台字段
sessions:
  id, participant_name, birth_year, gender, education_level
  started_at, finished_at, saved_at, total_duration_ms
  raw_score, education_bonus, total_score, risk_band, domain_scores_json

item_responses:
  session_id, task_id, domain, title, modality, max_score, score
  started_at, ended_at, duration_ms
  answer_json, behavior_json, drawing_image, ai_json

behavior_json:
  sequence, errors, undoCount, taps, strokes, voiceEvents, audioRecordings, location`;
}

function setupCurrentTask(task) {
  if (task.type === "drawing") setupFreeCanvas(task);
  if (task.type === "trail") setupTrailCanvas();
  if (task.type === "orientation") prepareLocationAnswer();
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
  activeCtx.lineWidth = 5;
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

function setupTrailCanvas() {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  activeCanvas = canvas;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  activeCtx = canvas.getContext("2d");
  activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvas.onpointerdown = (event) => {
    const point = canvasPoint(event, canvas);
    const node = nearestTrailNode(point, canvas);
    if (!node || state.trail.sequence.includes(node.label)) return;
    const expected = TRAIL_EXPECTED[state.trail.sequence.length];
    if (node.label !== expected) state.trail.errors += 1;
    state.trail.sequence.push(node.label);
    const response = getResponse("trail");
    response.behavior.sequence = [...state.trail.sequence];
    response.behavior.errors = state.trail.errors;
    drawTrailCanvas(canvas);
    state.drawings.trail = canvas.toDataURL("image/png");
    saveDraft();
    render();
  };
  if (shouldShowTrailGuide()) startTrailGuide();
  else drawTrailCanvas(canvas);
}

function startTrailGuide() {
  stopTrailGuide();
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  const tick = () => {
    if (state.view !== "test" || tasks[state.activeTaskIndex]?.type !== "trail" || !shouldShowTrailGuide()) return;
    trailGuideTick += 1;
    drawTrailCanvas(canvas, trailGuideTick);
    trailGuideFrame = requestAnimationFrame(tick);
  };
  trailGuideFrame = requestAnimationFrame(tick);
}

function stopTrailGuide() {
  if (trailGuideFrame) cancelAnimationFrame(trailGuideFrame);
  trailGuideFrame = null;
}

function drawTrailCanvas(canvas, tick = 0) {
  const rect = canvas.getBoundingClientRect();
  activeCtx.clearRect(0, 0, rect.width, rect.height);
  activeCtx.fillStyle = "#fffdf7";
  activeCtx.fillRect(0, 0, rect.width, rect.height);
  const nodes = trailNodes(canvas);

  const guideLabels = trailGuideLabels();
  if (guideLabels) {
    const guide = guideLabels.map((label) => nodes.find((node) => node.label === label));
    activeCtx.strokeStyle = "rgba(34,169,107,0.20)";
    activeCtx.lineWidth = 10;
    activeCtx.beginPath();
    guide.forEach((node, index) => {
      if (index === 0) activeCtx.moveTo(node.x, node.y);
      else activeCtx.lineTo(node.x, node.y);
    });
    activeCtx.stroke();
    const progress = (tick % 60) / 60;
    const moving = {
      x: guide[0].x + (guide[1].x - guide[0].x) * progress,
      y: guide[0].y + (guide[1].y - guide[0].y) * progress
    };
    activeCtx.fillStyle = "#ff7f68";
    activeCtx.beginPath();
    activeCtx.arc(moving.x, moving.y, 12 + (tick % 18) * 0.6, 0, Math.PI * 2);
    activeCtx.fill();
  }

  const complete = state.trail.sequence.length === TRAIL_EXPECTED.length;
  activeCtx.strokeStyle = complete ? "#ff9f43" : "#20a66b";
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
    const used = state.trail.sequence.includes(node.label);
    activeCtx.beginPath();
    activeCtx.fillStyle = used ? (complete ? "#fff1da" : "#e8f8ef") : "#ffffff";
    activeCtx.strokeStyle = used ? (complete ? "#ff9f43" : "#20a66b") : "#243447";
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
}

function shouldShowTrailGuide() {
  const sequence = state.trail.sequence || [];
  return sequence.length === 0 || (sequence.length === 1 && sequence[0] === "1") || (sequence.length === 2 && sequence[0] === "1" && sequence[1] === "甲");
}

function trailGuideLabels() {
  const sequence = state.trail.sequence || [];
  if (sequence.length === 0 || (sequence.length === 1 && sequence[0] === "1")) return ["1", "甲"];
  if (sequence.length === 2 && sequence[0] === "1" && sequence[1] === "甲") return ["甲", "2"];
  return null;
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
  return trailNodes(canvas).find((node) => Math.sqrt((point.x - node.x) ** 2 + (point.y - node.y) ** 2) <= node.r + 10);
}

function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function captureCanvas(taskId) {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return state.drawings[taskId] || null;
  const image = canvas.toDataURL("image/png");
  state.drawings[taskId] = image;
  return image;
}

function cubeReferenceSvg() {
  return `
    <svg class="reference-svg" viewBox="0 0 240 190" role="img" aria-label="立方体参考图">
      <path d="M58 64 L136 64 L176 32 L98 32 Z" fill="#f6fbff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
      <path d="M136 64 L176 32 L176 112 L136 150 Z" fill="#dbe7ef" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
      <path d="M58 64 L136 64 L136 150 L58 150 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
    </svg>
  `;
}

root.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const current = tasks[state.activeTaskIndex];

  if (action === "startSession") {
    const participant = { ...state.participant };
    const adminSessions = state.adminSessions || [];
    state = createInitialState();
    state.participant = participant;
    state.adminSessions = adminSessions;
    state.startedAt = new Date().toISOString();
    state.activeTaskIndex = 0;
    state.view = "test";
    render();
  }
  if (action === "openMenu") {
    menuOpen = true;
    render();
  }
  if (action === "closeMenu") {
    menuOpen = false;
    render();
  }
  if (action === "navView") {
    state.view = target.dataset.view;
    menuOpen = false;
    if (state.view === "admin") await loadSessions(false);
    render();
  }
  if (action === "goHome") {
    state.view = "setup";
    menuOpen = false;
    render();
  }
  if (action === "chooseParticipant") {
    state.participant[target.dataset.key] = target.dataset.value;
    saveDraft();
    render();
  }
  if (action === "selectTask") {
    const nextIndex = Number(target.dataset.index);
    if (tasks[nextIndex]?.id === "memory2" && !isMemory2Available()) {
      menuOpen = false;
      render();
      return;
    }
    state.activeTaskIndex = nextIndex;
    state.view = "test";
    menuOpen = false;
    render();
  }
  if (action === "previousTask") {
    const response = getResponse(current.id);
    const step = getTaskStep(current);
    if (step > 0) response.answer.step = step - 1;
    else state.activeTaskIndex = Math.max(0, state.activeTaskIndex - 1);
    render();
  }
  if (action === "nextTask") await nextTask();
  if (action === "chooseNaming") {
    const response = getResponse(current.id);
    const item = current.items[getTaskStep(current)];
    response.answer[item.key] = target.dataset.value;
    await nextTask();
  }
  if (action === "playCurrentAudio") playCurrentAudio();
  if (action === "toggleVoiceInput") toggleVoiceInput();
  if (action === "appendDigit") await appendDigit(target.dataset.digit);
  if (action === "backspaceDigit") backspaceDigit();
  if (action === "confirmDigit") await confirmDigit();
  if (action === "inputSerialDigit") inputSerialDigit(target.dataset.digit);
  if (action === "backspaceSerial") backspaceSerial();
  if (action === "chooseOrientation") {
    applyOrientationChoice(target.dataset.key, target.dataset.value);
    await nextTask();
  }
  if (action === "tapVigilance") tapVigilance();
  if (action === "startFluency") startFluency();
  if (action === "clearDrawing") {
    delete state.drawings[current.id];
    delete getResponse(current.id).drawingImage;
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
  if (target.dataset.voiceManual !== undefined) {
    applyManualVoiceText(target.value);
    saveDraft();
  }
  if (target.dataset.recallFreeText !== undefined) {
    getResponse("delayedRecall").answer.freeText = target.value;
    saveDraft();
  }
  if (target.dataset.fluencyManual !== undefined) {
    const response = getResponse("fluency");
    response.answer.rawTranscript = target.value;
    response.answer.animals = extractAnimalNames(target.value);
    saveDraft();
  }
});

root.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.bind) {
    const [, key] = target.dataset.bind.split(".");
    state.participant[key] = target.value;
    saveDraft();
  }
});

async function nextTask() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (step < getTaskStepCount(task) - 1) {
    response.answer.step = step + 1;
    render();
    return;
  }
  await submitActiveTask();
  if (task.id === "memory1" && !state.memoryWaitStartedAt) state.memoryWaitStartedAt = Date.now();
  const nextIndex = nextTaskIndexAfterSubmit(task);
  if (nextIndex < 0) {
    state.view = "results";
    state.finishedAt = new Date().toISOString();
  } else {
    state.activeTaskIndex = nextIndex;
  }
  render();
}

function nextTaskIndexAfterSubmit(task) {
  if (shouldInsertMemory2(task.id)) {
    state.resumeAfterMemory2Index = nextSequentialIndex(state.activeTaskIndex);
    return taskIndex("memory2");
  }
  if (task.id === "memory2") {
    const resumeIndex = state.resumeAfterMemory2Index;
    state.resumeAfterMemory2Index = null;
    if (Number.isInteger(resumeIndex) && resumeIndex >= 0 && resumeIndex < tasks.length) return resumeIndex;
  }
  return nextSequentialIndex(state.activeTaskIndex);
}

function nextSequentialIndex(fromIndex) {
  for (let index = fromIndex + 1; index < tasks.length; index += 1) {
    if (tasks[index].id === "memory2" && !isMemory2Available()) continue;
    return index;
  }
  return -1;
}

function shouldInsertMemory2(currentTaskId) {
  return currentTaskId !== "memory2" && !isMemory2Submitted() && isMemory2Ready();
}

function ensureRenderableTask() {
  if (state.view !== "test") return;
  const task = tasks[state.activeTaskIndex];
  if (task?.id !== "memory2" || isMemory2Available()) return;
  const fallback = nextSequentialIndex(taskIndex("memory2"));
  state.activeTaskIndex = fallback >= 0 ? fallback : 0;
}

function isMemory2Available() {
  return isMemory2Submitted() || isMemory2Ready();
}

function isMemory2Submitted() {
  return Boolean(state.responses.memory2?.submitted);
}

function isMemory2Ready() {
  return Boolean(state.memoryWaitStartedAt) && memoryWaitRemaining() <= 0;
}

function taskIndex(taskId) {
  return tasks.findIndex((task) => task.id === taskId);
}

async function submitActiveTask() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  if (recognizing || recordingAudio) stopVoiceInput();
  if (task.type === "fluency" && response.answer.running) {
    response.answer.running = false;
    window.clearInterval(fluencyTimer);
    stopVoiceInput();
  }
  if (task.type === "drawing" || task.type === "trail") response.drawingImage = captureCanvas(task.id);
  finishTask(task.id);
  if (needsAiScore(task)) response.ai = await scoreTaskWithAi(task);
  response.score = computeTaskScore(task, response);
  saveDraft();
}

function playCurrentAudio() {
  const task = tasks[state.activeTaskIndex];
  const step = getTaskStep(task);
  if (task.type === "memory") return speakText(WORDS.join("，"), { rate: 0.78, done: () => startVoiceInput() });
  if (task.type === "choice") return playDigitStimulus(task);
  if (task.type === "vigilance") return startVigilance();
  if (task.type === "sentence") return speakText(task.sentences[step], { rate: 0.86, done: () => startVoiceInput() });
  if (task.type === "abstractionSpeech") return speakText(task.items[step].pair, { rate: 0.86, done: () => startVoiceInput() });
  if (task.type === "recall") return speakText(task.prompt, { rate: 0.86, done: () => startVoiceInput() });
}

function speakText(text, options = {}) {
  const { rate = 0.86, pitch = 1.04, done, onStart } = options;
  if (!("speechSynthesis" in window)) {
    if (done) done();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  utterance.pitch = pitch;
  const voice = pickNaturalVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => {
    playState = "播放中...";
    if (onStart) onStart();
    render();
  };
  utterance.onend = () => {
    playState = "开始";
    render();
    if (done) done();
  };
  utterance.onerror = () => {
    playState = "开始";
    render();
    if (done) done();
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function pickNaturalVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter((voice) => /^zh/i.test(voice.lang) || /chinese|mandarin|普通话|中文|國語|国语/i.test(voice.name));
  return zhVoices.find((voice) => NATURAL_VOICE_HINTS.some((hint) => voice.name.toLowerCase().includes(hint))) || zhVoices[0] || null;
}

function speakItemsSlow(items, options = {}) {
  const { gapMs = 1000, rate = 0.72, done, onItemStart } = options;
  if (!("speechSynthesis" in window)) {
    if (done) done();
    return;
  }
  window.speechSynthesis.cancel();
  playState = "播放中...";
  render();
  let index = 0;
  const speakNext = () => {
    if (index >= items.length) {
      playState = "开始";
      render();
      if (done) done();
      return;
    }
    const value = items[index];
    if (onItemStart) onItemStart(value, index);
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "zh-CN";
    utterance.rate = rate;
    utterance.pitch = 1.04;
    const voice = pickNaturalVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      index += 1;
      window.setTimeout(speakNext, gapMs);
    };
    utterance.onerror = utterance.onend;
    window.speechSynthesis.speak(utterance);
  };
  speakNext();
}

function playDigitStimulus(task) {
  const response = getResponse(task.id);
  response.answer.sequence = [];
  response.answer.audioReady = false;
  response.behavior.digitPlayback = [];
  speakItemsSlow(task.stimulus.split(""), {
    gapMs: 650,
    rate: 0.66,
    onItemStart: (digit, index) => response.behavior.digitPlayback.push({ digit, index, at: Date.now() }),
    done: () => {
      response.answer.audioReady = true;
      saveDraft();
      render();
    }
  });
}

function initSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.onstart = () => {
    recognizing = true;
    voiceState = "请说";
    render();
  };
  recognition.onresult = (event) => {
    let text = "";
    for (let i = 0; i < event.results.length; i += 1) text += event.results[i][0].transcript;
    applyVoiceText(text);
  };
  recognition.onend = () => {
    recognizing = false;
    voiceState = "待说";
    render();
  };
  recognition.onerror = () => {
    recognizing = false;
    voiceState = "识别未完成";
    render();
  };
  return recognition;
}

function toggleVoiceInput() {
  if (recognizing || recordingAudio) stopVoiceInput();
  else startVoiceInput();
}

async function startVoiceInput() {
  voiceState = "请说";
  await startAudioRecording();
  speechRecognition = speechRecognition || initSpeechRecognition();
  if (!speechRecognition) {
    voiceState = recordingAudio ? "请说" : "当前浏览器不支持语音识别";
    render();
    return;
  }
  try {
    speechRecognition.start();
  } catch {
    // Already started.
  }
}

function stopVoiceInput() {
  if (speechRecognition && recognizing) speechRecognition.stop();
  if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
    micStream = null;
  }
  recordingAudio = false;
  render();
}

async function startAudioRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    voiceState = "当前浏览器不能录音";
    return;
  }
  if (mediaRecorder && mediaRecorder.state === "recording") return;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 32000 } : { audioBitsPerSecond: 32000 };
    mediaRecorder = new MediaRecorder(micStream, options);
    const task = tasks[state.activeTaskIndex];
    const step = getTaskStep(task);
    const response = getResponse(task.id);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) audioChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || "audio/webm" });
      response.behavior.audioRecordings = response.behavior.audioRecordings || [];
      response.behavior.audioRecordings.push({ step, mimeType: blob.type, size: blob.size, endedAt: new Date().toISOString() });
      const reader = new FileReader();
      reader.onload = () => {
        response.answer.audioRecordings = response.answer.audioRecordings || {};
        response.answer.audioRecordings[step] = reader.result;
        saveDraft();
      };
      if (blob.size) reader.readAsDataURL(blob);
    };
    mediaRecorder.start();
    recordingAudio = true;
    voiceState = "请说";
    render();
  } catch {
    recordingAudio = false;
    voiceState = "请允许麦克风权限";
    render();
  }
}

function applyVoiceText(text) {
  if (!text) return;
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (task.type === "memory") response.answer.freeText = text;
  if (task.type === "sentence" || task.type === "abstractionSpeech") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.transcript[step] = text;
  }
  if (task.type === "fluency") {
    response.answer.rawTranscript = text;
    response.answer.animals = extractAnimalNames(text);
  }
  if (task.type === "recall") response.answer.freeText = text;
  if (task.type === "orientation") applyOrientationText(response, step, text);
  response.behavior.voiceEvents = response.behavior.voiceEvents || [];
  response.behavior.voiceEvents.push({ step, text, at: new Date().toISOString() });
  saveDraft();
}

function applyManualVoiceText(text) {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (task.type === "memory") response.answer.freeText = text;
  if (task.type === "sentence" || task.type === "abstractionSpeech") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.transcript[step] = text;
  }
  if (task.type === "orientation") applyOrientationText(response, step, text);
}

function applyOrientationText(response, step, text) {
  const prompt = orientationPrompts[step];
  response.answer.orientationTranscript = response.answer.orientationTranscript || {};
  response.answer.orientationTranscript[prompt.key] = text;
  if (prompt.key === "year") response.answer.year = firstNumber(text) || text;
  if (prompt.key === "date") {
    const nums = numbersInText(text);
    response.answer.month = nums[0] || text;
    response.answer.day = nums[1] || text;
  }
  if (prompt.key === "weekday") response.answer.weekday = text;
  if (prompt.key === "city") response.answer.city = text;
  if (prompt.key === "place") response.answer.place = text;
}

function applyOrientationChoice(key, value) {
  const response = getResponse("orientation");
  response.answer.orientationChoices = response.answer.orientationChoices || {};
  response.answer.orientationChoices[key] = value;
  if (key === "year") response.answer.year = value;
  if (key === "date") {
    const [month, day] = value.split("-");
    response.answer.month = month;
    response.answer.day = day;
  }
  if (key === "weekday") response.answer.weekday = value;
  if (key === "city") response.answer.city = value;
  if (key === "place") response.answer.place = value;
  saveDraft();
}

function orientationOptions(prompt) {
  const today = todayParts();
  if (prompt.key === "year") {
    const year = Number(today.year);
    return optionObjects([year, year - 1, year + 1, year - 2].map(String), today.year);
  }
  if (prompt.key === "date") {
    const offsets = [0, -1, 1, 7];
    const values = offsets.map((offset) => dateOptionValue(offset));
    return optionObjects(values, values[0]).map((option) => ({ ...option, label: dateOptionLabel(option.value) }));
  }
  if (prompt.key === "weekday") {
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const index = weekdays.indexOf(today.weekday);
    return optionObjects([today.weekday, weekdays[(index + 1) % 7], weekdays[(index + 6) % 7], weekdays[(index + 2) % 7]], today.weekday);
  }
  if (prompt.key === "city") {
    const expected = getResponse("orientation").answer.expectedCity || getResponse("orientation").behavior.location?.city || "南京市";
    return optionObjects([expected, "上海市", "北京市", "杭州市", "苏州市"], expected).slice(0, 4);
  }
  const expectedPlace = getResponse("orientation").answer.expectedPlace || getResponse("orientation").behavior.location?.place || "当前位置";
  return optionObjects([expectedPlace, "社区中心", "医院", "学校", "家里"], expectedPlace).slice(0, 4);
}

function optionObjects(values, correct) {
  const unique = [...new Set(values.filter(Boolean))];
  if (unique.length > 2) {
    const first = unique.shift();
    unique.splice(2, 0, first);
  }
  return unique.map((value) => ({ value, label: value, correct: value === correct }));
}

function dateOptionValue(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getMonth() + 1}-${date.getDate()}`;
}

function dateOptionLabel(value) {
  const [month, day] = value.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function firstNumber(text) {
  return numbersInText(text)[0] || "";
}

function numbersInText(text) {
  return String(text || "").match(/\d+/g) || [];
}

async function appendDigit(digit) {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  response.answer.sequence = response.answer.sequence || [];
  if (response.answer.sequence.length < task.answer.length) response.answer.sequence.push(digit);
  if (response.answer.sequence.length >= task.answer.length) {
    await nextTask();
    return;
  }
  render();
}

function backspaceDigit() {
  const response = getResponse(tasks[state.activeTaskIndex].id);
  response.answer.sequence = response.answer.sequence || [];
  response.answer.sequence.pop();
  render();
}

async function confirmDigit() {
  const response = getResponse(tasks[state.activeTaskIndex].id);
  response.answer.sequence = response.answer.sequence || [];
  await nextTask();
}

function inputSerialDigit(digit) {
  const response = getResponse("serial7");
  const step = getTaskStep(tasks[state.activeTaskIndex]);
  response.answer.values = response.answer.values || ["", "", "", "", ""];
  response.answer.values[step] = `${response.answer.values[step] || ""}${digit}`;
  render();
}

function backspaceSerial() {
  const response = getResponse("serial7");
  const step = getTaskStep(tasks[state.activeTaskIndex]);
  response.answer.values = response.answer.values || ["", "", "", "", ""];
  response.answer.values[step] = response.answer.values[step].slice(0, -1);
  render();
}

function startVigilance() {
  const response = getResponse("vigilance");
  response.answer.taps = [];
  response.answer.startedAt = Date.now();
  response.answer.running = true;
  response.behavior.vigilanceDigits = [];
  window.clearInterval(vigilanceTimer);
  speakItemsSlow(VIGILANCE_DIGITS, {
    gapMs: 650,
    rate: 0.66,
    onItemStart: (digit, index) => response.behavior.vigilanceDigits.push({ digit, index, at: Date.now() }),
    done: () => {
      window.clearInterval(vigilanceTimer);
      response.answer.running = false;
      render();
    }
  });
  render();
}

function tapVigilance() {
  const response = getResponse("vigilance");
  if (!response.answer.startedAt) return;
  response.answer.taps = response.answer.taps || [];
  response.answer.taps.push(Date.now());
  render();
}

function startFluency() {
  const response = getResponse("fluency");
  if (response.answer.running) return;
  response.answer.remaining = 60;
  response.answer.running = true;
  response.answer.timerStartedAt = Date.now();
  startVoiceInput();
  window.clearInterval(fluencyTimer);
  fluencyTimer = window.setInterval(() => {
    response.answer.remaining -= 1;
    if (response.answer.remaining <= 0) {
      response.answer.remaining = 0;
      response.answer.running = false;
      window.clearInterval(fluencyTimer);
      stopVoiceInput();
    }
    render();
  }, 1000);
  render();
}

function memoryWaitRemaining() {
  if (!state.memoryWaitStartedAt) return 0;
  return Math.max(0, state.memoryWaitStartedAt + MEMORY_WAIT_MS - Date.now());
}

function prepareLocationAnswer() {
  const response = getResponse("orientation");
  if (response.behavior.location || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      response.behavior.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        at: new Date().toISOString()
      };
      await reverseGeocodeLocation(response);
      saveDraft();
      render();
    },
    () => {
      response.behavior.location = { error: "定位未授权或不可用", at: new Date().toISOString() };
      saveDraft();
      render();
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

async function reverseGeocodeLocation(response) {
  const loc = response.behavior.location;
  if (!loc || loc.error) return;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${loc.latitude}&lon=${loc.longitude}&accept-language=zh-CN`;
    const data = await fetch(url).then((entry) => entry.json());
    loc.address = data.display_name || "";
    loc.city = data.address?.city || data.address?.town || data.address?.county || "";
    loc.place = data.name || data.address?.building || data.address?.road || loc.address;
    getResponse("orientation").answer.expectedCity = loc.city || "";
    getResponse("orientation").answer.expectedPlace = loc.place || "";
  } catch {
    // Coordinates are still kept for backend review.
  }
}

function locationStatus() {
  const location = getResponse("orientation").behavior.location;
  if (!location) return "定位未获取";
  if (location.error) return location.error;
  if (location.city || location.place) return `已获取：${location.city || ""} ${location.place || ""}`;
  return "已记录当前位置";
}

async function requestJson(path, options, fallback) {
  try {
    const response = await fetch(path, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    return fallback(error);
  }
}

function readLocalSessions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalSessions(sessions) {
  localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
}

function localSaveSession(payload) {
  const sessions = readLocalSessions();
  const saved = { ...payload, id: payload.id || crypto.randomUUID(), savedAt: new Date().toISOString(), storageMode: "browser-local" };
  const index = sessions.findIndex((entry) => entry.id === saved.id);
  if (index >= 0) sessions[index] = saved;
  else sessions.unshift(saved);
  writeLocalSessions(sessions);
  return saved;
}

function localListSessions() {
  return readLocalSessions().map((session) => ({
    id: session.id,
    participant: session.participant,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    totalDurationMs: session.totalDurationMs,
    rawScore: session.rawScore,
    educationBonus: session.educationBonus,
    totalScore: session.totalScore,
    riskBand: session.riskBand,
    itemCount: session.itemResponses?.length || 0,
    storageMode: session.storageMode || "browser-local"
  }));
}

function localAiScore(payload) {
  const maxScore = Number.isFinite(Number(payload.maxScore)) ? Number(payload.maxScore) : 0;
  let scoreSuggestion = typeof payload.clientAutoScore === "number" ? payload.clientAutoScore : null;
  if (scoreSuggestion === null && payload.image && ["cube", "clock"].includes(payload.taskId) && payload.clientAutoScore !== 0) scoreSuggestion = maxScore;
  if (scoreSuggestion === null) scoreSuggestion = 0;
  scoreSuggestion = Math.max(0, Math.min(maxScore, Math.round(scoreSuggestion)));
  return { mode: "browser-local-demo", taskId: payload.taskId, scoreSuggestion, confidence: payload.image ? 0.68 : 0.82, requiresHumanReview: false, rubricMatched: true };
}

async function scoreTaskWithAi(task) {
  const image = task.type === "drawing" || task.type === "trail" ? captureCanvas(task.id) : null;
  const response = getResponse(task.id);
  const payload = {
    taskId: task.id,
    taskType: task.type,
    image,
    answer: response.answer,
    rubric: task.scoring,
    maxScore: task.maxScore,
    clientAutoScore: clientAutoScoreForAi(task, response)
  };
  const result = await requestJson("/api/ai-score", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }, () => localAiScore(payload));
  if (image) response.drawingImage = image;
  return result;
}

function needsAiScore(task) {
  return ["trail", "drawing", "sentence", "fluency", "abstractionSpeech", "recall"].includes(task.type);
}

function clientAutoScoreForAi(task, response) {
  if (task.type === "trail") return scoreTrail().score;
  if (task.type === "sentence") return scoreSentenceTranscript(task, response);
  if (task.type === "fluency") return uniqueWords(response.answer?.animals || []).length >= 11 ? 1 : 0;
  if (task.type === "abstractionSpeech") return scoreAbstractionSpeech(task, response);
  if (task.type === "recall") return scoreRecallText(response);
  if (task.type === "orientation") return scoreOrientationByInputs(response);
  return null;
}

function computeTaskScore(task, response = getResponse(task.id)) {
  const aiScore = aiScoreValue(task, response);
  if (task.type === "trail") return scoreTrail().score;
  if (task.id === "cube" || task.id === "clock") return aiScore ?? 0;
  if (task.type === "naming") return task.items.reduce((sum, item) => sum + (response.answer?.[item.key] === item.answer ? 1 : 0), 0);
  if (task.type === "memory") return 0;
  if (task.type === "choice") return (response.answer?.sequence || []).join("") === task.answer ? 1 : 0;
  if (task.type === "vigilance") return scoreVigilance(response);
  if (task.type === "serial7") return scoreSerial7(response).score;
  if (task.type === "sentence") return aiScore ?? 0;
  if (task.type === "fluency") return aiScore ?? (uniqueWords(response.answer?.animals || []).length >= 11 ? 1 : 0);
  if (task.type === "abstractionSpeech") return aiScore ?? scoreAbstractionSpeech(task, response);
  if (task.type === "recall") return aiScore ?? 0;
  if (task.type === "orientation") return aiScore ?? scoreOrientationByInputs(response);
  return 0;
}

function aiScoreValue(task, response) {
  const value = response.ai?.scoreSuggestion;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(task.maxScore, Math.round(value)));
}

function scoreTrail() {
  const exact = state.trail.sequence.length === TRAIL_EXPECTED.length && state.trail.sequence.every((label, index) => label === TRAIL_EXPECTED[index]);
  return { score: exact && !trailHasCrossing() ? 1 : 0 };
}

function trailHasCrossing() {
  if (state.trail.sequence.length < 4) return false;
  const canvas = activeCanvas || document.querySelector("#taskCanvas");
  if (!canvas) return false;
  const nodes = trailNodes(canvas);
  const points = state.trail.sequence.map((label) => nodes.find((node) => node.label === label)).filter(Boolean);
  for (let i = 0; i < points.length - 1; i += 1) {
    for (let j = i + 2; j < points.length - 1; j += 1) {
      if (segmentsIntersect(points[i], points[i + 1], points[j], points[j + 1])) return true;
    }
  }
  return false;
}

function segmentsIntersect(a, b, c, d) {
  const det = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return det(a, b, c) * det(a, b, d) < 0 && det(c, d, a) * det(c, d, b) < 0;
}

function scoreVigilance(response) {
  const taps = response.answer?.taps || [];
  const startedAt = response.answer?.startedAt || 0;
  if (!startedAt) return 0;
  const schedule = response.behavior?.vigilanceDigits?.length ? response.behavior.vigilanceDigits : VIGILANCE_DIGITS.map((digit, index) => ({ digit, at: startedAt + index * 1000 }));
  const expectedWindows = schedule.map((entry) => ({ digit: entry.digit, start: entry.at, end: entry.at + 1100 })).filter((entry) => entry.digit === "1");
  const misses = expectedWindows.filter((window) => !taps.some((tap) => tap >= window.start && tap <= window.end)).length;
  const falseTaps = taps.filter((tap) => !expectedWindows.some((window) => tap >= window.start && tap <= window.end)).length;
  const errors = misses + falseTaps;
  response.behavior.vigilance = { misses, falseTaps, errors };
  return errors >= 2 ? 0 : 1;
}

function scoreSerial7(response) {
  const values = (response.answer?.values || []).map((value) => Number(value));
  let correct = 0;
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) return;
    if (index === 0 && value === 93) correct += 1;
    if (index > 0 && Number.isFinite(values[index - 1]) && value === values[index - 1] - 7) correct += 1;
  });
  response.behavior.serial7CorrectSteps = correct;
  return { correct, score: correct >= 4 ? 3 : correct >= 2 ? 2 : correct === 1 ? 1 : 0 };
}

function scoreSentenceTranscript(task, response) {
  const transcript = response.answer?.transcript || {};
  return task.sentences.reduce((sum, sentence, index) => sum + (normalizeText(transcript[index]) === normalizeText(sentence) ? 1 : 0), 0);
}

function scoreAbstractionSpeech(task, response) {
  const transcript = response.answer?.transcript || {};
  return task.items.reduce((sum, item, index) => {
    const text = normalizeText(transcript[index] || "");
    return sum + ((item.accepted || []).some((keyword) => text.includes(normalizeText(keyword))) ? 1 : 0);
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
  const expectedCity = normalizeText(answer.expectedCity || "");
  const expectedPlace = normalizeText(answer.expectedPlace || "");
  const city = normalizeText(answer.city);
  const place = normalizeText(answer.place);
  if (city && (expectedCity ? city.includes(expectedCity) || expectedCity.includes(city) : true)) score += 1;
  if (place && (expectedPlace ? place.includes(expectedPlace) || expectedPlace.includes(place) : true)) score += 1;
  return score;
}

function todayParts() {
  const now = new Date();
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return { year: String(now.getFullYear()), month: String(now.getMonth() + 1), day: String(now.getDate()), weekday: weekdays[now.getDay()] };
}

function normalizeText(text) {
  return String(text || "").replace(/\s/g, "").replace(/市$/, "");
}

function uniqueWords(words) {
  return [...new Set((words || []).map((word) => normalizeText(word)).filter(Boolean))];
}

function extractAnimalNames(text) {
  const normalized = normalizeText(text);
  const fromBank = animalNameBank.filter((name) => normalized.includes(name));
  const fromSeparators = String(text || "").split(/[，,、\s]+/).map((word) => normalizeText(word)).filter(Boolean);
  return uniqueWords(fromBank.concat(fromSeparators));
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
  const totalDurationMs = Object.values(state.responses).reduce((sum, response) => sum + (response.durationMs || 0), 0);
  return { rawScore, educationBonus, totalScore, totalDurationMs, completed, domainScores, riskBand: totalScore >= 26 ? "正常范围（附件阈值 ≥26）" : "低于 26 分，建议进一步评估" };
}

function educationBonusForLevel(level) {
  return ["小学", "初中", "中专", "高中"].includes(level) ? 1 : 0;
}

function estimatedDataUrlBytes(value) {
  if (typeof value !== "string") return 0;
  const comma = value.indexOf(",");
  const body = comma >= 0 ? value.slice(comma + 1) : value;
  return Math.round((body.length * 3) / 4);
}

function compactAnswerForBackend(answer) {
  const copy = JSON.parse(JSON.stringify(answer || {}));
  if (!copy.audioRecordings) return copy;
  copy.audioRecordings = Object.fromEntries(
    Object.entries(copy.audioRecordings).map(([step, recording]) => [
      step,
      {
        stored: false,
        bytes: estimatedDataUrlBytes(recording),
        note: "后台保留语音识别文本和录音元数据，不保存原始音频文件。"
      }
    ])
  );
  return copy;
}

function buildSessionPayload({ includeAudioBlobs = false } = {}) {
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
        answer: includeAudioBlobs ? response.answer : compactAnswerForBackend(response.answer),
        behavior: response.behavior,
        drawingImage: response.drawingImage || state.drawings[task.id],
        ai: response.ai
      };
    })
  };
}

async function saveSession() {
  state.finishedAt = state.finishedAt || new Date().toISOString();
  const payload = buildSessionPayload();
  const saved = await requestJson("/api/sessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }, () => localSaveSession(payload));
  state.sessionId = saved.id;
  state.selectedSession = saved;
  await loadSessions(false);
  state.view = "admin";
  render();
}

async function loadSessions(shouldRender = false) {
  state.adminSessions = await requestJson("/api/sessions", undefined, () => localListSessions());
  if (shouldRender) render();
}

async function selectSavedSession(id) {
  state.selectedSession = await requestJson(`/api/sessions/${encodeURIComponent(id)}`, undefined, () => readLocalSessions().find((entry) => entry.id === id) || null);
  render();
}

function stopTimers() {
  stopTrailGuide();
  window.clearInterval(vigilanceTimer);
  window.clearInterval(fluencyTimer);
}
