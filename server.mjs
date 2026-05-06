import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const root = dirname(fileURLToPath(import.meta.url));
const publicRoot = root;
const dataDir = process.env.DATA_DIR || join(root, "data");
const sessionsFile = join(dataDir, "sessions.json");
const port = Number(process.env.PORT || 5177);
const host = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
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
  await writeFile(sessionsFile, `${JSON.stringify(sessions, null, 2)}\n`, "utf8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 25 * 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      service: "moca-game-app",
      dataDir,
      now: new Date().toISOString()
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/sessions") {
    const sessions = await readSessions();
    const slim = sessions.map((session) => ({
      id: session.id,
      participant: session.participant,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      totalDurationMs: session.totalDurationMs,
      rawScore: session.rawScore,
      educationBonus: session.educationBonus,
      totalScore: session.totalScore,
      riskBand: session.riskBand,
      itemCount: session.itemResponses?.length || 0
    }));
    sendJson(res, 200, slim);
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
    const body = await readBody(req);
    const payload = body ? JSON.parse(body) : {};
    const sessions = await readSessions();
    const now = new Date().toISOString();
    const saved = {
      ...payload,
      id: payload.id || crypto.randomUUID(),
      savedAt: now
    };
    const index = sessions.findIndex((entry) => entry.id === saved.id);
    if (index >= 0) {
      sessions[index] = saved;
    } else {
      sessions.unshift(saved);
    }
    await writeSessions(sessions);
    sendJson(res, 200, saved);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai-score") {
    const body = await readBody(req);
    const payload = body ? JSON.parse(body) : {};

    if (process.env.AI_SCORE_ENDPOINT) {
      const aiResponse = await fetch(process.env.AI_SCORE_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await aiResponse.json();
      sendJson(res, aiResponse.ok ? 200 : aiResponse.status, result);
      return;
    }

    const maxScore = Number.isFinite(Number(payload.maxScore))
      ? Number(payload.maxScore)
      : 0;
    let scoreSuggestion =
      typeof payload.clientAutoScore === "number"
        ? payload.clientAutoScore
        : null;

    if (scoreSuggestion === null && payload.image && ["cube", "clock"].includes(payload.taskId)) {
      scoreSuggestion = maxScore;
    }

    if (scoreSuggestion === null) scoreSuggestion = 0;
    scoreSuggestion = Math.max(0, Math.min(maxScore, Math.round(scoreSuggestion)));

    sendJson(res, 200, {
      mode: "local-ai-demo",
      taskId: payload.taskId,
      scoreSuggestion,
      confidence: payload.image ? 0.68 : 0.82,
      requiresHumanReview: false,
      rubricMatched: true,
      comment:
        "本地演示环境已直接返回 AI 评分；生产环境请设置 AI_SCORE_ENDPOINT 接入真实模型评分服务。"
    });
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
      "content-type": contentTypes[ext] || "application/octet-stream"
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
  console.log(`MoCA game app running at http://${host}:${port}`);
});
