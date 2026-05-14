import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { base64ChunksToUint8Array, serializeTtsError, synthesizeDoubaoSpeech } from "./functions/_lib/doubao-tts.js";
import { demoScore, scorePayload } from "./functions/_lib/vision-score.js";

const root = dirname(fileURLToPath(import.meta.url));
const publicRoot = root;
const dataDir = process.env.DATA_DIR || join(root, "data");
const sessionsFile = join(dataDir, "sessions.json");
const port = Number(process.env.PORT || 5177);
const host = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1");
const asrProxyEndpoint = process.env.ASR_PROXY_ENDPOINT || "https://cognition-hearing-game.pages.dev/api/asr";
const apiCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".ico": "image/x-icon"
};

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await stat(sessionsFile);
  } catch {
    await writeFile(sessionsFile, "[]\n", "utf8");
  }
}

async function readSessions() {
  await ensureStore();
  const raw = await readFile(sessionsFile, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSessions(sessions) {
  await ensureStore();
  await writeFile(sessionsFile, `${JSON.stringify(sessions)}\n`, "utf8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let len = 0;
    req.on("data", (chunk) => {
      chunks.push(chunk);
      len += chunk.length;
      if (len > 25 * 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  const body = await readBody(req);
  return body.length ? JSON.parse(body.toString("utf8")) : {};
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
  const age = ageFromBirthDate(copy.birthYear);
  if (age !== null) copy.age = age;
  else delete copy.age;
  return { participant: copy, age };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    ...apiCorsHeaders,
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function slimSession(session) {
  return {
    id: session.id,
    participant: session.participant,
    participantAge: session.participantAge ?? session.participant?.age ?? null,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    savedAt: session.savedAt,
    totalDurationMs: session.totalDurationMs,
    rawScore: session.rawScore,
    educationBonus: session.educationBonus,
    totalScore: session.totalScore,
    riskBand: session.riskBand,
    itemCount: session.itemResponses?.length || 0,
    storageMode: session.storageMode
  };
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      ...apiCorsHeaders,
      "cache-control": "no-store"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      service: "cognition-hearing-game",
      dataDir,
      now: new Date().toISOString()
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/sessions") {
    const sessions = await readSessions();
    sendJson(res, 200, sessions.map(slimSession));
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/sessions/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/sessions/", ""));
    const sessions = await readSessions();
    const session = sessions.find((entry) => entry.id === id);
    if (!session) {
      notFound(res);
      return;
    }
    sendJson(res, 200, session);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/sessions") {
    const payload = await readJsonBody(req);
    const sessions = await readSessions();
    const now = new Date().toISOString();
    const participantInfo = normalizeParticipant(payload.participant);
    const saved = {
      ...payload,
      id: payload.id || crypto.randomUUID(),
      participant: participantInfo.participant,
      participantAge: participantInfo.age,
      savedAt: now
    };
    const index = sessions.findIndex((entry) => entry.id === saved.id);
    if (index >= 0) {
      sessions[index] = saved;
    } else {
      sessions.unshift(saved);
    }
    await writeSessions(sessions);
    sendJson(res, 200, slimSession(saved));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai-score") {
    const payload = await readJsonBody(req);

    try {
      sendJson(res, 200, await scorePayload(payload, process.env, { demoMode: "local-ai-demo" }));
    } catch (error) {
      const fallback = demoScore(payload, "local-ai-demo");
      sendJson(res, 200, {
        ...fallback,
        error: "ai_score_failed",
        comment: error?.message || fallback.comment
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/asr") {
    const body = await readBody(req);
    try {
      const remote = await fetch(`${asrProxyEndpoint}${url.search}`, {
        method: "POST",
        headers: { "content-type": req.headers["content-type"] || "application/octet-stream" },
        body
      });
      const result = await remote.text();
      res.writeHead(remote.status, {
        ...apiCorsHeaders,
        "content-type": remote.headers.get("content-type") || "application/json; charset=utf-8",
        "cache-control": "no-store"
      });
      res.end(result);
    } catch (error) {
      sendJson(res, 502, {
        error: "ASR proxy failed",
        message: error?.message || "无法连接语音识别服务。"
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/tts") {
    const payload = await readJsonBody(req);

    try {
      const result = await synthesizeDoubaoSpeech(payload, process.env);
      const bytes = base64ChunksToUint8Array(result.audioBase64Chunks);
      res.writeHead(200, {
        ...apiCorsHeaders,
        "content-type": result.mimeType,
        "cache-control": "no-store",
        "x-tts-provider": result.provider,
        "x-tts-request-id": result.requestId,
        "x-tts-voice-type": result.voiceType
      });
      res.end(Buffer.from(bytes));
    } catch (error) {
      const serialized = serializeTtsError(error);
      sendJson(res, serialized.status, serialized.payload);
    }
    return;
  }

  notFound(res);
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith("/data/")) {
    notFound(res);
    return;
  }
  if (pathname === "/") pathname = "/index.html";
  const requested = normalize(join(publicRoot, pathname));
  if (!requested.startsWith(publicRoot)) {
    notFound(res);
    return;
  }
  try {
    await stat(requested);
    const ext = extname(requested);
    res.writeHead(200, {
      "content-type": contentTypes[ext] || "application/octet-stream",
      "cache-control": ["html", "js", "json", "css"].includes(ext.slice(1)) ? "no-store" : "public, max-age=31536000, immutable"
    });
    createReadStream(requested).pipe(res);
  } catch {
    notFound(res);
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
    } else {
      await serveStatic(req, res, url);
    }
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(port, host, () => {
  console.log(`Cognition hearing game running at http://${host}:${port}`);
});
