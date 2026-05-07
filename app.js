const WORDS = ["面孔", "天鹅绒", "教堂", "菊花", "红色"];
const TRAIL_EXPECTED = ["1", "甲", "2", "乙", "3", "丙", "4", "丁", "5", "戊"];
const VIGILANCE_DIGITS = "152945".split("");
const DIGIT_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const MEMORY_WAIT_MS = 5 * 60 * 1000;
const LOCAL_SESSIONS_KEY = "moca-game-local-sessions";
const LOGO_SRC = "./assets/logo.svg";
const MOCA_SHEET_IMAGE = "./assets/moca/moca-page.png";
const NATURAL_VOICE_HINTS = ["xiaoxiao", "xiaoyi", "xiaobei", "ting-ting", "tingting", "mei-jia", "meijia", "google 普通话", "google 國語", "mandarin", "普通话", "美佳", "sin-ji"];
const MEMORY_OPTIONS_A = ["面孔", "学校", "红色", "天鹅绒", "苹果", "教堂", "火车", "菊花", "尺子", "蓝色"];
const MEMORY_OPTIONS_B = ["菊花", "鼻子", "天鹅绒", "绿色", "面孔", "医院", "红色", "自行车", "教堂", "手掌"];
const ABSTRACTION_DISTRACTORS = ["电脑", "学校", "无聊", "天气", "杯子", "音乐", "铅笔", "花园", "电视", "袜子", "面包", "椅子", "彩虹", "玩具", "月亮", "云朵"];
const CITY_DISTRACTORS = ["北京市", "上海市", "杭州市", "苏州市", "广州市", "深圳市", "成都市", "武汉市", "西安市", "青岛市", "厦门市", "天津市"];
const PLACE_SEARCH_TERMS = ["医院", "学校", "社区中心", "大学", "公园", "图书馆", "体育中心", "博物馆"];
const MIN_PLACE_DISTRACTOR_KM = 10;
const VOICE_PROFILES = {
  cartoon: { label: "卡通童声", hints: ["xiaoxiao", "xiaoyi", "xiaobei", "tingting", "美佳", "sin-ji"], rateScale: 0.96, pitchOffset: 0.1 },
  gentle: { label: "温柔女声", hints: ["xiaoxiao", "ting-ting", "tingting", "mei-jia", "meijia", "female", "美佳"], rateScale: 1, pitchOffset: -0.04 },
  clear: { label: "清晰慢速", hints: ["google 普通话", "google 國語", "mandarin", "普通话", "中文"], rateScale: 0.82, pitchOffset: -0.16 },
  system: { label: "系统默认", hints: [], rateScale: 1.04, pitchOffset: -0.26 }
};
const VOICE_PROFILE_ORDER = ["cartoon", "gentle", "clear", "system"];

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
    modality: "拖拽连线",
    prompt: "请从一个圆圈拖线连到另一个圆圈，按数字和汉字交替上升的规则完成。",
    instruction: "请按数字和汉字交替上升的规则，把所有圆圈用一条线连起来。每次从当前圆圈拖到下一个圆圈。",
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
    instruction: "请您照着这幅图在下面的空白处再画一遍，并尽可能精确。",
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
    instruction: "请您在此处画一个钟表，填上所有的数字并指示出 11 点 10 分。",
    scoring: "轮廓 1 分；数字 1 分；指针 1 分。"
  },
  {
    id: "naming",
    domain: "命名",
    title: "动物命名",
    maxScore: 3,
    type: "naming",
    modality: "逐张看图选择",
    prompt: "这是什么动物？",
    instruction: "请您告诉我这个动物的名字。",
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
    modality: "语音+10选5",
    prompt: "我会读几个词，请您注意听并记住。读完后，把记住的词告诉我。",
    instruction: "这是一个记忆力测验。我会给您读几个词，您要注意听，一定要记住。当我读完后，请选出您记住的词。",
    scoring: "第一次学习不计入总分，仅记录编码表现和用时。",
    trial: 1,
    options: MEMORY_OPTIONS_A
  },
  {
    id: "memory2",
    domain: "延迟回忆",
    title: "词语回忆 第二遍",
    maxScore: 5,
    type: "memory",
    modality: "10选5",
    prompt: "请从这些词中选出刚才记过的 5 个词。",
    instruction: "刚才我给您读了几个词让您记住，请您再尽量回忆一下，选出这些词都有什么。",
    scoring: "选出一个正确词给 1 分，共 5 分。",
    trial: 2,
    options: MEMORY_OPTIONS_B
  },
  {
    id: "digitForward",
    domain: "注意",
    title: "数字顺背",
    maxScore: 1,
    type: "choice",
    modality: "听觉+数字卡",
    prompt: "请听一串数字，听完后按原顺序点击数字卡。",
    instruction: "下面我说一些数字，您仔细听，当我说完时您就跟着照样背出来。",
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
    instruction: "下面我再说一些数字，您仔细听，但是当我说完时您必须按照原数倒着背出来。",
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
    instruction: "下面我要读出一系列数字，请注意听。每当我读到 1 的时候，您就拍一下手。当我读其他的数字时不要拍手。",
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
    instruction: "现在请您做一道计算题，从 100 中减去一个 7，而后从得数中再减去一个 7，一直往下减，直到我让您停下为止。",
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
    instruction: "现在我要对您说一句话，我说完后请您把我说的话尽可能原原本本地重复出来。",
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
    instruction: "请您尽可能快、尽可能多地说出您所知道的动物的名称。时间是 1 分钟。",
    scoring: "1 分钟内说出的动物名称不少于 11 个给 1 分，否则 0 分。神化动物也算正确。"
  },
  {
    id: "abstraction",
    domain: "抽象",
    title: "词语相似性",
    maxScore: 2,
    type: "abstractionChoice",
    modality: "4选1",
    prompt: "请选择两样东西在什么方面相类似。",
    instruction: "请您说说两个词在什么方面相类似，或者说它们有什么共性。",
    scoring: "交通/运输工具 1 分；测量仪器/测量用的 1 分。",
    items: [
      { key: "orangeBanana", words: ["桔子", "香蕉"], emojis: ["🍊", "🍌"], answer: "水果", options: ["水果", "电脑", "学校", "无聊"], practice: true },
      { key: "trainBike", words: ["火车", "自行车"], emojis: ["🚆", "🚲"], answer: "交通工具", options: ["交通工具", "电脑", "学校", "无聊"] },
      { key: "watchRuler", words: ["手表", "尺子"], emojis: ["⌚", "📏"], answer: "测量仪器", options: ["测量仪器", "电脑", "学校", "无聊"] }
    ]
  },
  {
    id: "orientation",
    domain: "定向",
    title: "时间地点定向",
    maxScore: 6,
    type: "orientation",
    modality: "选择题+定位",
    prompt: "请选择现在的时间和地点。",
    instruction: "告诉我今天是什么日期。然后请告诉我这是什么地方，它在哪个城市。",
    scoring: "星期、月份、年份、日期、地点、城市各 1 分。"
  }
];

const rubricGroups = [
  {
    title: "视空间与执行功能",
    items: [
      { title: "交替连线测验", prompt: "请您按照从数字到汉字并逐渐升高的顺序画一条连线。从 1 连向甲，再连向 2，并一直连下去，到戊结束。", scoring: "完全按照 1-甲-2-乙-3-丙-4-丁-5-戊 的顺序进行连线且没有任何交叉线时给 1 分。出现任何错误而没有立刻自我纠正时，给 0 分。", image: true },
      { title: "复制立方体", prompt: "请您照着这幅图在下面的空白处再画一遍，并尽可能精确。", scoring: "完全符合下列标准时给 1 分：图形为三维结构；所有的线都存在；无多余的线；相对的边基本平行，长度基本一致。只要违反其中任何一条，即为 0 分。", image: true },
      { title: "画钟表", prompt: "请您在此处画一个钟表，填上所有的数字并指示出 11 点 10 分。", scoring: "轮廓 1 分：表面必须是个圆，允许有轻微缺陷。数字 1 分：数字完整、无多余、顺序正确且在所属象限内。指针 1 分：必须有两个指针且一起指向正确时间，时针明显短于分针，中心交点在表内且接近中心。", image: true }
    ]
  },
  {
    title: "命名与记忆",
    items: [
      { title: "命名", prompt: "请您告诉我这个动物的名字。", scoring: "每答对一个给 1 分。正确回答是：狮子；犀牛；骆驼或单峰骆驼。", image: true },
      { title: "词语学习", prompt: "我会给您读几个词，您要注意听，一定要记住。读完后，把您记住的词告诉我。", scoring: "学习试次不记分。", image: false },
      { title: "延迟回忆", prompt: "刚才我给您读了几个词让您记住，请您再尽量回忆一下，告诉我这些词都有什么？", scoring: "在未经提示下自由回忆正确的词，每词给 1 分。", image: false }
    ]
  },
  {
    title: "注意",
    items: [
      { title: "数字顺背", prompt: "下面我说一些数字，您仔细听，当我说完时您就跟着照样背出来。", scoring: "复述准确给 1 分。", image: false },
      { title: "数字倒背", prompt: "下面我再说一些数字，您仔细听，但是当我说完时您必须按照原数倒着背出来。", scoring: "倒背正确回答为 2-4-7，复述准确给 1 分。", image: false },
      { title: "警觉性", prompt: "下面我要读出一系列数字，请注意听。每当我读到 1 的时候，您就拍一下手。当我读其他数字时不要拍手。", scoring: "完全正确或只有一次错误给 1 分，否则不给分。错误指读 1 时没有拍手，或读其他数字时拍手。", image: false },
      { title: "连续减 7", prompt: "从 100 中减去一个 7，而后从得数中再减去一个 7，一直往下减。", scoring: "全部错误记 0 分，1 个正确给 1 分，2-3 个正确给 2 分，4-5 个正确给 3 分。每一个减数单独评定。", image: false }
    ]
  },
  {
    title: "语言与抽象",
    items: [
      { title: "句子复述", prompt: "我说完后请您把我说的话尽可能原原本本地重复出来。", scoring: "复述正确，每句话分别给 1 分。复述必须准确，省略、替换或增加不得分。", image: false },
      { title: "词语流畅性", prompt: "请您尽可能快、尽可能多地说出您所知道的动物的名称。时间是 1 分钟。", scoring: "1 分钟内说出的动物名称不少于 11 个给 1 分。龙、凤凰、麒麟等神化动物也算正确。", image: false },
      { title: "词语相似性", prompt: "请您说说两个词在什么方面相类似，或者说它们有什么共性。", scoring: "火车和自行车：运输工具、交通工具、旅行用的。手表和尺子：测量仪器、测量用的。每组正确给 1 分。", image: false }
    ]
  },
  {
    title: "定向",
    items: [
      { title: "时间地点定向", prompt: "告诉我今天是什么日期。再问：告诉我这是什么地方，它在哪个城市？", scoring: "星期、月份、年份、日期、地点、城市每正确回答一项给 1 分。必须回答精确日期和地点，日期多一天或少一天均不给分。", image: false }
    ]
  }
];

