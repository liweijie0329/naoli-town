const config = require("../../utils/config");
const moca = require("../../utils/moca");

const DRAFT_KEY = "moca-game-draft";
const SESSIONS_KEY = "moca-game-local-sessions";

Page({
  data: {
    view: "setup",
    tasks: moca.tasks,
    taskNav: [],
    activeTaskIndex: 0,
    current: moca.tasks[0],
    response: { answer: {}, behavior: {} },
    participant: {},
    sexOptions: ["请选择", "男", "女"],
    sexIndex: 0,
    educationOptions: ["请选择", "小学", "初中", "中专", "高中", "大专", "本科及以上"],
    educationIndex: 0,
    memoryOptions: moca.WORDS.concat(["学校", "蓝色", "棉布", "鼻子", "牡丹"]),
    memoryChoiceList: [],
    animalCards: [],
    choiceOptions: [],
    multiChoiceItems: [],
    sentenceRows: [],
    orientationRows: [],
    animalTags: [],
    trailSequenceText: "未连线",
    serialValues: ["", "", "", "", ""],
    orientationFields: [
      { key: "weekday", label: "星期", placeholder: "如 星期三" },
      { key: "month", label: "月份", placeholder: "如 5" },
      { key: "year", label: "年份", placeholder: "如 2026" },
      { key: "day", label: "日期", placeholder: "如 7" },
      { key: "place", label: "地点", placeholder: "请输入具体地点" },
      { key: "city", label: "城市", placeholder: "请输入所在城市" }
    ],
    totals: null,
    totalDurationText: "0秒",
    responseDurationText: "0秒",
    domainRows: [],
    adminSessions: [],
    selectedSessionText: "",
    designRows: moca.tasks,
    vigilanceDigits: moca.VIGILANCE_DIGITS,
    canvasWidth: 680,
    canvasHeight: 420,
    animalInput: "",
    vigilanceStatus: "待播放"
  },

  onLoad() {
    this.session = wx.getStorageSync(DRAFT_KEY) || moca.createSession();
    const info = wx.getSystemInfoSync();
    const canvasWidth = Math.max(320, Math.min(760, info.windowWidth - 420));
    this.setData({ canvasWidth, canvasHeight: Math.round(canvasWidth * 0.62) });
    this.syncPage();
  },

  onUnload() {
    if (this.vigilanceTimer) clearInterval(this.vigilanceTimer);
    if (this.fluencyTimer) clearInterval(this.fluencyTimer);
  },

  saveDraft() {
    wx.setStorageSync(DRAFT_KEY, this.session);
  },

  syncPage() {
    const current = moca.tasks[this.session.activeTaskIndex];
    if (this.session.view === "test") moca.beginTask(this.session, current.id);
    const response = moca.getResponse(this.session, current.id);
    const answer = response.answer || {};
    const totals = moca.computeTotals(this.session);
    const domainRows = Object.keys(totals.domainScores).map((domain) => ({
      domain,
      score: totals.domainScores[domain].score,
      max: totals.domainScores[domain].max
    }));
    const taskNav = moca.tasks.map((task, index) => ({
      ...task,
      index,
      done: Boolean(this.session.responses[task.id] && this.session.responses[task.id].submitted)
    }));
    const memoryChoiceList = this.data.memoryOptions.map((word) => ({
      word,
      picked: Boolean((answer.remembered || []).includes(word))
    }));
    const animalCards = current.type === "naming" ? current.items.map((item) => ({
      ...item,
      options: item.options.map((option) => ({ value: option, picked: answer[item.key] === option }))
    })) : [];
    const choiceOptions = (current.options || []).map((option) => ({ value: option, picked: answer.value === option }));
    const multiChoiceItems = current.type === "multiChoice" ? current.items.map((item) => ({
      ...item,
      options: item.options.map((option) => ({ value: option, picked: answer[item.key] === option }))
    })) : [];
    const sentenceRows = (current.sentences || []).map((sentence, index) => ({
      index,
      value: answer.transcript && answer.transcript[index] ? answer.transcript[index] : ""
    }));
    const orientationRows = this.data.orientationFields.map((field) => ({
      ...field,
      value: answer[field.key] || ""
    }));
    const animalTags = (answer.animals || []).map((word) => ({ word }));
    const trailSequenceText =
      response.behavior.sequence && response.behavior.sequence.length
        ? response.behavior.sequence.join(" - ")
        : "未连线";
    this.saveDraft();
    this.setData({
      view: this.session.view,
      activeTaskIndex: this.session.activeTaskIndex,
      current,
      response,
      participant: this.session.participant,
      taskNav,
      totals,
      totalDurationText: moca.formatMs(totals.totalDurationMs),
      responseDurationText: moca.formatMs(response.durationMs || (response.startedTick ? Date.now() - response.startedTick : 0)),
      domainRows,
      memoryChoiceList,
      animalCards,
      choiceOptions,
      multiChoiceItems,
      sentenceRows,
      orientationRows,
      animalTags,
      trailSequenceText,
      serialValues: response.answer.values || ["", "", "", "", ""],
      adminSessions: this.session.adminSessions || [],
      selectedSessionText: this.session.selectedSession ? JSON.stringify(this.session.selectedSession, null, 2) : this.databaseSchemaText(),
      sexIndex: Math.max(0, this.data.sexOptions.indexOf(this.session.participant.sex || "请选择")),
      educationIndex: Math.max(0, this.data.educationOptions.indexOf(this.session.participant.educationLevel || "请选择")),
      vigilanceStatus: response.answer.running ? "播放中" : "待播放"
    });
    wx.nextTick(() => this.setupCanvas());
  },

  databaseSchemaText() {
    return [
      "后台数据库字段",
      "sessions: id, participant, startedAt, finishedAt, totalDurationMs, rawScore, educationBonus, totalScore, riskBand, itemResponses[]",
      "itemResponses: taskId, domain, title, modality, maxScore, score, startedAt, endedAt, durationMs, answer, behavior, drawingImage, ai",
      "",
      "当前小程序免费模式使用本机微信缓存。连接 HTTPS 后端或云函数后，可以自动汇总多台平板数据。"
    ].join("\n");
  },

  onParticipantInput(event) {
    const key = event.currentTarget.dataset.key;
    this.session.participant[key] = event.detail.value;
    this.syncPage();
  },

  onSexChange(event) {
    const value = this.data.sexOptions[Number(event.detail.value)];
    this.session.participant.sex = value === "请选择" ? "" : value;
    this.syncPage();
  },

  onEducationChange(event) {
    const value = this.data.educationOptions[Number(event.detail.value)];
    this.session.participant.educationLevel = value === "请选择" ? "" : value;
    this.syncPage();
  },

  startSession() {
    this.session.startedAt = new Date().toISOString();
    this.session.view = "test";
    this.syncPage();
  },

  openDesign() {
    this.session.view = "design";
    this.syncPage();
  },

  async navView(event) {
    this.session.view = event.currentTarget.dataset.view;
    if (this.session.view === "admin") await this.loadSessions(false);
    this.syncPage();
  },

  selectTask(event) {
    this.session.activeTaskIndex = Number(event.currentTarget.dataset.index);
    this.session.view = "test";
    this.syncPage();
  },

  previousTask() {
    this.session.activeTaskIndex = Math.max(0, this.session.activeTaskIndex - 1);
    this.syncPage();
  },

  async nextTask() {
    await this.submitActiveTask();
    if (this.session.activeTaskIndex === moca.tasks.length - 1) {
      this.session.view = "results";
      this.session.finishedAt = new Date().toISOString();
    } else {
      this.session.activeTaskIndex += 1;
    }
    this.syncPage();
  },

  newSession() {
    wx.removeStorageSync(DRAFT_KEY);
    this.session = moca.createSession();
    this.syncPage();
  },

  answerSubitem(event) {
    const response = moca.getResponse(this.session, this.data.current.id);
    response.answer[event.currentTarget.dataset.key] = event.currentTarget.dataset.value;
    this.syncPage();
  },

  answerValue(event) {
    const response = moca.getResponse(this.session, this.data.current.id);
    response.answer.value = event.currentTarget.dataset.value;
    this.syncPage();
  },

  toggleMemoryWord(event) {
    const response = moca.getResponse(this.session, this.data.current.id);
    const word = event.currentTarget.dataset.word;
    const remembered = new Set(response.answer.remembered || []);
    if (remembered.has(word)) remembered.delete(word);
    else remembered.add(word);
    response.answer.remembered = [...remembered];
    this.syncPage();
  },

  onSerialInput(event) {
    const response = moca.getResponse(this.session, "serial7");
    response.answer.values = response.answer.values || ["", "", "", "", ""];
    response.answer.values[Number(event.currentTarget.dataset.index)] = event.detail.value;
    this.syncPage();
  },

  onTranscriptInput(event) {
    const response = moca.getResponse(this.session, "sentence");
    response.answer.transcript = response.answer.transcript || {};
    response.answer.transcript[Number(event.currentTarget.dataset.index)] = event.detail.value;
    this.saveDraft();
  },

  onRecallInput(event) {
    const response = moca.getResponse(this.session, "delayedRecall");
    response.answer.freeText = event.detail.value;
    this.saveDraft();
  },

  onOrientationInput(event) {
    const response = moca.getResponse(this.session, "orientation");
    response.answer[event.currentTarget.dataset.key] = event.detail.value;
    this.saveDraft();
  },

  onAnimalInput(event) {
    this.setData({ animalInput: event.detail.value });
  },

  addAnimal() {
    const value = moca.normalizeText(this.data.animalInput);
    if (!value) return;
    const response = moca.getResponse(this.session, "fluency");
    response.answer.animals = response.answer.animals || [];
    response.answer.animals.push(value);
    this.setData({ animalInput: "" });
    this.syncPage();
  },

  removeAnimal(event) {
    const response = moca.getResponse(this.session, "fluency");
    response.answer.animals = (response.answer.animals || []).filter((word) => word !== event.currentTarget.dataset.word);
    this.syncPage();
  },

  startVigilance() {
    const response = moca.getResponse(this.session, "vigilance");
    response.answer.taps = [];
    response.answer.startedAt = Date.now();
    response.answer.running = true;
    let index = 0;
    if (this.vigilanceTimer) clearInterval(this.vigilanceTimer);
    this.vigilanceTimer = setInterval(() => {
      index += 1;
      if (index >= moca.VIGILANCE_DIGITS.length) {
        clearInterval(this.vigilanceTimer);
        response.answer.running = false;
      }
      this.syncPage();
    }, 1000);
    this.syncPage();
  },

  tapVigilance() {
    const response = moca.getResponse(this.session, "vigilance");
    response.answer.taps = response.answer.taps || [];
    response.answer.taps.push(Date.now());
    wx.vibrateShort({ type: "light" });
    this.syncPage();
  },

  startFluency() {
    const response = moca.getResponse(this.session, "fluency");
    response.answer.remaining = 60;
    response.answer.timerStartedAt = Date.now();
    if (this.fluencyTimer) clearInterval(this.fluencyTimer);
    this.fluencyTimer = setInterval(() => {
      response.answer.remaining -= 1;
      if (response.answer.remaining <= 0) {
        response.answer.remaining = 0;
        clearInterval(this.fluencyTimer);
      }
      this.syncPage();
    }, 1000);
    this.syncPage();
  },

  setupCanvas() {
    const task = this.data.current;
    if (this.data.view !== "test") return;
    if (task.type === "trail") this.drawTrailCanvas();
    if (task.type === "drawing") {
      this.drawBlankCanvas();
      if (task.drawingKind === "cube") this.drawCubeReference();
    }
  },

  drawBlankCanvas() {
    const ctx = wx.createCanvasContext("taskCanvas", this);
    ctx.setFillStyle("#fffdf7");
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    ctx.draw();
    this.ctx = ctx;
  },

  drawCubeReference() {
    const ctx = wx.createCanvasContext("refCanvas", this);
    ctx.setFillStyle("#ffffff");
    ctx.fillRect(0, 0, 220, 180);
    ctx.setStrokeStyle("#243447");
    ctx.setLineWidth(5);
    ctx.setFillStyle("#f7fbff");
    ctx.beginPath();
    ctx.moveTo(58, 58);
    ctx.lineTo(140, 58);
    ctx.lineTo(176, 24);
    ctx.lineTo(94, 24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setFillStyle("#d6dee8");
    ctx.beginPath();
    ctx.moveTo(140, 58);
    ctx.lineTo(176, 24);
    ctx.lineTo(176, 112);
    ctx.lineTo(140, 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setFillStyle("#ffffff");
    ctx.beginPath();
    ctx.moveTo(58, 58);
    ctx.lineTo(140, 58);
    ctx.lineTo(140, 150);
    ctx.lineTo(58, 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.draw();
  },

  trailNodes() {
    const w = this.data.canvasWidth;
    const h = this.data.canvasHeight;
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
  },

  drawTrailCanvas() {
    const ctx = wx.createCanvasContext("taskCanvas", this);
    const w = this.data.canvasWidth;
    const h = this.data.canvasHeight;
    ctx.setFillStyle("#fffdf7");
    ctx.fillRect(0, 0, w, h);
    ctx.setStrokeStyle("#8fa1b3");
    ctx.setLineWidth(2);
    ctx.strokeRect(14, 14, w - 28, h - 28);
    const nodes = this.trailNodes();
    ctx.setStrokeStyle("#20a66b");
    ctx.setLineWidth(5);
    ctx.beginPath();
    this.session.trail.sequence.forEach((label, index) => {
      const node = nodes.find((entry) => entry.label === label);
      if (!node) return;
      if (index === 0) ctx.moveTo(node.x, node.y);
      else ctx.lineTo(node.x, node.y);
    });
    ctx.stroke();
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.setFillStyle("#ffffff");
      ctx.setStrokeStyle(this.session.trail.sequence.includes(node.label) ? "#20a66b" : "#243447");
      ctx.setLineWidth(3);
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setFillStyle("#243447");
      ctx.setFontSize(22);
      ctx.setTextAlign("center");
      ctx.setTextBaseline("middle");
      ctx.fillText(node.label, node.x, node.y);
    });
    ctx.draw();
    this.ctx = ctx;
  },

  onCanvasStart(event) {
    const task = this.data.current;
    const touch = event.touches[0];
    if (!touch) return;
    if (task.type === "trail") {
      this.handleTrailTap(touch.x, touch.y);
      return;
    }
    if (task.type !== "drawing") return;
    this.drawing = true;
    const ctx = wx.createCanvasContext("taskCanvas", this);
    ctx.setLineCap("round");
    ctx.setLineJoin("round");
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("#243447");
    ctx.beginPath();
    ctx.moveTo(touch.x, touch.y);
    ctx.draw(true);
    this.ctx = ctx;
    const response = moca.getResponse(this.session, task.id);
    response.behavior.strokes = (response.behavior.strokes || 0) + 1;
  },

  onCanvasMove(event) {
    if (!this.drawing || !this.ctx) return;
    const touch = event.touches[0];
    if (!touch) return;
    this.ctx.lineTo(touch.x, touch.y);
    this.ctx.stroke();
    this.ctx.draw(true);
  },

  onCanvasEnd() {
    this.drawing = false;
  },

  handleTrailTap(x, y) {
    const nodes = this.trailNodes();
    const node = nodes.find((entry) => Math.sqrt((x - entry.x) ** 2 + (y - entry.y) ** 2) <= entry.r + 10);
    if (!node) return;
    const expected = moca.TRAIL_EXPECTED[this.session.trail.sequence.length];
    if (node.label !== expected) this.session.trail.errors += 1;
    this.session.trail.sequence.push(node.label);
    const response = moca.getResponse(this.session, "trail");
    response.behavior.sequence = [...this.session.trail.sequence];
    response.behavior.errors = this.session.trail.errors;
    this.drawTrailCanvas();
    this.syncPage();
  },

  undoTrail() {
    this.session.trail.sequence.pop();
    this.session.trail.undoCount += 1;
    const response = moca.getResponse(this.session, "trail");
    response.behavior.sequence = [...this.session.trail.sequence];
    response.behavior.undoCount = this.session.trail.undoCount;
    this.syncPage();
  },

  clearTrail() {
    this.session.trail = { sequence: [], errors: 0, undoCount: 0 };
    delete this.session.drawings.trail;
    this.syncPage();
  },

  clearDrawing() {
    const task = this.data.current;
    const response = moca.getResponse(this.session, task.id);
    delete response.drawingImage;
    delete this.session.drawings[task.id];
    response.behavior.strokes = 0;
    this.setupCanvas();
    this.saveDraft();
  },

  captureCanvas() {
    return new Promise((resolve) => {
      wx.canvasToTempFilePath({
        canvasId: "taskCanvas",
        success: (res) => resolve(res.tempFilePath),
        fail: () => resolve(null)
      }, this);
    });
  },

  async scoreTaskWithAi(task, response, image) {
    const payload = {
      taskId: task.id,
      taskType: task.type,
      image,
      answer: response.answer,
      rubric: task.scoring,
      maxScore: task.maxScore,
      clientAutoScore: moca.clientAutoScoreForTask(this.session, task, response)
    };
    return this.requestJson("/api/ai-score", "POST", payload, () => moca.localAiScore(this.session, task, response, image));
  },

  needsAiScore(task) {
    return ["trail", "drawing", "sentence", "fluency", "recall", "orientation"].includes(task.type);
  },

  async submitActiveTask() {
    const task = moca.tasks[this.session.activeTaskIndex];
    const response = moca.getResponse(this.session, task.id);
    let image = null;
    if (task.type === "drawing" || task.type === "trail") {
      image = await this.captureCanvas();
      response.drawingImage = image;
      this.session.drawings[task.id] = image;
    }
    moca.finishTask(this.session, task.id);
    if (this.needsAiScore(task)) {
      response.ai = await this.scoreTaskWithAi(task, response, image);
    }
    response.score = moca.scoreTask(this.session, task, response);
    this.saveDraft();
  },

  requestJson(path, method, data, fallback) {
    if (!config.apiBase) return Promise.resolve(fallback());
    const base = config.apiBase.replace(/\/$/, "");
    return new Promise((resolve) => {
      wx.request({
        url: `${base}${path}`,
        method,
        data,
        header: { "content-type": "application/json" },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
          else resolve(fallback());
        },
        fail: () => resolve(fallback())
      });
    });
  },

  readLocalSessions() {
    const value = wx.getStorageSync(SESSIONS_KEY);
    return Array.isArray(value) ? value : [];
  },

  writeLocalSessions(sessions) {
    wx.setStorageSync(SESSIONS_KEY, sessions);
  },

  localSaveSession(payload) {
    const sessions = this.readLocalSessions();
    const saved = {
      ...payload,
      id: payload.id || moca.uuid(),
      savedAt: new Date().toISOString(),
      storageMode: "wechat-local"
    };
    const index = sessions.findIndex((entry) => entry.id === saved.id);
    if (index >= 0) sessions[index] = saved;
    else sessions.unshift(saved);
    this.writeLocalSessions(sessions);
    return saved;
  },

  localListSessions() {
    return this.readLocalSessions().map((session) => ({
      id: session.id,
      participant: session.participant,
      finishedAt: session.finishedAt,
      totalDurationMs: session.totalDurationMs,
      rawScore: session.rawScore,
      educationBonus: session.educationBonus,
      totalScore: session.totalScore,
      riskBand: session.riskBand,
      storageMode: session.storageMode || "wechat-local"
    }));
  },

  async saveSession() {
    this.session.finishedAt = this.session.finishedAt || new Date().toISOString();
    const payload = moca.buildSessionPayload(this.session);
    const saved = await this.requestJson("/api/sessions", "POST", payload, () => this.localSaveSession(payload));
    this.session.sessionId = saved.id;
    this.session.selectedSession = saved;
    await this.loadSessions(false);
    this.session.view = "admin";
    this.syncPage();
  },

  async loadSessions(shouldSync = true) {
    const sessions = await this.requestJson("/api/sessions", "GET", null, () => this.localListSessions());
    this.session.adminSessions = sessions;
    if (shouldSync) this.syncPage();
  },

  selectSavedSession(event) {
    const id = event.currentTarget.dataset.id;
    const local = this.readLocalSessions().find((entry) => entry.id === id);
    this.session.selectedSession = local || null;
    this.syncPage();
  },

  copySelectedJson() {
    const payload = this.session.selectedSession || moca.buildSessionPayload(this.session);
    wx.setClipboardData({
      data: JSON.stringify(payload, null, 2),
      success: () => wx.showToast({ title: "已复制JSON", icon: "success" })
    });
  }
});
