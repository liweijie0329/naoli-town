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
    modality: "点选连线",
    prompt: "请按照从数字到汉字并逐渐升高的顺序连线：1 连向甲，再连向 2，一直连到戊。",
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
    prompt: "请照着这幅图，在空白区域尽可能精确地画一遍。",
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
    scoring: "轮廓 1 分：表面为圆，允许轻微缺陷；数字 1 分：数字完整、无多余、顺序正确且在所属象限；指针 1 分：两个指针指向正确时间，时针短于分针，中心接近钟表中心。"
  },
  {
    id: "naming",
    domain: "命名",
    title: "动物命名",
    maxScore: 3,
    type: "naming",
    modality: "逐张看图选择",
    prompt: "请看屏幕上的小动物，选择它的名字。",
    scoring: "每答对一个给 1 分。正确答案依次为：狮子、犀牛、骆驼或单峰骆驼。",
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
    modality: "听读记录",
    prompt: "我会读几个词，请您注意听并记住。读完后，把记住的词告诉我，想到哪个说哪个。",
    scoring: "第一次学习不计入总分，但记录编码表现和用时。"
  },
  {
    id: "memory2",
    domain: "记忆",
    title: "词语学习 第二次",
    maxScore: 0,
    type: "memory",
    modality: "听读记录",
    prompt: "我把这些词再读一遍。请努力记住，并把刚才和这次记住的词都告诉我。",
    scoring: "第二次学习不计入总分，结束后提示稍后还要回忆这些词。"
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
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
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
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
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
    modality: "数字输入",
    prompt: "请从 100 中减去 7，再从得数中继续减 7，一直往下算 5 次。",
    scoring: "4-5 个正确给 3 分，2-3 个正确给 2 分，1 个正确给 1 分，0 个正确给 0 分。每一步按患者上一答案继续减 7 独立评定。"
  },
  {
    id: "sentence",
    domain: "语言",
    title: "句子复述",
    maxScore: 2,
    type: "sentence",
    modality: "转写评分",
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
    modality: "60秒记录",
    prompt: "请在 1 分钟内尽可能多地说出动物的名字。",
    scoring: "1 分钟内说出的动物名称不少于 11 个给 1 分，否则 0 分。龙、凤凰、麒麟等神化动物也算正确。"
  },
  {
    id: "abstraction",
    domain: "抽象",
    title: "词语相似性",
    maxScore: 2,
    type: "abstractionSpeech",
    modality: "语音识别",
    prompt: "请听两个词，说出它们在什么方面相类似。",
    scoring: "火车-自行车回答运输工具、交通工具或旅行用的给 1 分；手表-尺子回答测量仪器或测量用的给 1 分。具体特征不给分。",
    items: [
      {
        key: "trainBike",
        pair: "火车 - 自行车",
        answer: "交通工具",
        accepted: ["交通", "运输", "出行", "旅行"]
      },
      {
        key: "watchRuler",
        pair: "手表 - 尺子",
        answer: "测量工具",
        accepted: ["测量", "量", "工具", "仪器"]
      }
    ]
  },
  {
    id: "delayedRecall",
    domain: "延迟回忆",
    title: "无提示延迟回忆",
    maxScore: 5,
    type: "recall",
    modality: "转写评分",
    prompt: "刚才我给您读了几个词，请尽量回忆一下，告诉我这些词都有什么。",
    scoring: "只对未经提示自由回忆正确的词给分，每词 1 分；分类提示和多选提示仅记录临床信息，不计分。"
  },
  {
    id: "orientation",
    domain: "定向",
    title: "时间地点定向",
    maxScore: 6,
    type: "orientation",
    modality: "输入评分",
    prompt: "请依次回答年份、日期、星期、城市和地点。",
    scoring: "星期、月份、年份、日期、地点、城市各 1 分。日期必须精确；地点需为医院、诊所、办公室等具体名称。"
  }
];

