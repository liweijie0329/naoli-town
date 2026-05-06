const config = require("../../utils/config");
const moca = require("../../utils/moca");

const DRAFT_KEY = "moca-game-draft";
const SESSIONS_KEY = "moca-game-local-sessions";
const MEMORY_WAIT_MS = 5 * 60 * 1000;
const DIGIT_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const animalAssets = {
  lion: "/assets/animals/lion.svg",
  rhino: "/assets/animals/rhino.svg",
  camel: "/assets/animals/camel.svg"
};

const animalNameBank = [
  "狗", "猫", "牛", "马", "羊", "猪", "鸡", "鸭", "鹅", "兔", "鼠", "虎", "狮子", "犀牛", "骆驼",
  "大象", "猴", "猩猩", "熊", "鹿", "长颈鹿", "斑马", "豹子", "狼", "狐狸", "河马", "袋鼠", "熊猫",
  "蛇", "乌龟", "鳄鱼", "青蛙", "鱼", "鲸", "海豚", "鲨鱼", "鸟", "鸽子", "鹰", "孔雀", "企鹅",
  "龙", "凤凰", "麒麟"
];

const orientationPrompts = [
  { key: "year", label: "今年是哪一年？", fields: ["year"] },
  { key: "date", label: "今天是几月几号？", fields: ["month", "day"] },
  { key: "weekday", label: "今天星期几？", fields: ["weekday"] },
  { key: "city", label: "你现在在哪个城市？", fields: ["city"] },
  { key: "place", label: "这里是什么地方？", fields: ["place"] }
];