const root = document.querySelector("#app");
const educationLevels = ["", "小学", "初中", "中专", "高中", "大专", "本科及以上"];

localStorage.removeItem("moca-game-draft");

let state = createInitialState();
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
let speechPlaybackId = 0;
let speechItemTimer = null;
let micPermissionReady = false;
let vigilanceTimer = null;
let fluencyTimer = null;
let trailGuideFrame = null;
let trailGuideTick = 0;
let trailDragStart = null;
let trailDragPoint = null;
let viewportRenderTimer = null;

updateViewportMetrics();
bindViewportMetrics();
migrateState();
render();

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  resetState();
  render();
});

function updateViewportMetrics() {
  const viewport = window.visualViewport;
  const width = Math.floor(viewport?.width || window.innerWidth || document.documentElement.clientWidth || 1024);
  const height = Math.floor(viewport?.height || window.innerHeight || document.documentElement.clientHeight || 768);
  document.documentElement.style.setProperty("--app-width", `${Math.max(320, width)}px`);
  document.documentElement.style.setProperty("--app-height", `${Math.max(360, height)}px`);
}

function bindViewportMetrics() {
  const updateOnly = () => updateViewportMetrics();
  const updateAndRender = () => {
    updateViewportMetrics();
    window.clearTimeout(viewportRenderTimer);
    viewportRenderTimer = window.setTimeout(() => {
      if (state.view !== "setup") render();
    }, 160);
  };

  window.addEventListener("resize", updateAndRender, { passive: true });
  window.addEventListener("orientationchange", updateAndRender, { passive: true });
  window.visualViewport?.addEventListener("resize", updateAndRender, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateOnly, { passive: true });
}

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
    trail: createTrailState(),
    memoryWaitStartedAt: null,
    resumeAfterMemory2Index: null,
    playedInstructionKeys: {},
    permissions: { microphone: "unknown", location: "unknown" },
    voiceProfile: "cartoon",
    setupAttempted: false,
    adminSessions: [],
    selectedSession: null
  };
}

function createTrailState(overrides = {}) {
  return {
    sequence: [],
    edges: [],
    errors: 0,
    undoCount: 0,
    correctStep: 0,
    ...overrides
  };
}

function normalizeTrailState(trail = {}) {
  const base = createTrailState(trail);
  const edges = Array.isArray(base.edges) && base.edges.length
    ? base.edges
    : trailEdgesFromSequence(base.sequence);
  const summary = summarizeTrailEdges(edges);
  return createTrailState({
    ...base,
    edges: summary.edges,
    sequence: summary.sequence,
    errors: summary.errors,
    correctStep: summary.correctStep,
    undoCount: Number(base.undoCount || 0)
  });
}

function trailEdgesFromSequence(sequence = []) {
  return sequence.slice(0, -1).map((from, index) => ({
    from,
    to: sequence[index + 1],
    at: new Date().toISOString()
  }));
}

function summarizeTrailEdges(edges = []) {
  const sequence = [];
  let errors = 0;
  let correctStep = 0;
  const normalizedEdges = edges
    .filter((edge) => edge?.from && edge?.to && edge.from !== edge.to)
    .map((edge) => {
      const expectedFrom = TRAIL_EXPECTED[correctStep];
      const expectedTo = TRAIL_EXPECTED[correctStep + 1];
      const correct = edge.from === expectedFrom && edge.to === expectedTo;
      if (correct) correctStep += 1;
      else errors += 1;
      if (!sequence.length) sequence.push(edge.from);
      else if (sequence[sequence.length - 1] !== edge.from) sequence.push(edge.from);
      sequence.push(edge.to);
      return { ...edge, correct };
    });
  return { edges: normalizedEdges, sequence, errors, correctStep };
}

function rebuildTrailFromEdges() {
  state.trail = normalizeTrailState(state.trail);
}

function trailEdgesForDrawing() {
  return Array.isArray(state.trail.edges) && state.trail.edges.length
    ? state.trail.edges
    : trailEdgesFromSequence(state.trail.sequence || []);
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
  state.trail = normalizeTrailState(state.trail);
  state.playedInstructionKeys = state.playedInstructionKeys || {};
  state.permissions = state.permissions || { microphone: "unknown", location: "unknown" };
  state.voiceProfile = VOICE_PROFILES[state.voiceProfile] ? state.voiceProfile : "cartoon";
  state.setupAttempted = Boolean(state.setupAttempted);
  state.resumeAfterMemory2Index = Number.isInteger(state.resumeAfterMemory2Index) ? state.resumeAfterMemory2Index : null;
}

function saveDraft() {
  localStorage.setItem("moca-game-draft", JSON.stringify(state));
}

function resetState() {
  stopTimers();
  stopAudioPlayback();
  localStorage.removeItem("moca-game-draft");
  state = createInitialState();
  menuOpen = false;
  playState = "开始";
  voiceState = "待说";
}

function isParticipantComplete() {
  return ["name", "birthYear", "sex", "educationLevel"].every((key) => String(state.participant[key] || "").trim());
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
  if (state.view === "test") {
    setupCurrentTask(current);
    scheduleTaskInstruction(current);
  }
}

function renderSetup() {
  return html`
    <div class="setup-screen">
      <div class="floating-stars"><i></i><i></i><i></i></div>
      <section class="setup-panel">
        <div class="setup-left">
          <div class="brand-row">
            <img class="logo-image bounce-in" src="${LOGO_SRC}" alt="MoCA Quest" />
            <div>
              <h1>脑力闯关</h1>
            </div>
          </div>
          <div class="setup-grid">
            ${inputField("participant.name", "姓名", state.participant.name, "", "text", isSetupFieldInvalid("name"))}
            ${inputField("participant.birthYear", "出生年份", state.participant.birthYear, "", "number", isSetupFieldInvalid("birthYear"))}
            ${segmentedField("sex", "性别", state.participant.sex, ["男", "女"], isSetupFieldInvalid("sex"))}
            ${selectField("participant.educationLevel", "教育水平", state.participant.educationLevel, educationLevels, isSetupFieldInvalid("educationLevel"))}
          </div>
        </div>
        <div class="setup-play-zone">
          <div class="play-orbit"><i></i><i></i><i></i></div>
          <button class="primary setup-start-button pulse" data-action="startSession">
            <span>开始</span>
            <small>游戏</small>
          </button>
        </div>
        <button class="skip-login-button" data-action="skipLogin">跳过登录</button>
      </section>
    </div>
  `;
}

function isSetupFieldInvalid(key) {
  return state.setupAttempted && !String(state.participant[key] || "").trim();
}

