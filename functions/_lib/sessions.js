function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function jsonString(value, fallback = null) {
  return JSON.stringify(value ?? fallback);
}

function toInteger(value, fallback = 0) {
  if (value === "" || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : fallback;
}

function birthDateParts(value) {
  const match = String(value || "").trim().match(/^(\d{4})(?:\D+(\d{1,2}))?(?:\D+(\d{1,2}))?/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : null;
  const day = match[3] ? Number(match[3]) : null;
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  if (month !== null && (month < 1 || month > 12)) return null;
  if (day !== null && (day < 1 || day > 31)) return null;
  return { year, month, day };
}

function todayParts() {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
    return { year: values.year, month: values.month, day: values.day };
  } catch {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };
  }
}

function ageFromBirthDate(value, today = todayParts()) {
  const birth = birthDateParts(value);
  if (!birth) return null;
  let age = today.year - birth.year;
  if (birth.month !== null && birth.day !== null) {
    const birthdayPassed = today.month > birth.month || (today.month === birth.month && today.day >= birth.day);
    if (!birthdayPassed) age -= 1;
  }
  return age >= 0 && age <= 130 ? age : null;
}

function normalizeParticipant(participant = {}) {
  const copy = { ...participant };
  const birth = birthDateParts(copy.birthYear);
  const age = ageFromBirthDate(copy.birthYear);
  if (age !== null) copy.age = age;
  else delete copy.age;
  return {
    participant: copy,
    birthYear: birth?.year ?? null,
    age
  };
}

function dataUrlBytes(value) {
  if (typeof value !== "string") return 0;
  const comma = value.indexOf(",");
  const body = comma >= 0 ? value.slice(comma + 1) : value;
  return Math.round((body.length * 3) / 4);
}

function compactAudioRecordings(answer) {
  if (!answer || typeof answer !== "object" || !answer.audioRecordings) return answer;
  const copy = { ...answer, audioRecordings: {} };
  Object.entries(answer.audioRecordings).forEach(([step, recording]) => {
    copy.audioRecordings[step] = {
      stored: false,
      bytes: dataUrlBytes(recording),
      note: "录音原始文件未写入 D1；后台保留语音识别文本和录音元数据。"
    };
  });
  return copy;
}

function compactItemResponse(item) {
  return {
    ...item,
    answer: compactAudioRecordings(item.answer)
  };
}

export function normalizeSessionPayload(payload) {
  const now = new Date().toISOString();
  const id = payload.id || crypto.randomUUID();
  const participantInfo = normalizeParticipant(payload.participant);
  const itemResponses = Array.isArray(payload.itemResponses)
    ? payload.itemResponses.map(compactItemResponse)
    : [];

  return {
    ...payload,
    id,
    participant: participantInfo.participant,
    participantAge: participantInfo.age,
    savedAt: now,
    itemResponses,
    storageMode: "cloudflare-d1"
  };
}

export function sessionRowParams(session) {
  const participant = session.participant || {};
  const participantInfo = normalizeParticipant(participant);
  const slimPayload = {
    ...session,
    participant: participantInfo.participant,
    participantAge: participantInfo.age,
    itemResponses: session.itemResponses.map((item) => ({
      taskId: item.taskId,
      domain: item.domain,
      title: item.title,
      modality: item.modality,
      maxScore: item.maxScore,
      score: item.score,
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      durationMs: item.durationMs
    }))
  };

  return [
    session.id,
    participant.name || "",
    participantInfo.birthYear,
    participantInfo.age,
    participant.gender || "",
    participant.educationLevel || "",
    jsonString(participantInfo.participant, {}),
    session.startedAt || null,
    session.finishedAt || null,
    session.savedAt,
    toInteger(session.totalDurationMs),
    toInteger(session.rawScore),
    toInteger(session.educationBonus),
    toInteger(session.totalScore),
    session.riskBand || "",
    jsonString(session.domainScores, {}),
    jsonString(slimPayload, {})
  ];
}

export function itemRowParams(sessionId, item) {
  const drawingImage = typeof item.drawingImage === "string" ? item.drawingImage : null;
  return [
    `${sessionId}:${item.taskId}`,
    sessionId,
    item.taskId,
    item.domain || "",
    item.title || "",
    item.modality || "",
    toInteger(item.maxScore),
    toInteger(item.score),
    item.startedAt || null,
    item.endedAt || null,
    toInteger(item.durationMs),
    jsonString(item.answer, {}),
    jsonString(item.behavior, {}),
    jsonString(item.ai, null),
    drawingImage,
    drawingImage ? 1 : 0
  ];
}

export function slimSessionFromRow(row) {
  const participant = parseJson(row.participant_json, {});
  if (row.participant_age !== undefined && row.participant_age !== null) participant.age = row.participant_age;
  return {
    id: row.id,
    participant,
    participantAge: row.participant_age ?? participant.age ?? null,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    savedAt: row.saved_at,
    totalDurationMs: row.total_duration_ms,
    rawScore: row.raw_score,
    educationBonus: row.education_bonus,
    totalScore: row.total_score,
    riskBand: row.risk_band,
    itemCount: row.item_count || 0,
    storageMode: "cloudflare-d1"
  };
}

export function fullSessionFromRows(sessionRow, itemRows) {
  const base = parseJson(sessionRow.payload_json, {});
  const participant = parseJson(sessionRow.participant_json, {});
  if (sessionRow.participant_age !== undefined && sessionRow.participant_age !== null) participant.age = sessionRow.participant_age;
  return {
    ...base,
    id: sessionRow.id,
    participant,
    participantAge: sessionRow.participant_age ?? participant.age ?? base.participantAge ?? null,
    startedAt: sessionRow.started_at,
    finishedAt: sessionRow.finished_at,
    savedAt: sessionRow.saved_at,
    totalDurationMs: sessionRow.total_duration_ms,
    rawScore: sessionRow.raw_score,
    educationBonus: sessionRow.education_bonus,
    totalScore: sessionRow.total_score,
    riskBand: sessionRow.risk_band,
    domainScores: parseJson(sessionRow.domain_scores_json, {}),
    storageMode: "cloudflare-d1",
    itemResponses: itemRows.map((row) => ({
      taskId: row.task_id,
      domain: row.domain,
      title: row.title,
      modality: row.modality,
      maxScore: row.max_score,
      score: row.score,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      durationMs: row.duration_ms,
      answer: parseJson(row.answer_json, {}),
      behavior: parseJson(row.behavior_json, {}),
      drawingImage: row.drawing_image,
      ai: parseJson(row.ai_json, null)
    }))
  };
}