function uuid() {
  return `moca-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSession() {
  return {
    view: "setup",
    activeTaskIndex: 0,
    sessionId: uuid(),
    startedAt: null,
    finishedAt: null,
    participant: { name: "", age: "", sex: "", educationLevel: "" },
    responses: {},
    drawings: {},
    trail: { sequence: [], errors: 0, undoCount: 0 },
    adminSessions: [],
    selectedSession: null
  };
}

function getResponse(session, taskId) {
  if (!session.responses[taskId]) {
    const task = tasks.find((entry) => entry.id === taskId);
    session.responses[taskId] = {
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
  return session.responses[taskId];
}

function beginTask(session, taskId) {
  const response = getResponse(session, taskId);
  if (!response.startedAt) {
    response.startedAt = new Date().toISOString();
    response.startedTick = Date.now();
  }
}

function finishTask(session, taskId) {
  const response = getResponse(session, taskId);
  if (!response.startedAt) beginTask(session, taskId);
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

function normalizeText(text) {
  return String(text || "").replace(/\s/g, "").replace(/市$/, "");
}

function uniqueWords(words) {
  return [...new Set((words || []).map((word) => normalizeText(word)).filter(Boolean))];
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

function scoreTrail(session) {
  const exact =
    session.trail.sequence.length === TRAIL_EXPECTED.length &&
    session.trail.sequence.every((label, index) => label === TRAIL_EXPECTED[index]);
  return exact ? 1 : 0;
}

function scoreVigilance(response) {
  const taps = response.answer.taps || [];
  const startedAt = response.answer.startedAt || 0;
  if (!startedAt) return 0;
  const expectedWindows = VIGILANCE_DIGITS.map((digit, index) => ({
    digit,
    start: startedAt + index * 1000,
    end: startedAt + index * 1000 + 850
  })).filter((entry) => entry.digit === "1");
  const misses = expectedWindows.filter((window) => !taps.some((tap) => tap >= window.start && tap <= window.end)).length;
  const falseTaps = taps.filter((tap) => !expectedWindows.some((window) => tap >= window.start && tap <= window.end)).length;
  const errors = misses + falseTaps;
  response.behavior.vigilance = { misses, falseTaps, errors };
  return errors >= 2 ? 0 : 1;
}

function scoreSerial7(response) {
  const values = (response.answer.values || []).map((value) => Number(value));
  let correct = 0;
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) return;
    if (index === 0 && value === 93) {
      correct += 1;
      return;
    }
    const prev = values[index - 1];
    if (index > 0 && Number.isFinite(prev) && value === prev - 7) correct += 1;
  });
  const score = correct >= 4 ? 3 : correct >= 2 ? 2 : correct === 1 ? 1 : 0;
  response.behavior.serial7CorrectSteps = correct;
  return score;
}

function scoreSentenceTranscript(task, response) {
  const transcript = response.answer.transcript || {};
  return task.sentences.reduce((sum, sentence, index) => {
    return sum + (normalizeText(transcript[index]) === normalizeText(sentence) ? 1 : 0);
  }, 0);
}

function scoreAbstractionSpeech(task, response) {
  const transcript = response.answer.transcript || {};
  return task.items.reduce((sum, item, index) => {
    const text = normalizeText(transcript[index] || "");
    const correct = (item.accepted || []).some((keyword) => text.includes(normalizeText(keyword)));
    return sum + (correct ? 1 : 0);
  }, 0);
}

function scoreRecallText(response) {
  const text = normalizeText(response.answer.freeText || "");
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
  if (place && (expectedPlace ? place.includes(expectedPlace) || expectedPlace.includes(place) : true)) score += 1;
  if (city && (expectedCity ? city.includes(expectedCity) || expectedCity.includes(city) : true)) score += 1;
  return score;
}

function aiScoreValue(task, response) {
  const value = response.ai && response.ai.scoreSuggestion;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(task.maxScore, Math.round(value)));
}

function clientAutoScoreForTask(session, task, response) {
  if (task.type === "trail") return scoreTrail(session);
  if (task.type === "sentence") return scoreSentenceTranscript(task, response);
  if (task.type === "fluency") return uniqueWords(response.answer.animals || []).length >= 11 ? 1 : 0;
  if (task.type === "abstractionSpeech") return scoreAbstractionSpeech(task, response);
  if (task.type === "recall") return scoreRecallText(response);
  if (task.type === "orientation") return scoreOrientationByInputs(response);
  return null;
}

function localAiScore(session, task, response, image) {
  const clientAutoScore = clientAutoScoreForTask(session, task, response);
  let scoreSuggestion = typeof clientAutoScore === "number" ? clientAutoScore : null;
  if (scoreSuggestion === null && image && ["cube", "clock"].includes(task.id) && response.behavior.strokes > 0) {
    scoreSuggestion = task.maxScore;
  }
  if (scoreSuggestion === null) scoreSuggestion = 0;
  return {
    mode: "miniprogram-local-demo",
    taskId: task.id,
    scoreSuggestion: Math.max(0, Math.min(task.maxScore, Math.round(scoreSuggestion))),
    confidence: image ? 0.68 : 0.82,
    requiresHumanReview: false,
    comment: "小程序本地演示评分；正式研究请接入云函数或 HTTPS AI 服务。"
  };
}

function scoreTask(session, task, response) {
  const aiScore = aiScoreValue(task, response);
  if (task.type === "trail") return scoreTrail(session);
  if (task.id === "cube" || task.id === "clock") return aiScore || 0;
  if (task.type === "naming") {
    return task.items.reduce((sum, item) => sum + (response.answer[item.key] === item.answer ? 1 : 0), 0);
  }
  if (task.type === "memory") return 0;
  if (task.type === "choice") {
    const value = response.answer.sequence ? response.answer.sequence.join("") : response.answer.value;
    return value === task.answer ? 1 : 0;
  }
  if (task.type === "vigilance") return scoreVigilance(response);
  if (task.type === "serial7") return scoreSerial7(response);
  if (task.type === "sentence") return aiScore || 0;
  if (task.type === "fluency") return aiScore !== null ? aiScore : uniqueWords(response.answer.animals || []).length >= 11 ? 1 : 0;
  if (task.type === "abstractionSpeech") return aiScore !== null ? aiScore : scoreAbstractionSpeech(task, response);
  if (task.type === "multiChoice") {
    return task.items.reduce((sum, item) => sum + (response.answer[item.key] === item.answer ? 1 : 0), 0);
  }
  if (task.type === "recall") return aiScore || 0;
  if (task.type === "orientation") return aiScore !== null ? aiScore : scoreOrientationByInputs(response);
  return 0;
}

function educationBonusForLevel(level) {
  return ["小学", "初中", "中专", "高中"].includes(level) ? 1 : 0;
}

function computeTotals(session) {
  const domainScores = {};
  let rawScore = 0;
  let completed = 0;
  tasks.forEach((task) => {
    const response = getResponse(session, task.id);
    const score = scoreTask(session, task, response);
    response.score = score;
    response.maxScore = task.maxScore;
    if (!domainScores[task.domain]) domainScores[task.domain] = { score: 0, max: 0 };
    domainScores[task.domain].score += score;
    domainScores[task.domain].max += task.maxScore;
    rawScore += score;
    if (response.submitted) completed += 1;
  });
  const educationBonus = educationBonusForLevel(session.participant.educationLevel);
  const totalScore = Math.min(30, rawScore + educationBonus);
  const totalDurationMs = Object.values(session.responses).reduce((sum, response) => sum + (response.durationMs || 0), 0);
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

function buildSessionPayload(session) {
  const totals = computeTotals(session);
  const now = new Date().toISOString();
  return {
    id: session.sessionId,
    participant: session.participant,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt || now,
    totalDurationMs: totals.totalDurationMs,
    rawScore: totals.rawScore,
    educationBonus: totals.educationBonus,
    totalScore: totals.totalScore,
    riskBand: totals.riskBand,
    domainScores: totals.domainScores,
    itemResponses: tasks.map((task) => {
      const response = getResponse(session, task.id);
      return {
        taskId: task.id,
        domain: task.domain,
        title: task.title,
        modality: task.modality,
        maxScore: task.maxScore,
        score: scoreTask(session, task, response),
        startedAt: response.startedAt,
        endedAt: response.endedAt,
        durationMs: response.durationMs,
        answer: response.answer,
        behavior: response.behavior,
        drawingImage: response.drawingImage || session.drawings[task.id],
        ai: response.ai
      };
    })
  };
}

module.exports = {
  WORDS,
  TRAIL_EXPECTED,
  VIGILANCE_DIGITS,
  tasks,
  uuid,
  createSession,
  getResponse,
  beginTask,
  finishTask,
  formatMs,
  normalizeText,
  uniqueWords,
  clientAutoScoreForTask,
  localAiScore,
  scoreTask,
  computeTotals,
  buildSessionPayload
};