function inputField(path, label, value, placeholder, type = "text", invalid = false) {
  return html`
    <label class="field ${invalid ? "invalid" : ""}">
      <span>${label}</span>
      <input data-bind="${path}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function selectField(path, label, value, options, invalid = false) {
  return html`
    <label class="field ${invalid ? "invalid" : ""}">
      <span>${label}</span>
      <select data-bind="${path}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${option || "请选择"}</option>`).join("")}
      </select>
    </label>
  `;
}

function segmentedField(key, label, value, options, invalid = false) {
  return html`
    <div class="field segmented-field ${invalid ? "invalid" : ""}">
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
          <button class="drawer-item" data-action="navView" data-view="test">当前任务</button>
          <button class="drawer-item" data-action="navView" data-view="results">本次结果</button>
          <button class="drawer-item" data-action="navView" data-view="design">评分标准</button>
          <button class="drawer-item" data-action="navView" data-view="admin">后台</button>
          <button class="drawer-item" data-action="goHome">返回首页</button>
          <label class="drawer-voice">
            <span>语音风格</span>
            <select data-voice-profile>
              ${VOICE_PROFILE_ORDER.map((key) => `<option value="${key}" ${state.voiceProfile === key ? "selected" : ""}>${VOICE_PROFILES[key].label}</option>`).join("")}
            </select>
          </label>
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
  if (state.view === "design") return "评分标准";
  return "当前任务";
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
      <button class="edge-arrow edge-arrow-left" data-action="previousTask" aria-label="上一题" ${state.activeTaskIndex === 0 && step === 0 ? "disabled" : ""}>‹</button>
      <button class="edge-arrow edge-arrow-right" data-action="skipTask" aria-label="下一步">›</button>
      <div class="task-workspace">${renderTaskWorkspace(task, step)}</div>
      ${renderTaskActions(task, step)}
    </section>
  `;
}

function renderTaskActions(task, step) {
  const secondary = taskActionSecondaryButtons(task);
  const showConfirm = shouldShowConfirmButton(task);
  if (!secondary && !showConfirm) return `<div class="task-actions spacer"></div>`;
  return html`
    <div class="task-actions">
      <div class="task-actions-left">${secondary || ""}</div>
      ${showConfirm ? `<button class="confirm-button" data-action="nextTask">${confirmLabel(task, step)}</button>` : ""}
    </div>
  `;
}

function taskActionSecondaryButtons(task) {
  if (task.type === "trail") return `
    <button class="utility-button" data-action="undoTrail">撤销</button>
    <button class="utility-button" data-action="clearTrail">重画</button>
  `;
  if (task.type === "drawing") return `<button class="utility-button" data-action="clearDrawing">重画</button>`;
  if (task.type === "choice" && getResponse(task.id).answer.audioReady) return `<button class="utility-button" data-action="backspaceDigit">删除</button>`;
  if (task.type === "serial7") return `<button class="utility-button" data-action="backspaceSerial">删除</button>`;
  if (task.type === "memory" && getResponse(task.id).answer.audioReady) return `<button class="utility-button" data-action="playCurrentAudio">重听</button>`;
  return "";
}

function shouldShowConfirmButton(task) {
  if (task.type === "memory") return task.trial === 2 || Boolean(getResponse(task.id).answer.audioReady);
  if (task.type === "choice") return Boolean(getResponse(task.id).answer.audioReady);
  if (task.type === "vigilance") {
    const answer = getResponse(task.id).answer || {};
    return Boolean(answer.startedAt) && !answer.running;
  }
  return true;
}

function getTaskStep(task) {
  const response = getResponse(task.id);
  return Math.min(Number(response.answer?.step || 0), getTaskStepCount(task) - 1);
}

function getTaskStepCount(task) {
  if (task.type === "naming") return task.items.length;
  if (task.type === "serial7") return 5;
  if (task.type === "sentence") return task.sentences.length;
  if (task.type === "abstractionChoice") return task.items.length;
  if (task.type === "orientation") return orientationPrompts.length;
  return 1;
}

function confirmLabel(task, step) {
  if (state.activeTaskIndex === tasks.length - 1 && step >= getTaskStepCount(task) - 1) return "完成";
  return "确定";
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
  if (task.type === "abstractionChoice") return renderAbstractionTask(task, step);
  if (task.type === "orientation") return renderOrientationTask(step);
  return "";
}

function renderTrailTask() {
  return html`
    <div class="trail-page">
      <canvas id="taskCanvas" class="task-canvas" aria-label="交替连线画图区域"></canvas>
    </div>
  `;
}

function renderDrawingTask(task) {
  return html`
    <div class="drawing-page ${task.drawingKind === "clock" ? "clock-page" : ""} ${task.drawingKind === "cube" ? "cube-page" : ""}">
      ${task.drawingKind === "cube" ? `<div class="reference-panel">${cubeReferenceSvg()}</div>` : ""}
      <div class="canvas-wrap">
        ${task.drawingKind === "clock" ? `<div class="clock-label">11:10</div>` : ""}
        <canvas id="taskCanvas" class="task-canvas" aria-label="${escapeHtml(task.title)}画图区域"></canvas>
      </div>
    </div>
  `;
}

function renderNamingTask(task, step) {
  const response = getResponse(task.id);
  const item = task.items[step];
  return html`
    <div class="naming-page">
      <div class="animal-emoji" role="img" aria-label="${escapeHtml(item.answer)}">${animalEmojis[item.key]}</div>
      <div class="animal-side">
        <h4>这是什么动物？</h4>
        <div class="option-grid">
          ${item.options.map((option) => `<button class="option ${response.answer[item.key] === option ? "picked" : ""}" data-action="chooseNaming" data-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMemoryTask(task) {
  const response = getResponse(task.id);
  const selected = response.answer.selectedWords || [];
  const complete = selected.length === WORDS.length;
  const ready = task.trial === 2 || Boolean(response.answer.audioReady);
  return html`
    <div class="memory-page ${ready ? "ready" : ""}">
      <div class="memory-audio">
        ${renderAudioWave()}
        ${task.trial === 1 && !ready ? renderAudioButton("playCurrentAudio") : ""}
      </div>
      ${ready ? `
        <div class="memory-choice-panel">
          <strong>请选择 5 个词</strong>
          <span>${selected.length}/5</span>
        </div>
        <div class="option-grid memory-options">
          ${task.options.map((word) => `<button class="option ${selected.includes(word) ? "picked" : ""}" data-action="toggleMemoryWord" data-word="${escapeHtml(word)}">${escapeHtml(word)}</button>`).join("")}
        </div>
        ${response.behavior.selectionWarning ? `<p class="task-warning">${escapeHtml(response.behavior.selectionWarning)}</p>` : ""}
        ${task.trial === 1 && complete ? `<p class="task-ok">选对后再继续。</p>` : ""}
      ` : `<p class="memory-wait-copy">请先点击开始，听完 5 个词后再选择。</p>`}
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
          ${renderKeypadDigits("appendDigit")}
        </div>
      ` : renderAudioButton("playCurrentAudio")}
    </div>
  `;
}

function renderVigilanceTask() {
  const response = getResponse("vigilance");
  const started = Boolean(response.answer.startedAt);
  const running = Boolean(response.answer.running);
  const taps = response.answer.taps || [];
  return html`
    <div class="vigilance-page">
      <strong class="tap-instruction">听到 1 敲一下</strong>
      ${started ? renderAudioWave() : ""}
      ${!started ? `<button class="primary circle-button pulse" data-action="playCurrentAudio">开始</button>` : running ? `<button class="tap-button pulse" data-action="tapVigilance">敲一下</button><span class="tap-count">已敲 ${taps.length} 次</span>` : `<p class="task-ok">听力反应完成，请点确定。</p>`}
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
      <div class="keypad serial-keypad">
        ${renderKeypadDigits("inputSerialDigit")}
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
      <button class="timer-button ${running ? "running" : "pulse"}" data-action="startFluency">${running ? remaining : "开始"}</button>
      <strong>已识别 ${animals.length} 个</strong>
      <textarea class="transcript-input" data-fluency-manual>${escapeHtml((response.answer.rawTranscript || animals.join("、")) || "点击开始后说动物名")}</textarea>
    </div>
  `;
}

function renderAbstractionTask(task, step) {
  const response = getResponse(task.id);
  const item = task.items[step];
  const value = response.answer[item.key] || "";
  const options = abstractionOptions(response, item);
  return html`
    <div class="abstraction-page">
      <div class="word-pair">
        ${item.words.map((word, index) => `<div class="word-card"><span>${item.emojis[index]}</span><strong>${escapeHtml(word)}</strong></div>`).join("")}
      </div>
      <div class="option-grid abstraction-options">
        ${options.map((option) => `<button class="option ${value === option ? "picked" : ""} ${item.practice && option === item.answer ? "guided-option" : ""}" data-action="chooseAbstraction" data-key="${item.key}" data-value="${escapeHtml(option)}">${escapeHtml(option)}${item.practice && option === item.answer ? `<span class="hand-cue">👉</span>` : ""}</button>`).join("")}
      </div>
      ${response.behavior.selectionWarning ? `<p class="task-warning">${escapeHtml(response.behavior.selectionWarning)}</p>` : ""}
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
      <div class="option-grid orientation-options">
        ${options.map((option) => `<button class="option ${picked === option.value ? "picked" : ""}" data-action="chooseOrientation" data-key="${prompt.key}" data-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderSpeechCard(transcript) {
  const value = transcript === "等待语音识别..." ? "" : transcript;
  return html`
    <div class="speech-page">
      ${renderAudioWave()}
      ${renderAudioButton("playCurrentAudio")}
      <textarea class="transcript-input" data-voice-manual placeholder="语音识别结果会显示在这里，也可以手动修改。">${escapeHtml(value)}</textarea>
    </div>
  `;
}

function renderSpeechControls(transcript) {
  const value = transcript === "等待语音识别..." ? "" : transcript;
  return html`
    ${renderAudioWave()}
    ${renderAudioButton("playCurrentAudio")}
    <textarea class="transcript-input" data-voice-manual placeholder="语音识别结果会显示在这里，也可以手动修改。">${escapeHtml(value)}</textarea>
  `;
}

function renderAudioWave() {
  const active = playState === "播放中..." || recognizing || recordingAudio;
  const label = playState === "播放中..." ? "播放中..." : voiceState && voiceState !== "待说" ? voiceState : recognizing || recordingAudio ? "请说" : "";
  return html`
    <div class="audio-wave ${active ? "active" : ""}" aria-label="${escapeHtml(label)}">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    ${label ? `<strong class="voice-status">${escapeHtml(label)}</strong>` : ""}
  `;
}

function renderAudioButton(action) {
  if (playState === "播放中...") return `<button class="primary circle-button pulse sound-button" disabled>播放中</button>`;
  if (recognizing || recordingAudio) return `<button class="secondary circle-button sound-button" data-action="toggleVoiceInput">停止</button>`;
  return `<button class="primary circle-button pulse sound-button" data-action="${action}">开始</button>`;
}

function renderKeypadDigits(action) {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""]
    .map((digit) => digit
      ? `<button data-action="${action}" data-digit="${digit}">${digit}</button>`
      : `<span class="keypad-spacer"></span>`)
    .join("");
}

function renderResults() {
  const totals = computeTotals();
  const success = totals.totalScore >= 26;
  return html`
    <section class="single-page results-page">
      <div class="result-hero ${success ? "celebrate" : "soft-alert"}">
        <div class="confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="result-sparkles"><i></i><i></i><i></i><i></i></div>
        <img class="result-logo ${success ? "bounce-in" : "floaty"}" src="${LOGO_SRC}" alt="" />
        <span>${success ? "闯关完成" : "闯关结束"}</span>
        <strong>${totals.totalScore}<em>/30</em></strong>
        <p>${success ? "表现很棒，继续保持。" : "这次有点吃力，建议再做一次专业评估。"}</p>
        ${renderRadarChart(totals.domainScores)}
        <div class="result-medals">
          <b>专注</b><b>记忆</b><b>反应</b>
        </div>
      </div>
      <div class="control-row results-actions">
        <button class="primary" data-action="saveSession">保存到后台数据库</button>
        <button class="ghost" data-action="newSession">再玩一次</button>
      </div>
    </section>
  `;
}

function renderRadarChart(domainScores) {
  const domains = Object.entries(domainScores || {}).filter(([, value]) => value.max > 0);
  if (!domains.length) return "";
  const center = 130;
  const radius = 78;
  const labelRadius = 108;
  const axis = domains.map(([name], index) => radarPoint(index, domains.length, labelRadius, center));
  const valuePoints = domains.map(([, value], index) => {
    const ratio = value.max ? Math.max(0, Math.min(1, value.score / value.max)) : 0;
    return radarPoint(index, domains.length, radius * ratio, center);
  });
  const rings = [0.25, 0.5, 0.75, 1].map((ratio) => domains.map((entry, index) => radarPoint(index, domains.length, radius * ratio, center)));
  return html`
    <div class="radar-card">
      <div class="radar-pulse"></div>
      <svg class="radar-chart" viewBox="0 0 260 260" role="img" aria-label="各分项得分雷达图">
        ${rings.map((ring) => `<polygon class="radar-ring" points="${pointsAttr(ring)}" />`).join("")}
        ${axis.map((point) => `<line class="radar-axis" x1="${center}" y1="${center}" x2="${point.x}" y2="${point.y}" />`).join("")}
        <polygon class="radar-area" points="${pointsAttr(valuePoints)}" />
        ${valuePoints.map((point) => `<circle class="radar-dot" cx="${point.x}" cy="${point.y}" r="4" />`).join("")}
        ${domains.map(([name, value], index) => {
          const point = axis[index];
          return `<text class="radar-label" x="${point.x}" y="${point.y}" text-anchor="middle">${escapeHtml(shortDomainName(name))} ${value.score}/${value.max}</text>`;
        }).join("")}
      </svg>
    </div>
  `;
}

function radarPoint(index, total, radius, center) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  return {
    x: Number((center + Math.cos(angle) * radius).toFixed(1)),
    y: Number((center + Math.sin(angle) * radius).toFixed(1))
  };
}

function pointsAttr(points) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function shortDomainName(name) {
  return String(name || "").replace("视空间与执行功能", "视空间").replace("延迟回忆", "回忆").replace("语言", "语言").replace("注意", "注意");
}

function renderAdmin() {
  return html`
    <section class="single-page admin-page">
      <div class="admin-toolbar">
        <button class="primary" data-action="loadSessions">刷新数据库</button>
        <button class="secondary" data-action="saveSession">保存当前测评</button>
        <button class="secondary" data-action="exportCsv">导出 CSV</button>
      </div>
      <div class="admin-table">
        <div class="admin-head"><span>参加者</span><span>总分</span><span>原始分</span><span>保存时间</span></div>
        ${(state.adminSessions || []).map((session) => `
          <button class="admin-row ${state.selectedSession?.id === session.id ? "active" : ""}" data-action="selectSavedSession" data-id="${session.id}">
            <span>${escapeHtml(session.participant?.name || session.id.slice(0, 8))}</span>
            <strong>${session.totalScore ?? "-"}/30</strong>
            <span>${session.rawScore ?? "-"}</span>
            <span>${session.finishedAt ? new Date(session.finishedAt).toLocaleString() : "-"}</span>
          </button>
        `).join("") || `<p class="empty">暂无保存记录</p>`}
      </div>
      ${state.selectedSession ? renderSessionDetail(state.selectedSession) : `<pre class="json-preview">${escapeHtml(databaseSchemaText())}</pre>`}
    </section>
  `;
}

function renderSessionDetail(session) {
  const participant = session.participant || {};
  const itemResponses = Array.isArray(session.itemResponses) ? session.itemResponses : [];
  return html`
    <aside class="admin-detail">
      <div class="detail-header">
        <span>测评详情</span>
        <strong>${escapeHtml(participant.name || session.id || "未命名")}</strong>
      </div>
      <div class="detail-summary">
        ${detailMetric("总分", `${session.totalScore ?? "-"}/30`)}
        ${detailMetric("原始分", session.rawScore ?? "-")}
        ${detailMetric("教育加分", session.educationBonus ?? "-")}
        ${detailMetric("题目数", itemResponses.length || session.itemCount || "-")}
        ${detailMetric("出生年份", participant.birthYear || "-")}
        ${detailMetric("性别", participant.sex || participant.gender || "-")}
        ${detailMetric("教育水平", participant.educationLevel || "-")}
        ${detailMetric("保存时间", session.savedAt ? new Date(session.savedAt).toLocaleString() : "-")}
      </div>
      <div class="item-detail-list">
        ${itemResponses.map((item, index) => renderItemDetail(item, index)).join("") || `<p class="empty">这条记录没有题目明细</p>`}
      </div>
    </aside>
  `;
}

function detailMetric(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderItemDetail(item, index) {
  return html`
    <details class="item-detail" ${index === 0 ? "open" : ""}>
      <summary>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.title || item.taskId || "未命名题目")}</strong>
        <em>${escapeHtml(item.score ?? "-")}/${escapeHtml(item.maxScore ?? "-")}</em>
      </summary>
      <div class="item-detail-body">
        <div class="detail-chips">
          <span>${escapeHtml(item.domain || "未分类")}</span>
          <span>${escapeHtml(item.modality || "未记录")}</span>
          <span>${escapeHtml(item.durationMs ?? "-")} ms</span>
        </div>
        ${renderDetailJson("答案 answer_json", item.answer || {})}
        ${renderDetailJson("行为记录 behavior_json", item.behavior || {})}
        ${renderDetailJson("AI 评分 ai_json", item.ai || null)}
        ${renderDrawingPreview(item.drawingImage)}
      </div>
    </details>
  `;
}

function renderDetailJson(label, value) {
  return html`
    <section class="detail-block">
      <h4>${escapeHtml(label)}</h4>
      <pre>${escapeHtml(prettyJson(value))}</pre>
    </section>
  `;
}

function renderDrawingPreview(image) {
  if (!image || typeof image !== "string") {
    return html`
      <section class="detail-block">
        <h4>画图 drawing_image</h4>
        <p class="detail-empty">这道题没有画图图片</p>
      </section>
    `;
  }
  return html`
    <section class="detail-block">
      <h4>画图 drawing_image</h4>
      <div class="drawing-preview">
        <img src="${escapeHtml(image)}" alt="画图作答图片" />
      </div>
    </section>
  `;
}

function prettyJson(value) {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value ?? null, null, 2);
}

function renderDesign() {
  return html`
    <section class="single-page design-page">
      <div class="rubric-page-head">
        <h3>评分标准</h3>
        <p>点击每个项目查看任务要求和评分标准。</p>
      </div>
      <div class="rubric-layout">
        ${rubricGroups.map((group) => renderRubricGroup(group)).join("")}
      </div>
    </section>
  `;
}

function renderRubricGroup(group) {
  return html`
    <section class="rubric-group">
      <h4>${escapeHtml(group.title)}</h4>
      <div class="rubric-cards">
        ${group.items.map((item) => `
          <details class="rubric-card">
            <summary>${escapeHtml(item.title)}</summary>
            <div class="rubric-card-body">
              <strong>任务要求</strong>
              <p>${escapeHtml(item.prompt)}</p>
              <strong>评分标准</strong>
              <p>${escapeHtml(item.scoring)}</p>
              ${item.image ? `<img class="rubric-sheet-image" src="${MOCA_SHEET_IMAGE}" alt="MoCA 原表图片" />` : ""}
            </div>
          </details>
        `).join("")}
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
    if (!node) return;
    trailDragStart = node;
    trailDragPoint = point;
    canvas.setPointerCapture(event.pointerId);
    drawTrailCanvas(canvas);
  };
  canvas.onpointermove = (event) => {
    if (!trailDragStart) return;
    trailDragPoint = canvasPoint(event, canvas);
    drawTrailCanvas(canvas);
  };
  canvas.onpointerup = (event) => {
    if (!trailDragStart) return;
    const point = canvasPoint(event, canvas);
    const endNode = nearestTrailNode(point, canvas);
    commitTrailDrag(trailDragStart, endNode, canvas);
    trailDragStart = null;
    trailDragPoint = null;
    canvas.releasePointerCapture(event.pointerId);
    drawTrailCanvas(canvas);
    state.drawings.trail = canvas.toDataURL("image/png");
    saveDraft();
    render();
  };
  canvas.onpointercancel = () => {
    trailDragStart = null;
    trailDragPoint = null;
    drawTrailCanvas(canvas);
  };
  if (shouldShowTrailGuide()) startTrailGuide();
  else drawTrailCanvas(canvas);
}

function commitTrailDrag(startNode, endNode, canvas) {
  const response = getResponse("trail");
  if (!endNode || startNode.label === endNode.label) {
    response.behavior.missedDrops = (response.behavior.missedDrops || 0) + 1;
    return;
  }
  state.trail.edges = state.trail.edges || [];
  state.trail.edges.push({
    from: startNode.label,
    to: endNode.label,
    at: new Date().toISOString()
  });
  rebuildTrailFromEdges();
  response.behavior.sequence = [...state.trail.sequence];
  response.behavior.edges = [...state.trail.edges];
  response.behavior.errors = state.trail.errors;
  response.behavior.correctStep = state.trail.correctStep;
  response.behavior.mode = "drag-line";
  response.behavior.lastDrag = {
    from: startNode.label,
    to: endNode?.label || "",
    at: new Date().toISOString()
  };
  if (canvas) response.drawingImage = canvas.toDataURL("image/png");
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
  let fingerCue = null;

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
    const progress = (tick % 120) / 120;
    const moving = {
      x: guide[0].x + (guide[1].x - guide[0].x) * progress,
      y: guide[0].y + (guide[1].y - guide[0].y) * progress
    };
    const angle = Math.atan2(guide[1].y - guide[0].y, guide[1].x - guide[0].x);
    fingerCue = { ...moving, angle };
  }

  const nodeMap = new Map(nodes.map((node) => [node.label, node]));
  const edges = trailEdgesForDrawing();
  edges.forEach((edge) => {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from || !to) return;
    activeCtx.strokeStyle = "#20a66b";
    activeCtx.lineWidth = 5;
    activeCtx.setLineDash([]);
    activeCtx.beginPath();
    activeCtx.moveTo(from.x, from.y);
    activeCtx.lineTo(to.x, to.y);
    activeCtx.stroke();
  });
  activeCtx.setLineDash([]);

  if (trailDragStart && trailDragPoint) {
    activeCtx.strokeStyle = "rgba(32, 166, 107, 0.72)";
    activeCtx.lineWidth = 6;
    activeCtx.setLineDash([12, 10]);
    activeCtx.beginPath();
    activeCtx.moveTo(trailDragStart.x, trailDragStart.y);
    activeCtx.lineTo(trailDragPoint.x, trailDragPoint.y);
    activeCtx.stroke();
    activeCtx.setLineDash([]);
  }

  nodes.forEach((node) => {
    const used = state.trail.sequence.includes(node.label);
    activeCtx.beginPath();
    activeCtx.fillStyle = used ? "#e8f8ef" : "#ffffff";
    activeCtx.strokeStyle = used ? "#20a66b" : "#243447";
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

  if (fingerCue) drawFingerCue(activeCtx, fingerCue.x, fingerCue.y, tick, fingerCue.angle);
}

function drawFingerCue(ctx, x, y, tick, angle = 0) {
  const bob = Math.sin(tick / 14) * 3;
  const pulse = 1 + Math.sin(tick / 18) * 0.05;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(angle);
  ctx.scale(pulse, pulse);
  ctx.shadowColor = "rgba(36, 52, 71, 0.22)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.font = "64px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("👉", 0, 2);
  ctx.restore();
}

function shouldShowTrailGuide() {
  return Number(state.trail.correctStep || 0) < 2;
}

function trailGuideLabels() {
  const correctStep = Number(state.trail.correctStep || 0);
  if (correctStep === 0) return ["1", "甲"];
  if (correctStep === 1) return ["甲", "2"];
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
    <svg class="reference-svg" viewBox="0 0 140 112" role="img" aria-label="立方体参考图">
      <path d="M34 38 H88 V90 H34 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
      <path d="M34 38 L50 22 H104 L88 38 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
      <path d="M88 38 L104 22 V74 L88 90 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
    </svg>
  `;
}

root.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const current = tasks[state.activeTaskIndex];
  if (action !== "tapVigilance") stopAudioPlayback();

  if (action === "startSession") {
    if (!isParticipantComplete()) {
      state.setupAttempted = true;
      saveDraft();
      render();
      return;
    }
    await startNewSession({ ...state.participant });
  }
  if (action === "skipLogin") {
    await startNewSession({
      name: `访客${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      birthYear: "",
      sex: "",
      educationLevel: ""
    });
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
    resetState();
    state.view = "setup";
    menuOpen = false;
    render();
  }
  if (action === "chooseParticipant") {
    state.participant[target.dataset.key] = target.dataset.value;
    state.setupAttempted = false;
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
    goPreviousStep();
  }
  if (action === "skipTask") await goNextStepOrSkip();
  if (action === "nextTask") await nextTask();
  if (action === "chooseNaming") {
    const response = getResponse(current.id);
    const item = current.items[getTaskStep(current)];
    response.answer[item.key] = target.dataset.value;
    saveDraft();
    render();
  }
  if (action === "toggleMemoryWord") toggleMemoryWord(target.dataset.word);
  if (action === "chooseAbstraction") {
    const response = getResponse("abstraction");
    response.answer[target.dataset.key] = target.dataset.value;
    delete response.behavior.selectionWarning;
    saveDraft();
    render();
  }
  if (action === "playCurrentAudio") playCurrentAudio();
  if (action === "toggleVoiceInput") toggleVoiceInput();
  if (action === "appendDigit") await appendDigit(target.dataset.digit);
  if (action === "backspaceDigit") backspaceDigit();
  if (action === "inputSerialDigit") inputSerialDigit(target.dataset.digit);
  if (action === "backspaceSerial") backspaceSerial();
  if (action === "chooseOrientation") {
    applyOrientationChoice(target.dataset.key, target.dataset.value);
    render();
  }
  if (action === "tapVigilance") tapVigilance();
  if (action === "startFluency") startFluency();
  if (action === "clearDrawing") {
    delete state.drawings[current.id];
    delete getResponse(current.id).drawingImage;
    render();
  }
  if (action === "undoTrail") {
    state.trail.edges = state.trail.edges || [];
    state.trail.edges.pop();
    state.trail.undoCount += 1;
    rebuildTrailFromEdges();
    const response = getResponse("trail");
    response.behavior.sequence = [...state.trail.sequence];
    response.behavior.edges = [...state.trail.edges];
    response.behavior.errors = state.trail.errors;
    response.behavior.correctStep = state.trail.correctStep;
    response.behavior.undoCount = state.trail.undoCount;
    delete state.drawings.trail;
    render();
  }
  if (action === "clearTrail") {
    state.trail = createTrailState({ undoCount: state.trail.undoCount || 0 });
    const response = getResponse("trail");
    response.behavior.sequence = [];
    response.behavior.edges = [];
    response.behavior.errors = 0;
    response.behavior.correctStep = 0;
    delete response.drawingImage;
    delete state.drawings.trail;
    render();
  }
  if (action === "saveSession") await saveSession();
  if (action === "newSession") {
    resetState();
    render();
  }
  if (action === "loadSessions") await loadSessions(true);
  if (action === "exportCsv") await exportSessionsCsv();
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
  if (target.dataset.fluencyManual !== undefined) {
    const response = getResponse("fluency");
    response.answer.rawTranscript = target.value;
    response.answer.animals = extractAnimalNames(target.value);
    saveDraft();
  }
});

root.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.voiceProfile !== undefined) {
    state.voiceProfile = VOICE_PROFILES[target.value] ? target.value : "cartoon";
    saveDraft();
    return;
  }
  if (target.dataset.bind) {
    const [, key] = target.dataset.bind.split(".");
    state.participant[key] = target.value;
    saveDraft();
  }
});

async function startNewSession(participant) {
  const adminSessions = state.adminSessions || [];
  state = createInitialState();
  state.participant = participant;
  state.adminSessions = adminSessions;
  state.startedAt = new Date().toISOString();
  state.activeTaskIndex = 0;
  state.view = "test";
  await requestStartupPermissions();
  render();
}

async function requestStartupPermissions() {
  await Promise.allSettled([
    primeMicrophonePermission(),
    primeLocationPermission()
  ]);
}

async function nextTask() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (!canConfirmTask(task, response)) {
    render();
    return;
  }
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

async function goNextStepOrSkip() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (step < getTaskStepCount(task) - 1) {
    response.answer.step = step + 1;
    saveDraft();
    render();
    return;
  }
  await skipTask();
}

function goPreviousStep() {
  const current = tasks[state.activeTaskIndex];
  const response = getResponse(current.id);
  const step = getTaskStep(current);
  if (step > 0) {
    response.answer.step = step - 1;
    saveDraft();
    render();
    return;
  }

  const previousIndex = previousSequentialIndex(state.activeTaskIndex);
  if (previousIndex >= 0) {
    const previous = tasks[previousIndex];
    state.activeTaskIndex = previousIndex;
    getResponse(previous.id).answer.step = Math.max(0, getTaskStepCount(previous) - 1);
    saveDraft();
  }
  render();
}

async function skipTask() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  response.answer.skipped = true;
  response.behavior.skippedAt = new Date().toISOString();
  if (recognizing || recordingAudio) stopVoiceInput();
  if (task.type === "fluency" && response.answer.running) {
    response.answer.running = false;
    window.clearInterval(fluencyTimer);
    stopVoiceInput();
  }
  if (task.type === "vigilance" && response.answer.running) response.answer.running = false;
  if (task.type === "drawing" || task.type === "trail") response.drawingImage = captureCanvas(task.id);
  finishTask(task.id);
  response.ai = { mode: "skipped", taskId: task.id, scoreSuggestion: 0, confidence: 1, requiresHumanReview: false };
  response.score = 0;
  if (task.id === "memory1" && !state.memoryWaitStartedAt) state.memoryWaitStartedAt = Date.now();
  const nextIndex = nextTaskIndexAfterSubmit(task);
  if (nextIndex < 0) {
    state.view = "results";
    state.finishedAt = new Date().toISOString();
  } else {
    state.activeTaskIndex = nextIndex;
  }
  saveDraft();
  render();
}

function canConfirmTask(task, response) {
  if (task.type === "memory") {
    const selected = response.answer.selectedWords || [];
    if (task.trial === 1 && !response.answer.audioReady) {
      response.behavior.selectionWarning = "请先听完词语";
      return false;
    }
    if (selected.length !== WORDS.length) {
      response.behavior.selectionWarning = "请先选满 5 个词";
      return false;
    }
    const correct = selected.every((word) => WORDS.includes(word)) && WORDS.every((word) => selected.includes(word));
    if (task.trial === 1 && !correct) {
      response.behavior.selectionWarning = "还有词没有选对，请再听一遍或重新选择";
      return false;
    }
    delete response.behavior.selectionWarning;
  }
  if (task.type === "serial7") {
    const values = response.answer.values || [];
    if (!String(values[getTaskStep(task)] || "").trim()) return false;
  }
  if (task.type === "choice" && !(response.answer.sequence || []).length) return false;
  if (task.type === "naming") {
    const item = task.items[getTaskStep(task)];
    if (!response.answer[item.key]) return false;
  }
  if (task.type === "abstractionChoice") {
    const item = task.items[getTaskStep(task)];
    if (!response.answer[item.key]) return false;
    if (item.practice && response.answer[item.key] !== item.answer) {
      response.behavior.selectionWarning = "例题请选择“水果”";
      return false;
    }
    delete response.behavior.selectionWarning;
  }
  if (task.type === "orientation") {
    const prompt = orientationPrompts[getTaskStep(task)];
    if (!response.answer.orientationChoices?.[prompt.key]) return false;
  }
  return true;
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

function previousSequentialIndex(fromIndex) {
  for (let index = fromIndex - 1; index >= 0; index -= 1) {
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

function scheduleTaskInstruction(task) {
  const step = getTaskStep(task);
  const key = `${task.id}:${step}`;
  if (state.playedInstructionKeys[key]) return;
  const text = taskInstructionText(task, step);
  if (!text) return;
  state.playedInstructionKeys[key] = true;
  saveDraft();
  window.setTimeout(() => {
    if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== task.id || getTaskStep(task) !== step) return;
    speakText(text, { rate: 0.82, pitch: 1.18 });
  }, 260);
}

function taskInstructionText(task, step) {
  if (task.type === "naming") return "请您告诉我这个动物的名字。这是什么动物？";
  if (task.type === "sentence") {
    return step === 0
      ? "现在我要对您说一句话，我说完后请您把我说的话尽可能原原本本地重复出来。"
      : "现在我再说另一句话，我说完后请您也把它尽可能原原本本地重复出来。";
  }
  if (task.type === "serial7") {
    return step === 0 ? task.instruction : "再减 7，等于多少？";
  }
  if (task.type === "abstractionChoice") {
    const item = task.items[step];
    return item.practice
      ? "先看一个例子。桔子和香蕉在什么方面相类似？请选择水果。"
      : `请您说说${item.words.join("和")}在什么方面相类似？`;
  }
  if (task.type === "orientation") return orientationPrompts[step].label;
  return task.instruction || task.prompt;
}

function playCurrentAudio() {
  const task = tasks[state.activeTaskIndex];
  const step = getTaskStep(task);
  if (task.type === "memory") {
    const response = getResponse(task.id);
    response.answer.audioReady = false;
    return speakItemsSlow(WORDS, {
      gapMs: 1000,
      rate: 0.72,
      done: () => {
        response.answer.audioReady = true;
        delete response.behavior.selectionWarning;
        saveDraft();
        render();
      }
    });
  }
  if (task.type === "choice") return playDigitStimulus(task);
  if (task.type === "vigilance") return startVigilance();
  if (task.type === "sentence") return speakText(task.sentences[step], { rate: 0.86, done: () => startVoiceInput() });
}

function speakText(text, options = {}) {
  const { rate = 0.82, pitch = 1.18, done, onStart } = options;
  if (!("speechSynthesis" in window)) {
    if (done) done();
    return;
  }
  const playbackId = beginAudioPlayback();
  const profile = currentVoiceProfile();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = clampSpeech(rate * profile.rateScale, 0.55, 1.08);
  utterance.pitch = clampSpeech(pitch + profile.pitchOffset, 0.72, 1.55);
  const voice = pickNaturalVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => {
    if (playbackId !== speechPlaybackId) return;
    playState = "播放中...";
    if (onStart) onStart();
    render();
  };
  utterance.onend = () => {
    if (playbackId !== speechPlaybackId) return;
    playState = "开始";
    render();
    if (done) done();
  };
  utterance.onerror = () => {
    if (playbackId !== speechPlaybackId) return;
    playState = "开始";
    render();
    if (done) done();
  };
  window.speechSynthesis.speak(utterance);
}

function pickNaturalVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter((voice) => /^zh/i.test(voice.lang) || /chinese|mandarin|普通话|中文|國語|国语/i.test(voice.name));
  const profile = currentVoiceProfile();
  const hints = [...profile.hints, ...NATURAL_VOICE_HINTS].map((hint) => hint.toLowerCase());
  return zhVoices.find((voice) => hints.some((hint) => voice.name.toLowerCase().includes(hint))) || zhVoices[0] || null;
}

function speakItemsSlow(items, options = {}) {
  const { gapMs = 1000, rate = 0.72, done, onItemStart } = options;
  if (!("speechSynthesis" in window)) {
    if (done) done();
    return;
  }
  const playbackId = beginAudioPlayback();
  playState = "播放中...";
  render();
  let index = 0;
  const speakNext = () => {
    if (playbackId !== speechPlaybackId) return;
    if (index >= items.length) {
      playState = "开始";
      render();
      if (done) done();
      return;
    }
    const value = items[index];
    if (onItemStart) onItemStart(value, index);
    const utterance = new SpeechSynthesisUtterance(value);
    const profile = currentVoiceProfile();
    utterance.lang = "zh-CN";
    utterance.rate = clampSpeech(rate * profile.rateScale, 0.55, 1.08);
    utterance.pitch = clampSpeech(1.18 + profile.pitchOffset, 0.72, 1.55);
    const voice = pickNaturalVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (playbackId !== speechPlaybackId) return;
      index += 1;
      speechItemTimer = window.setTimeout(speakNext, gapMs);
    };
    utterance.onerror = utterance.onend;
    window.speechSynthesis.speak(utterance);
  };
  speakNext();
}

function beginAudioPlayback() {
  speechPlaybackId += 1;
  if (speechItemTimer) {
    window.clearTimeout(speechItemTimer);
    speechItemTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  return speechPlaybackId;
}

function stopAudioPlayback() {
  if (!("speechSynthesis" in window) && !speechItemTimer && playState !== "播放中...") return;
  speechPlaybackId += 1;
  if (speechItemTimer) {
    window.clearTimeout(speechItemTimer);
    speechItemTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (playState === "播放中...") playState = "开始";
}

function currentVoiceProfile() {
  return VOICE_PROFILES[state.voiceProfile] || VOICE_PROFILES.cartoon;
}

function clampSpeech(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function playDigitStimulus(task) {
  const response = getResponse(task.id);
  response.answer.sequence = [];
  response.answer.audioReady = false;
  response.behavior.digitPlayback = [];
  speakItemsSlow(task.stimulus.split(""), {
    gapMs: 1000,
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
    voiceState = "正在识别";
    render();
  };
  recognition.onend = () => {
    recognizing = false;
    voiceState = recordingAudio ? "已录音，识别已暂停" : "待说";
    render();
  };
  recognition.onerror = (event) => {
    recognizing = false;
    voiceState = speechRecognitionErrorText(event?.error);
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
  const recordingStarted = await startAudioRecording();
  speechRecognition = speechRecognition || initSpeechRecognition();
  if (!speechRecognition) {
    voiceState = recordingStarted ? "已录音，但此浏览器不支持自动转文字" : "当前浏览器不能录音或识别";
    render();
    return;
  }
  try {
    speechRecognition.start();
  } catch {
    voiceState = recordingAudio ? "已录音，识别启动失败" : "识别启动失败";
    render();
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
  voiceState = "待说";
  render();
}

async function startAudioRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    voiceState = "当前浏览器不能录音";
    render();
    return false;
  }
  if (mediaRecorder && mediaRecorder.state === "recording") return true;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micPermissionReady = true;
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
    return true;
  } catch {
    recordingAudio = false;
    voiceState = "请允许麦克风权限";
    render();
    return false;
  }
}

async function primeMicrophonePermission() {
  if (micPermissionReady) return true;
  if (!navigator.mediaDevices?.getUserMedia) {
    state.permissions.microphone = "unsupported";
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    micPermissionReady = true;
    state.permissions.microphone = "granted";
    return true;
  } catch {
    micPermissionReady = false;
    state.permissions.microphone = "denied";
    return false;
  }
}

function speechRecognitionErrorText(error) {
  if (error === "not-allowed" || error === "service-not-allowed") return "请允许麦克风和语音识别权限";
  if (error === "no-speech") return "没有听到声音，请靠近麦克风再试";
  if (error === "audio-capture") return "没有检测到麦克风";
  if (error === "network") return "语音识别网络不可用";
  return "识别未完成，请再试一次";
}

function applyVoiceText(text) {
  if (!text) return;
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (task.type === "memory") response.answer.freeText = text;
  if (task.type === "sentence") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.transcript[step] = text;
  }
  if (task.type === "fluency") {
    response.answer.rawTranscript = text;
    response.answer.animals = extractAnimalNames(text);
  }
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
  if (task.type === "sentence") {
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

function abstractionOptions(response, item) {
  return stableOptionValues(response, `abstraction:${item.key}`, item.answer, ABSTRACTION_DISTRACTORS);
}

function orientationOptions(prompt) {
  const response = getResponse("orientation");
  const today = todayParts();
  if (prompt.key === "year") {
    const year = Number(today.year);
    const distractors = [year - 1, year + 1, year - 2, year + 2, year - 3, year + 3].map(String);
    return optionObjects(stableOptionValues(response, "orientation:year", today.year, distractors), today.year);
  }
  if (prompt.key === "date") {
    const correct = dateOptionValue(0);
    const distractors = [-1, 1, -2, 2, -7, 7, -14, 14].map((offset) => dateOptionValue(offset));
    return optionObjects(stableOptionValues(response, "orientation:date", correct, distractors), correct).map((option) => ({ ...option, label: dateOptionLabel(option.value) }));
  }
  if (prompt.key === "weekday") {
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const index = weekdays.indexOf(today.weekday);
    const distractors = [1, 2, 3, 4, 5, 6].map((offset) => weekdays[(index + offset) % 7]);
    return optionObjects(stableOptionValues(response, "orientation:weekday", today.weekday, distractors), today.weekday);
  }
  if (prompt.key === "city") {
    const expected = cleanCityName(response.answer.expectedCity || response.behavior.location?.city || "南京市");
    return optionObjects(stableOptionValues(response, `orientation:city:${expected}`, expected, CITY_DISTRACTORS), expected);
  }
  const expectedPlace = currentPlaceName();
  const location = response.behavior.location || {};
  const sameCityDistractors = Array.isArray(location.placeDistractors) && location.placeDistractors.length
    ? location.placeDistractors.map((entry) => entry.name)
    : fallbackSameCityPlaceDistractors(expectedPlace, cleanCityName(response.answer.expectedCity || location.city || "本市"));
  return optionObjects(stableOptionValues(response, `orientation:place:${expectedPlace}`, expectedPlace, sameCityDistractors), expectedPlace);
}

function currentPlaceName() {
  const response = getResponse("orientation");
  const location = response.behavior.location || {};
  return response.answer.expectedPlace || location.place || generalizePlaceName(firstLocationPart(location.address)) || "社区中心";
}

function placeNameFromReverse(data, loc) {
  const address = data.address || {};
  const raw = data.name || data.namedetails?.name || address.building || address.amenity || address.road || firstLocationPart(data.display_name);
  const place = specificPlaceName(raw, loc.city);
  if (place) return place;
  return generalizePlaceName(data.display_name || loc.address || "");
}

async function sameCityPlaceDistractors(loc) {
  if (!loc?.city || !Number.isFinite(Number(loc.latitude)) || !Number.isFinite(Number(loc.longitude))) return [];
  const collected = [];
  for (const term of PLACE_SEARCH_TERMS) {
    if (collected.length >= 8) break;
    try {
      const query = encodeURIComponent(`${loc.city} ${term}`);
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=30&accept-language=zh-CN&q=${query}`;
      const entries = await fetch(url).then((entry) => entry.json());
      if (!Array.isArray(entries)) continue;
      entries.forEach((entry) => {
        const lat = Number(entry.lat);
        const lon = Number(entry.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
        const distanceKm = distanceKmBetween(loc.latitude, loc.longitude, lat, lon);
        if (distanceKm < MIN_PLACE_DISTRACTOR_KM) return;
        if (!isSameCityPlace(entry, loc.city)) return;
        const name = specificPlaceName(entry.name || firstLocationPart(entry.display_name), loc.city);
        if (!name || name === loc.place || collected.some((item) => item.name === name)) return;
        collected.push({ name, distanceKm: Number(distanceKm.toFixed(1)), latitude: lat, longitude: lon, source: "nominatim" });
      });
    } catch {
      // Keep trying other search terms.
    }
  }
  if (collected.length >= 3) return shuffle(collected).slice(0, 6);
  return fallbackSameCityPlaceDistractors(loc.place, loc.city).map((name, index) => ({
    name,
    distanceKm: MIN_PLACE_DISTRACTOR_KM + 2 + index * 3,
    synthetic: true,
    source: "same-city-fallback"
  }));
}

function isSameCityPlace(entry, city) {
  const address = entry.address || {};
  const text = [address.city, address.town, address.county, address.state, entry.display_name].filter(Boolean).join(" ");
  const clean = cleanCityName(city);
  return !clean || text.includes(clean) || clean.includes(cleanCityName(text));
}

function fallbackSameCityPlaceDistractors(expectedPlace, city) {
  const prefix = cleanCityName(city).replace(/市$/, "") || "本市";
  return [`${prefix}人民医院`, `${prefix}实验学校`, `${prefix}社区中心`, `${prefix}体育中心`, `${prefix}图书馆`, `${prefix}文化公园`]
    .filter((name) => name && name !== expectedPlace);
}

function distanceKmBetween(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const toRad = (value) => Number(value) * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function firstLocationPart(address) {
  return String(address || "").split(/[，,]/).map((part) => part.trim()).filter(Boolean)[0] || "";
}

function specificPlaceName(value, city = "") {
  const raw = firstLocationPart(value).replace(/\s/g, "");
  if (!raw) return "";
  const cityText = cleanCityName(city).replace(/市$/, "");
  const compact = raw
    .replace(/^中国/, "")
    .replace(new RegExp(`^${escapeRegExp(cityText)}市?`), "")
    .replace(/^(江苏省|浙江省|广东省|四川省|湖北省|陕西省|山东省|福建省|北京市|上海市|天津市|重庆市)/, "");
  if (/医院|门诊|卫生院|卫生服务/.test(compact)) return shortNamedPlace(compact, "医院");
  if (/学校|大学|学院|中学|小学/.test(compact)) return shortNamedPlace(compact, "学校");
  if (/社区|街道|居委|服务中心/.test(compact)) return shortNamedPlace(compact, "社区中心");
  if (/公园|图书馆|体育中心|博物馆|文化馆/.test(compact)) return compact.slice(0, 14);
  if (compact.length >= 2 && compact.length <= 14 && !/^\d+$/.test(compact)) return compact;
  return "";
}

function cleanCityName(value) {
  const text = String(value || "");
  const cityMatch = text.match(/[^省市自治区县区,，\s]{2,12}市/);
  if (cityMatch) return cityMatch[0];
  const countyMatch = text.match(/[^省市自治区县区,，\s]{2,12}(县|区)/);
  if (countyMatch) return countyMatch[0];
  return text.split(/[，,\s]/).find(Boolean) || "南京市";
}

function generalizePlaceName(value) {
  const text = String(value || "");
  if (/医院|门诊|卫生院|卫生服务/.test(text)) return shortNamedPlace(text, "医院");
  if (/学校|大学|学院|中学|小学/.test(text)) return shortNamedPlace(text, "学校");
  if (/社区|街道|居委|服务中心/.test(text)) return shortNamedPlace(text, "社区中心");
  return "社区中心";
}

function shortNamedPlace(text, fallbackSuffix) {
  const compact = String(text || "").replace(/\s/g, "");
  const pattern = fallbackSuffix === "医院" ? /医院|门诊|卫生院|卫生服务/ : fallbackSuffix === "学校" ? /学校|大学|学院|中学|小学/ : /社区|街道|居委|服务中心/;
  const match = compact.match(pattern);
  if (!match) return fallbackSuffix;
  const start = Math.max(0, match.index - 6);
  const end = Math.min(compact.length, match.index + match[0].length);
  const name = compact.slice(start, end);
  if (name.length >= 2) return name.replace(/卫生服务$/, "社区中心").replace(/服务中心$/, "社区中心");
  return fallbackSuffix;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function optionObjects(values, correct) {
  const unique = [...new Set(values.filter(Boolean))];
  return unique.map((value) => ({ value, label: value, correct: value === correct }));
}

function stableOptionValues(response, key, correct, distractors, count = 4) {
  response.behavior.optionOrders = response.behavior.optionOrders || {};
  const saved = response.behavior.optionOrders[key];
  if (Array.isArray(saved) && saved.includes(correct) && saved.length >= count) return saved;
  const uniqueDistractors = [...new Set(distractors.filter((value) => value && value !== correct))];
  const selected = shuffle(uniqueDistractors).slice(0, Math.max(0, count - 1));
  const values = shuffle([correct, ...selected]).slice(0, count);
  response.behavior.optionOrders[key] = values;
  saveDraft();
  return values;
}

function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
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

function toggleMemoryWord(word) {
  const response = getResponse(tasks[state.activeTaskIndex].id);
  response.answer.selectedWords = response.answer.selectedWords || [];
  delete response.behavior.selectionWarning;
  if (response.answer.selectedWords.includes(word)) {
    response.answer.selectedWords = response.answer.selectedWords.filter((entry) => entry !== word);
  } else if (response.answer.selectedWords.length < WORDS.length) {
    response.answer.selectedWords.push(word);
  } else {
    response.behavior.selectionWarning = "最多选择 5 个词";
  }
  saveDraft();
  render();
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
  render();
}

function backspaceDigit() {
  const response = getResponse(tasks[state.activeTaskIndex].id);
  response.answer.sequence = response.answer.sequence || [];
  response.answer.sequence.pop();
  render();
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
    gapMs: 1000,
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
  if (response.behavior.location) return;
  primeLocationPermission({ rerender: true });
}

async function primeLocationPermission(options = {}) {
  const { rerender = false } = options;
  const response = getResponse("orientation");
  if (!navigator.geolocation) {
    state.permissions.location = "unsupported";
    response.behavior.location = { error: "当前设备不支持定位", at: new Date().toISOString() };
    if (rerender) render();
    return false;
  }
  try {
    const position = await getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    state.permissions.location = "granted";
    response.behavior.location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      at: new Date().toISOString()
    };
    await reverseGeocodeLocation(response);
    saveDraft();
    if (rerender) render();
    return true;
  } catch {
    state.permissions.location = "denied";
    response.behavior.location = { error: "定位未授权或不可用", at: new Date().toISOString() };
    saveDraft();
    if (rerender) render();
    return false;
  }
}

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function reverseGeocodeLocation(response) {
  const loc = response.behavior.location;
  if (!loc || loc.error) return;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&namedetails=1&zoom=18&lat=${loc.latitude}&lon=${loc.longitude}&accept-language=zh-CN`;
    const data = await fetch(url).then((entry) => entry.json());
    loc.address = data.display_name || "";
    loc.city = cleanCityName(data.address?.city || data.address?.town || data.address?.county || loc.address || "");
    loc.place = placeNameFromReverse(data, loc);
    loc.placeDistractors = await sameCityPlaceDistractors(loc);
    Object.keys(response.behavior.optionOrders || {}).forEach((key) => {
      if (key.startsWith("orientation:city") || key.startsWith("orientation:place")) delete response.behavior.optionOrders[key];
    });
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
  if (location.city || location.place) return "定位完成";
  return "已记录定位信息";
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
  return ["trail", "drawing", "sentence", "fluency"].includes(task.type);
}

function clientAutoScoreForAi(task, response) {
  if (task.type === "trail") return scoreTrail().score;
  if (task.type === "sentence") return scoreSentenceTranscript(task, response);
  if (task.type === "fluency") return uniqueWords(response.answer?.animals || []).length >= 11 ? 1 : 0;
  if (task.type === "orientation") return scoreOrientationByInputs(response);
  return null;
}

function computeTaskScore(task, response = getResponse(task.id)) {
  const aiScore = aiScoreValue(task, response);
  if (task.type === "trail") return scoreTrail().score;
  if (task.id === "cube" || task.id === "clock") return aiScore ?? 0;
  if (task.type === "naming") return task.items.reduce((sum, item) => sum + (response.answer?.[item.key] === item.answer ? 1 : 0), 0);
  if (task.type === "memory") return task.trial === 2 ? scoreMemoryChoices(response) : 0;
  if (task.type === "choice") return (response.answer?.sequence || []).join("") === task.answer ? 1 : 0;
  if (task.type === "vigilance") return scoreVigilance(response);
  if (task.type === "serial7") return scoreSerial7(response).score;
  if (task.type === "sentence") return aiScore ?? 0;
  if (task.type === "fluency") return aiScore ?? (uniqueWords(response.answer?.animals || []).length >= 11 ? 1 : 0);
  if (task.type === "abstractionChoice") return scoreAbstractionChoice(task, response);
  if (task.type === "orientation") return aiScore ?? scoreOrientationByInputs(response);
  return 0;
}

function aiScoreValue(task, response) {
  const value = response.ai?.scoreSuggestion;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(task.maxScore, Math.round(value)));
}

function scoreTrail() {
  const edges = trailEdgesForDrawing();
  const expectedEdges = TRAIL_EXPECTED.slice(0, -1).map((from, index) => ({ from, to: TRAIL_EXPECTED[index + 1] }));
  const exact = edges.length === expectedEdges.length && edges.every((edge, index) => (
    edge.from === expectedEdges[index].from && edge.to === expectedEdges[index].to
  ));
  return { score: exact && state.trail.errors === 0 && !trailHasCrossing() ? 1 : 0 };
}

function trailHasCrossing() {
  const edges = trailEdgesForDrawing();
  if (edges.length < 3) return false;
  const canvas = activeCanvas || document.querySelector("#taskCanvas");
  if (!canvas) return false;
  const nodes = trailNodes(canvas);
  const nodeMap = new Map(nodes.map((node) => [node.label, node]));
  const segments = edges
    .map((edge) => [nodeMap.get(edge.from), nodeMap.get(edge.to)])
    .filter(([from, to]) => from && to);
  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      const sharedEndpoint = [segments[i][0].label, segments[i][1].label].some((label) => [segments[j][0].label, segments[j][1].label].includes(label));
      if (!sharedEndpoint && segmentsIntersect(segments[i][0], segments[i][1], segments[j][0], segments[j][1])) return true;
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

function scoreAbstractionChoice(task, response) {
  return task.items.reduce((sum, item) => sum + (!item.practice && response.answer?.[item.key] === item.answer ? 1 : 0), 0);
}

function scoreMemoryChoices(response) {
  const selected = response.answer?.selectedWords || [];
  return selected.reduce((sum, word) => sum + (WORDS.includes(word) ? 1 : 0), 0);
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

async function exportSessionsCsv() {
  const sessions = await requestJson("/api/sessions", undefined, () => localListSessions());
  if (!sessions.length) {
    window.alert("暂无可导出的测评数据");
    return;
  }

  const fullSessions = await Promise.all(sessions.map((session) => (
    requestJson(`/api/sessions/${encodeURIComponent(session.id)}`, undefined, () => readLocalSessions().find((entry) => entry.id === session.id) || session)
  )));
  const rows = fullSessions.flatMap(csvRowsForSession);
  const csv = rowsToCsv(rows);
  const filename = `cognition-hearing-game-${formatDateForFilename(new Date())}.csv`;
  downloadTextFile(filename, csv, "text/csv;charset=utf-8");
}

function csvRowsForSession(session) {
  const participant = session.participant || {};
  const itemResponses = Array.isArray(session.itemResponses) && session.itemResponses.length
    ? session.itemResponses
    : [{ taskId: "", title: "", domain: "", modality: "", maxScore: "", score: "", answer: {}, behavior: {}, ai: null }];

  return itemResponses.map((item) => ({
    session_id: session.id || "",
    participant_name: participant.name || "",
    birth_year: participant.birthYear || "",
    gender: participant.sex || participant.gender || "",
    education_level: participant.educationLevel || "",
    session_started_at: session.startedAt || "",
    session_finished_at: session.finishedAt || "",
    saved_at: session.savedAt || "",
    total_duration_ms: session.totalDurationMs ?? "",
    raw_score: session.rawScore ?? "",
    education_bonus: session.educationBonus ?? "",
    total_score: session.totalScore ?? "",
    risk_band: session.riskBand || "",
    domain_scores_json: stringifyForCsv(session.domainScores || {}),
    task_id: item.taskId || "",
    task_title: item.title || "",
    domain: item.domain || "",
    modality: item.modality || "",
    max_score: item.maxScore ?? "",
    score: item.score ?? "",
    item_started_at: item.startedAt || "",
    item_ended_at: item.endedAt || "",
    item_duration_ms: item.durationMs ?? "",
    answer_json: stringifyForCsv(item.answer || {}),
    behavior_json: stringifyForCsv(item.behavior || {}),
    ai_json: stringifyForCsv(item.ai || null),
    drawing_image: item.drawingImage || ""
  }));
}

function stringifyForCsv(value) {
  return JSON.stringify(value ?? null);
}

function rowsToCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(","))
  ].join("\r\n");
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function formatDateForFilename(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob(["\ufeff", content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function stopTimers() {
  stopTrailGuide();
  window.clearInterval(vigilanceTimer);
  window.clearInterval(fluencyTimer);
}