Page({
  data: {
    view: "setup",
    menuOpen: false,
    tasks: moca.tasks,
    activeTaskIndex: 0,
    current: moca.tasks[0],
    response: { answer: {}, behavior: {} },
    participant: {},
    sexOptions: ["请选择", "男", "女"],
    sexIndex: 0,
    educationOptions: ["请选择", "小学", "初中", "中专", "高中", "大专", "本科及以上"],
    educationIndex: 0,
    taskNav: [],
    totals: null,
    domainRows: [],
    adminSessions: [],
    selectedSessionText: "",
    canvasWidth: 720,
    canvasHeight: 430,
    progressText: "1/15",
    progressWidth: "6.66%",
    stepText: "",
    nextDisabled: false,
    nextLabel: "下一题",
    pageHint: "",
    drawerTitle: "MoCA Quest",
    animalPage: null,
    namingOptions: [],
    digitPad: DIGIT_PAD,
    selectedDigits: [],
    serialQuestion: "100 - 7 = ?",
    serialDisplay: "",
    sentencePage: null,
    abstractionPage: null,
    orientationPage: null,
    recallText: "",
    voiceText: "",
    voiceState: "待说",
    playState: "播放",
    fluencyCount: 0,
    fluencyRemaining: 60,
    fluencyRunning: false,
    vigilanceRunning: false,
    vigilanceStarted: false,
    vigilanceTapCount: 0,
    memoryWaitRemainingText: "",
    memoryReady: true,
    setupCardClass: "setup-panel",
    locationStatus: "定位未获取"
  },

  onLoad() {
    this.session = wx.getStorageSync(DRAFT_KEY) || moca.createSession();
    this.initSpeech();
    this.updateLayout();
    this.syncPage();
  },

  onUnload() {
    this.clearTimers();
    if (this.recognitionManager) this.recognitionManager.stop();
  },

  clearTimers() {
    if (this.vigilanceTimer) clearInterval(this.vigilanceTimer);
    if (this.fluencyTimer) clearInterval(this.fluencyTimer);
    if (this.memoryWaitTimer) clearInterval(this.memoryWaitTimer);
    if (this.trailGuideTimer) clearInterval(this.trailGuideTimer);
  },

  updateLayout() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const width = info.windowWidth || 1024;
    const height = info.windowHeight || 768;
    const canvasWidth = Math.max(520, Math.round(width * 0.58));
    const canvasHeight = Math.max(300, Math.round(height * 0.54));
    this.setData({ canvasWidth, canvasHeight });
  },

  initSpeech() {
    this.recorderManager = wx.getRecorderManager ? wx.getRecorderManager() : null;
    try {
      this.speechPlugin = requirePlugin("WechatSI");
      this.recognitionManager = this.speechPlugin.getRecordRecognitionManager();
      this.recognitionManager.onStart(() => {
        this.setData({ voiceState: "请说" });
      });
      this.recognitionManager.onRecognize((res) => {
        if (res.result) this.applyVoiceResult(res.result, false);
      });
      this.recognitionManager.onStop((res) => {
        this.applyVoiceResult(res.result || "", true);
      });
      this.recognitionManager.onError(() => {
        this.setData({ voiceState: "识别未完成" });
      });
    } catch (error) {
      this.speechPlugin = null;
      this.recognitionManager = null;
    }
  },

  saveDraft() {
    wx.setStorageSync(DRAFT_KEY, this.session);
  },

  currentStep(task) {
    const response = moca.getResponse(this.session, task.id);
    return response.answer.step || 0;
  },

  stepCount(task) {
    if (task.type === "naming") return task.items.length;
    if (task.type === "serial7") return 5;
    if (task.type === "sentence") return task.sentences.length;
    if (task.type === "abstractionSpeech") return task.items.length;
    if (task.type === "orientation") return orientationPrompts.length;
    return 1;
  },

  syncPage() {
    const current = moca.tasks[this.session.activeTaskIndex];
    if (this.session.view === "test") moca.beginTask(this.session, current.id);
    const response = moca.getResponse(this.session, current.id);
    const answer = response.answer || {};
    const step = Math.min(this.currentStep(current), this.stepCount(current) - 1);
    const totals = moca.computeTotals(this.session);
    const domainRows = Object.keys(totals.domainScores).map((domain) => ({
      domain,
      score: totals.domainScores[domain].score,
      max: totals.domainScores[domain].max
    }));
    const taskNav = moca.tasks.map((task, index) => ({
      id: task.id,
      title: task.title,
      index,
      done: Boolean(this.session.responses[task.id] && this.session.responses[task.id].submitted)
    }));
    const progressValue = ((this.session.activeTaskIndex + 1) / moca.tasks.length) * 100;
    const memoryRemaining = this.memoryWaitRemaining();
    const memoryReady = current.id !== "memory2" || memoryRemaining <= 0;
    this.saveDraft();
    this.setData({
      view: this.session.view,
      current,
      response,
      participant: this.session.participant,
      activeTaskIndex: this.session.activeTaskIndex,
      taskNav,
      totals,
      domainRows,
      selectedSessionText: this.session.selectedSession ? JSON.stringify(this.session.selectedSession, null, 2) : this.databaseSchemaText(),
      adminSessions: this.session.adminSessions || [],
      sexIndex: Math.max(0, this.data.sexOptions.indexOf(this.session.participant.sex || "请选择")),
      educationIndex: Math.max(0, this.data.educationOptions.indexOf(this.session.participant.educationLevel || "请选择")),
      progressText: `${this.session.activeTaskIndex + 1}/${moca.tasks.length}`,
      progressWidth: `${progressValue}%`,
      stepText: this.stepCount(current) > 1 ? `${step + 1}/${this.stepCount(current)}` : "",
      nextDisabled: current.id === "memory2" && !memoryReady,
      nextLabel: this.nextLabel(current, step),
      pageHint: this.pageHint(current),
      animalPage: this.animalPage(current, answer, step),
      namingOptions: this.namingOptions(current, answer, step),
      selectedDigits: answer.sequence || [],
      serialQuestion: this.serialQuestion(answer, step),
      serialDisplay: (answer.values || [])[step] || "",
      sentencePage: this.sentencePage(current, answer, step),
      abstractionPage: this.abstractionPage(current, answer, step),
      orientationPage: this.orientationPage(answer, step),
      recallText: answer.freeText || "",
      voiceText: this.voiceText(current, answer, step),
      fluencyCount: moca.uniqueWords(answer.animals || []).length,
      fluencyRemaining: answer.remaining || 60,
      fluencyRunning: Boolean(answer.running),
      vigilanceRunning: Boolean(answer.running),
      vigilanceStarted: Boolean(answer.startedAt),
      vigilanceTapCount: (answer.taps || []).length,
      memoryReady,
      memoryWaitRemainingText: this.formatCountdown(memoryRemaining),
      locationStatus: this.locationStatus()
    });
    this.setupTaskSideEffects(current);
  },

  setupTaskSideEffects(task) {
    wx.nextTick(() => {
      if (this.data.view !== "test") return;
      if (task.type === "trail") {
        this.drawTrailCanvas();
        this.startTrailGuide();
      }
      if (task.type === "drawing") {
        this.drawBlankCanvas(task);
        if (task.drawingKind === "cube") this.drawCubeReference();
      }
      if (task.id === "memory2") this.startMemoryWaitTimer();
      if (task.type === "orientation") this.prepareLocationAnswer();
    });
  },

  nextLabel(task, step) {
    if (step < this.stepCount(task) - 1) return "下一页";
    return this.session.activeTaskIndex === moca.tasks.length - 1 ? "查看结果" : "下一题";
  },

  pageHint(task) {
    if (task.id === "memory2" && this.memoryWaitRemaining() > 0) return "请稍等，第二次词语学习需与第一次间隔5分钟。";
    if (task.type === "choice") return "先听声音，再按顺序点击数字卡。";
    if (task.type === "sentence" || task.type === "abstractionSpeech" || task.type === "recall" || task.type === "orientation") return "请使用麦克风作答，识别文字会自动记录到后台。";
    return "";
  },

  animalPage(task, answer, step) {
    if (task.type !== "naming") return null;
    const item = task.items[step];
    return {
      ...item,
      asset: animalAssets[item.key],
      picked: answer[item.key] || "",
      prompt: `这只小动物叫什么名字？`
    };
  },

  namingOptions(task, answer, step) {
    if (task.type !== "naming") return [];
    const item = task.items[step];
    return item.options.map((option) => ({
      value: option,
      picked: answer[item.key] === option
    }));
  },

  serialQuestion(answer, step) {
    const previous = step === 0 ? 100 : Number((answer.values || [])[step - 1] || 100 - step * 7);
    return `${previous} - 7 = ?`;
  },

  sentencePage(task, answer, step) {
    if (task.type !== "sentence") return null;
    const transcript = answer.transcript || {};
    return {
      index: step,
      value: transcript[step] || "",
      label: `第 ${step + 1} 句`
    };
  },

  abstractionPage(task, answer, step) {
    if (task.type !== "abstractionSpeech") return null;
    const transcript = answer.transcript || {};
    return {
      index: step,
      pair: task.items[step].pair,
      value: transcript[step] || ""
    };
  },

  orientationPage(answer, step) {
    const item = orientationPrompts[step] || orientationPrompts[0];
    return {
      ...item,
      value: item.fields.map((field) => answer[field]).filter(Boolean).join(" ")
    };
  },

  voiceText(task, answer, step) {
    if (task.type === "sentence") return (answer.transcript || {})[step] || "";
    if (task.type === "abstractionSpeech") return (answer.transcript || {})[step] || "";
    if (task.type === "recall") return answer.freeText || "";
    if (task.type === "orientation") return this.orientationPage(answer, step).value || "";
    if (task.type === "fluency") return (answer.animals || []).join("、");
    return "";
  },

  databaseSchemaText() {
    return [
      "后台数据库字段",
      "sessions: id, participant, startedAt, finishedAt, totalDurationMs, rawScore, educationBonus, totalScore, riskBand, itemResponses[]",
      "itemResponses: taskId, domain, title, modality, maxScore, score, startedAt, endedAt, durationMs, answer, behavior, drawingImage, ai",
      "behavior: 连线顺序、撤销、敲击时间戳、语音转写、定位信息、画布图片"
    ].join("\n");
  },

  onParticipantInput(event) {
    this.session.participant[event.currentTarget.dataset.key] = event.detail.value;
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
    this.session.activeTaskIndex = 0;
    this.syncPage();
  },

  openMenu() {
    this.setData({ menuOpen: true });
  },

  closeMenu() {
    this.setData({ menuOpen: false });
  },

  async navView(event) {
    const view = event.currentTarget.dataset.view;
    this.session.view = view;
    if (view === "admin") await this.loadSessions(false);
    this.setData({ menuOpen: false });
    this.syncPage();
  },

  goHome() {
    this.session.view = "setup";
    this.setData({ menuOpen: false });
    this.syncPage();
  },

  selectTask(event) {
    this.session.activeTaskIndex = Number(event.currentTarget.dataset.index);
    this.session.view = "test";
    this.setData({ menuOpen: false });
    this.syncPage();
  },

  previousTask() {
    const task = moca.tasks[this.session.activeTaskIndex];
    const response = moca.getResponse(this.session, task.id);
    const step = this.currentStep(task);
    if (step > 0) {
      response.answer.step = step - 1;
    } else {
      this.session.activeTaskIndex = Math.max(0, this.session.activeTaskIndex - 1);
    }
    this.syncPage();
  },

  async nextTask() {
    const task = moca.tasks[this.session.activeTaskIndex];
    if (task.id === "memory2" && this.memoryWaitRemaining() > 0) {
      this.syncPage();
      return;
    }
    const response = moca.getResponse(this.session, task.id);
    const step = this.currentStep(task);
    if (step < this.stepCount(task) - 1) {
      response.answer.step = step + 1;
      this.syncPage();
      return;
    }
    await this.submitActiveTask();
    if (task.id === "memory1" && !this.session.memoryWaitStartedAt) {
      this.session.memoryWaitStartedAt = Date.now();
    }
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
    this.clearTimers();
    this.session = moca.createSession();
    this.syncPage();
  },

  chooseNaming(event) {
    const task = this.data.current;
    const response = moca.getResponse(this.session, task.id);
    const item = task.items[this.currentStep(task)];
    response.answer[item.key] = event.currentTarget.dataset.value;
    this.syncPage();
  },

  playCurrentAudio() {
    const task = this.data.current;
    const step = this.currentStep(task);
    if (task.type === "memory") {
      this.playText(moca.WORDS.join("，"));
      return;
    }
    if (task.type === "choice") {
      this.playText(task.stimulus.split("").join("，"));
      return;
    }
    if (task.type === "vigilance") {
      this.startVigilance();
      return;
    }
    if (task.type === "sentence") {
      this.setData({ playState: "播放中..." });
      this.playText(task.sentences[step], () => {
        this.setData({ playState: "请说", voiceState: "请说" });
        this.startVoiceInput();
      });
      return;
    }
    if (task.type === "abstractionSpeech") {
      this.playText(task.items[step].pair, () => this.startVoiceInput());
      return;
    }
    if (task.type === "recall") {
      this.playText(task.prompt, () => this.startVoiceInput());
      return;
    }
    if (task.type === "orientation") {
      this.playText(orientationPrompts[step].label, () => this.startVoiceInput());
    }
  },

  playText(text, done) {
    this.setData({ playState: "播放中..." });
    if (this.speechPlugin && this.speechPlugin.textToSpeech) {
      this.speechPlugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: text,
        success: (res) => {
          const audio = wx.createInnerAudioContext();
          audio.src = res.filename;
          audio.onEnded(() => {
            this.setData({ playState: "播放" });
            if (done) done();
          });
          audio.onError(() => {
            this.setData({ playState: "播放" });
            if (done) done();
          });
          audio.play();
        },
        fail: () => {
          this.setData({ playState: "播放" });
          if (done) done();
        }
      });
      return;
    }
    wx.showToast({ title: "请朗读提示", icon: "none" });
    this.setData({ playState: "播放" });
    if (done) done();
  },

  startVoiceInput() {
    if (this.recognitionManager) {
      this.setData({ voiceState: "请说" });
      this.recognitionManager.start({ lang: "zh_CN" });
      return;
    }
    if (this.recorderManager) {
      this.setData({ voiceState: "录音中" });
      this.recorderManager.start({ duration: 60000, format: "mp3" });
      return;
    }
    wx.showToast({ title: "当前环境无法录音", icon: "none" });
  },

  stopVoiceInput() {
    if (this.recognitionManager) this.recognitionManager.stop();
    if (this.recorderManager) this.recorderManager.stop();
    this.setData({ voiceState: "识别中..." });
  },

  toggleVoiceInput() {
    if (this.data.voiceState === "请说" || this.data.voiceState === "录音中") this.stopVoiceInput();
    else this.startVoiceInput();
  },

  applyVoiceResult(text, shouldSync) {
    if (!text) return;
    const task = this.data.current;
    const response = moca.getResponse(this.session, task.id);
    const step = this.currentStep(task);
    if (task.type === "sentence" || task.type === "abstractionSpeech") {
      response.answer.transcript = response.answer.transcript || {};
      response.answer.transcript[step] = text;
    }
    if (task.type === "recall") response.answer.freeText = text;
    if (task.type === "orientation") this.applyOrientationText(response, step, text);
    if (task.type === "fluency") {
      response.answer.rawTranscript = text;
      response.answer.animals = this.extractAnimalNames(text);
    }
    response.behavior.voiceEvents = response.behavior.voiceEvents || [];
    response.behavior.voiceEvents.push({ step, text, at: new Date().toISOString() });
    this.setData({ voiceState: "待说" });
    this.saveDraft();
    if (shouldSync) this.syncPage();
  },

  applyOrientationText(response, step, text) {
    const prompt = orientationPrompts[step];
    response.answer.orientationTranscript = response.answer.orientationTranscript || {};
    response.answer.orientationTranscript[prompt.key] = text;
    if (prompt.key === "year") response.answer.year = this.firstNumber(text) || text;
    if (prompt.key === "date") {
      const nums = this.numbersInText(text);
      response.answer.month = nums[0] || text;
      response.answer.day = nums[1] || text;
    }
    if (prompt.key === "weekday") response.answer.weekday = text;
    if (prompt.key === "city") response.answer.city = text;
    if (prompt.key === "place") response.answer.place = text;
  },

  firstNumber(text) {
    const nums = this.numbersInText(text);
    return nums[0] || "";
  },

  numbersInText(text) {
    const matches = String(text || "").match(/\d+/g);
    return matches || [];
  },

  extractAnimalNames(text) {
    const normalized = moca.normalizeText(text);
    const fromBank = animalNameBank.filter((name) => normalized.includes(name));
    const fromSeparators = String(text || "")
      .split(/[，,、\s]+/)
      .map((word) => moca.normalizeText(word))
      .filter(Boolean);
    return moca.uniqueWords(fromBank.concat(fromSeparators));
  },

  appendDigit(event) {
    const digit = event.currentTarget.dataset.digit;
    const task = this.data.current;
    const response = moca.getResponse(this.session, task.id);
    response.answer.sequence = response.answer.sequence || [];
    if (response.answer.sequence.length >= task.answer.length) return;
    response.answer.sequence.push(digit);
    this.syncPage();
  },

  backspaceDigit() {
    const response = moca.getResponse(this.session, this.data.current.id);
    response.answer.sequence = response.answer.sequence || [];
    response.answer.sequence.pop();
    this.syncPage();
  },

  inputSerialDigit(event) {
    const digit = event.currentTarget.dataset.digit;
    const response = moca.getResponse(this.session, "serial7");
    const step = this.currentStep(this.data.current);
    response.answer.values = response.answer.values || ["", "", "", "", ""];
    response.answer.values[step] = `${response.answer.values[step] || ""}${digit}`;
    this.syncPage();
  },

  backspaceSerial() {
    const response = moca.getResponse(this.session, "serial7");
    const step = this.currentStep(this.data.current);
    response.answer.values = response.answer.values || ["", "", "", "", ""];
    response.answer.values[step] = response.answer.values[step].slice(0, -1);
    this.syncPage();
  },

  startVigilance() {
    const response = moca.getResponse(this.session, "vigilance");
    response.answer.taps = [];
    response.answer.startedAt = Date.now();
    response.answer.running = true;
    let index = 0;
    if (this.vigilanceTimer) clearInterval(this.vigilanceTimer);
    this.playText(moca.VIGILANCE_DIGITS.join("，"));
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
    if (!response.answer.startedAt) return;
    response.answer.taps = response.answer.taps || [];
    response.answer.taps.push(Date.now());
    wx.vibrateShort({ type: "light" });
    this.syncPage();
  },

  startFluency() {
    const response = moca.getResponse(this.session, "fluency");
    response.answer.remaining = 60;
    response.answer.running = true;
    response.answer.timerStartedAt = Date.now();
    this.startVoiceInput();
    if (this.fluencyTimer) clearInterval(this.fluencyTimer);
    this.fluencyTimer = setInterval(() => {
      response.answer.remaining -= 1;
      if (response.answer.remaining <= 0) {
        response.answer.remaining = 0;
        response.answer.running = false;
        clearInterval(this.fluencyTimer);
        this.stopVoiceInput();
      }
      this.syncPage();
    }, 1000);
    this.syncPage();
  },

  memoryWaitRemaining() {
    if (!this.session.memoryWaitStartedAt) return 0;
    return Math.max(0, this.session.memoryWaitStartedAt + MEMORY_WAIT_MS - Date.now());
  },

  formatCountdown(ms) {
    if (ms <= 0) return "00:00";
    const total = Math.ceil(ms / 1000);
    const minute = String(Math.floor(total / 60)).padStart(2, "0");
    const second = String(total % 60).padStart(2, "0");
    return `${minute}:${second}`;
  },

  startMemoryWaitTimer() {
    if (this.memoryWaitTimer) clearInterval(this.memoryWaitTimer);
    if (this.memoryWaitRemaining() <= 0) return;
    this.memoryWaitTimer = setInterval(() => {
      if (this.memoryWaitRemaining() <= 0) clearInterval(this.memoryWaitTimer);
      this.syncPage();
    }, 1000);
  },

  setupCanvasPoint(event) {
    const touch = event.touches && event.touches[0];
    if (!touch) return null;
    return { x: touch.x, y: touch.y };
  },

  drawBlankCanvas(task) {
    const ctx = wx.createCanvasContext("taskCanvas", this);
    ctx.setFillStyle("#fffdf7");
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    if (task.drawingKind === "clock") {
      ctx.setFillStyle("#243447");
      ctx.setFontSize(34);
      ctx.setTextAlign("center");
      ctx.fillText("11:10", this.data.canvasWidth / 2, 42);
    }
    ctx.draw();
    this.ctx = ctx;
  },

  drawCubeReference() {
    const ctx = wx.createCanvasContext("refCanvas", this);
    ctx.setFillStyle("#ffffff");
    ctx.fillRect(0, 0, 240, 190);
    ctx.setLineJoin("round");
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("#243447");
    ctx.setFillStyle("#f6fbff");
    this.drawPoly(ctx, [[58, 64], [136, 64], [176, 32], [98, 32]]);
    ctx.setFillStyle("#dbe7ef");
    this.drawPoly(ctx, [[136, 64], [176, 32], [176, 112], [136, 150]]);
    ctx.setFillStyle("#ffffff");
    this.drawPoly(ctx, [[58, 64], [136, 64], [136, 150], [58, 150]]);
    ctx.draw();
  },

  drawPoly(ctx, points) {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point[0], point[1]);
      else ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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

  startTrailGuide() {
    if (this.session.trail.sequence.length > 0) return;
    if (this.trailGuideTimer) clearInterval(this.trailGuideTimer);
    let tick = 0;
    this.trailGuideTimer = setInterval(() => {
      if (this.session.trail.sequence.length > 0) {
        clearInterval(this.trailGuideTimer);
        return;
      }
      tick = (tick + 1) % 30;
      this.drawTrailCanvas(tick);
    }, 120);
  },

  drawTrailCanvas(tick = 0) {
    const ctx = wx.createCanvasContext("taskCanvas", this);
    const w = this.data.canvasWidth;
    const h = this.data.canvasHeight;
    ctx.setFillStyle("#fffdf7");
    ctx.fillRect(0, 0, w, h);
    const nodes = this.trailNodes();
    if (this.session.trail.sequence.length === 0) {
      const guide = ["1", "甲", "2"].map((label) => nodes.find((node) => node.label === label));
      ctx.setStrokeStyle("rgba(32,166,107,0.22)");
      ctx.setLineWidth(10);
      ctx.beginPath();
      guide.forEach((node, index) => {
        if (index === 0) ctx.moveTo(node.x, node.y);
        else ctx.lineTo(node.x, node.y);
      });
      ctx.stroke();
      const moving = guide[Math.min(2, Math.floor(tick / 10))];
      ctx.setFillStyle("#ff7f68");
      ctx.beginPath();
      ctx.arc(moving.x, moving.y, 12 + (tick % 10), 0, Math.PI * 2);
      ctx.fill();
    }
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
      const used = this.session.trail.sequence.includes(node.label);
      ctx.beginPath();
      ctx.setFillStyle(used ? "#e8f8ef" : "#ffffff");
      ctx.setStrokeStyle(used ? "#20a66b" : "#243447");
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
    const point = this.setupCanvasPoint(event);
    if (!point) return;
    if (task.type === "trail") {
      this.handleTrailTap(point.x, point.y);
      return;
    }
    if (task.type !== "drawing") return;
    this.drawing = true;
    const ctx = wx.createCanvasContext("taskCanvas", this);
    ctx.setLineCap("round");
    ctx.setLineJoin("round");
    ctx.setLineWidth(5);
    ctx.setStrokeStyle("#243447");
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.draw(true);
    this.ctx = ctx;
    const response = moca.getResponse(this.session, task.id);
    response.behavior.strokes = (response.behavior.strokes || 0) + 1;
  },

  onCanvasMove(event) {
    if (!this.drawing || !this.ctx) return;
    const point = this.setupCanvasPoint(event);
    if (!point) return;
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
    this.ctx.draw(true);
  },

  onCanvasEnd() {
    this.drawing = false;
  },

  handleTrailTap(x, y) {
    const nodes = this.trailNodes();
    const node = nodes.find((entry) => Math.sqrt((x - entry.x) ** 2 + (y - entry.y) ** 2) <= entry.r + 10);
    if (!node || this.session.trail.sequence.includes(node.label)) return;
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
    this.drawBlankCanvas(task);
    if (task.drawingKind === "cube") this.drawCubeReference();
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
    return ["trail", "drawing", "sentence", "fluency", "abstractionSpeech", "recall", "orientation"].includes(task.type);
  },

  async submitActiveTask() {
    const task = moca.tasks[this.session.activeTaskIndex];
    const response = moca.getResponse(this.session, task.id);
    if (task.type === "fluency" && response.answer.running) {
      response.answer.running = false;
      if (this.fluencyTimer) clearInterval(this.fluencyTimer);
      this.stopVoiceInput();
    }
    let image = null;
    if (task.type === "drawing" || task.type === "trail") {
      image = await this.captureCanvas();
      response.drawingImage = image;
      this.session.drawings[task.id] = image;
    }
    moca.finishTask(this.session, task.id);
    if (this.needsAiScore(task)) response.ai = await this.scoreTaskWithAi(task, response, image);
    response.score = moca.scoreTask(this.session, task, response);
    this.saveDraft();
  },

  prepareLocationAnswer() {
    const response = moca.getResponse(this.session, "orientation");
    if (response.behavior.location) return;
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        response.behavior.location = {
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy,
          at: new Date().toISOString()
        };
        this.reverseGeocodeLocation(response, res.latitude, res.longitude);
        this.saveDraft();
        this.syncPage();
      },
      fail: () => {
        response.behavior.location = { error: "定位未授权或不可用", at: new Date().toISOString() };
        this.saveDraft();
        this.syncPage();
      }
    });
  },

  reverseGeocodeLocation(response, latitude, longitude) {
    if (!config.tencentMapKey) return;
    wx.request({
      url: "https://apis.map.qq.com/ws/geocoder/v1/",
      method: "GET",
      data: {
        location: `${latitude},${longitude}`,
        key: config.tencentMapKey,
        get_poi: 1
      },
      success: (res) => {
        const result = res.data && res.data.result;
        if (!result) return;
        response.behavior.location.address = result.address || "";
        response.behavior.location.city = result.address_component && result.address_component.city;
        response.behavior.location.place = result.formatted_addresses && (result.formatted_addresses.recommend || result.formatted_addresses.rough);
        response.answer.expectedCity = response.behavior.location.city || "";
        response.answer.expectedPlace = response.behavior.location.place || response.behavior.location.address || "";
        this.saveDraft();
        this.syncPage();
      }
    });
  },

  locationStatus() {
    const response = this.session ? moca.getResponse(this.session, "orientation") : null;
    const location = response && response.behavior.location;
    if (!location) return "定位未获取";
    if (location.error) return location.error;
    return "已记录当前位置";
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
