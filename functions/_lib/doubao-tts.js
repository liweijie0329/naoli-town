const DEFAULT_V3_ENDPOINT = "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
const DEFAULT_V1_ENDPOINT = "https://openspeech.bytedance.com/api/v1/tts";
const DEFAULT_RESOURCE_ID = "volc.service_type.10029";
const DEFAULT_CLUSTER = "volcano_tts";
const DEFAULT_V3_VOICE_TYPE = "zh_female_wanwanxiaohe_moon_bigtts";
const DEFAULT_V1_VOICE_TYPE = "BV700_streaming";
const DEFAULT_AUDIO_FORMAT = "mp3";
const DEFAULT_SAMPLE_RATE = 24000;
const MAX_TEXT_LENGTH = 800;

const FORMAT_MIME_TYPES = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  pcm: "audio/L16",
  ogg_opus: "audio/ogg; codecs=opus"
};

export class TtsConfigError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "TtsConfigError";
    this.status = 503;
    this.code = "tts_not_configured";
    this.details = details;
  }
}

export class TtsUpstreamError extends Error {
  constructor(message, status = 502, details = {}) {
    super(message);
    this.name = "TtsUpstreamError";
    this.status = status;
    this.code = "tts_upstream_error";
    this.details = details;
  }
}

export async function synthesizeDoubaoSpeech(input = {}, env = {}) {
  const text = normalizeText(input.text);
  if (!text) {
    throw new TtsUpstreamError("缺少要合成的文本。", 400);
  }

  const version = normalizeVersion(envValue(env, "DOUBAO_TTS_API_VERSION", "VOLCENGINE_TTS_API_VERSION"));
  return version === "v1"
    ? synthesizeV1(text, input, env)
    : synthesizeV3(text, input, env);
}

export function base64ChunksToUint8Array(chunks) {
  const parts = chunks.map((chunk) => base64ToUint8Array(chunk));
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    merged.set(part, offset);
    offset += part.length;
  }
  return merged;
}

export function serializeTtsError(error) {
  const status = Number.isFinite(Number(error?.status)) ? Number(error.status) : 500;
  return {
    status,
    payload: {
      error: error?.code || "tts_error",
      message: error?.message || "语音合成失败。",
      details: error?.details || {}
    }
  };
}

async function synthesizeV3(text, input, env) {
  const appId = envValue(env, "DOUBAO_TTS_APP_ID", "DOUBAO_TTS_APPID", "VOLCENGINE_TTS_APP_ID", "VOLCENGINE_TTS_APPID");
  const accessKey = envValue(env, "DOUBAO_TTS_ACCESS_KEY", "DOUBAO_TTS_ACCESS_TOKEN", "DOUBAO_TTS_TOKEN", "VOLCENGINE_TTS_ACCESS_KEY", "VOLCENGINE_TTS_ACCESS_TOKEN");
  const endpoint = envValue(env, "DOUBAO_TTS_ENDPOINT", "VOLCENGINE_TTS_ENDPOINT") || DEFAULT_V3_ENDPOINT;
  const resourceId = envValue(env, "DOUBAO_TTS_RESOURCE_ID", "VOLCENGINE_TTS_RESOURCE_ID") || DEFAULT_RESOURCE_ID;
  const format = normalizeFormat(input.format || envValue(env, "DOUBAO_TTS_FORMAT"));
  const requestId = requestIdFor(input);

  if (!appId || !accessKey) {
    throw new TtsConfigError("豆包语音合成未配置，请设置 DOUBAO_TTS_APP_ID 和 DOUBAO_TTS_ACCESS_KEY。", {
      required: ["DOUBAO_TTS_APP_ID", "DOUBAO_TTS_ACCESS_KEY"]
    });
  }

  const headers = {
    "content-type": "application/json",
    "x-api-app-id": appId,
    "x-api-access-key": accessKey,
    "x-api-resource-id": resourceId,
    "x-api-request-id": requestId,
    "x-api-sequence": "-1"
  };

  const appKey = envValue(env, "DOUBAO_TTS_APP_KEY", "VOLCENGINE_TTS_APP_KEY");
  if (appKey) headers["x-api-app-key"] = appKey;

  const body = {
    user: { uid: String(input.uid || "moca-web-client") },
    req_params: {
      text,
      speaker: voiceTypeFor(input, env) || DEFAULT_V3_VOICE_TYPE,
      audio_params: {
        format,
        sample_rate: sampleRateFor(input, env)
      }
    }
  };

  const speechRate = speechRateFor(input);
  if (speechRate !== 0) body.req_params.audio_params.speech_rate = speechRate;

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  const responseText = await response.text();
  const parsed = parseV3Response(responseText);

  if (!response.ok || parsed.error) {
    throw new TtsUpstreamError(parsed.error?.message || `豆包 TTS 请求失败：HTTP ${response.status}`, response.ok ? 502 : response.status, {
      provider: "doubao-v3",
      requestId,
      upstreamStatus: response.status,
      upstream: parsed.error || responseText.slice(0, 500)
    });
  }
  if (!parsed.audioBase64Chunks.length) {
    throw new TtsUpstreamError("豆包 TTS 没有返回音频数据。", 502, {
      provider: "doubao-v3",
      requestId,
      upstreamStatus: response.status
    });
  }

  return {
    provider: "doubao-v3",
    requestId,
    voiceType: body.req_params.speaker,
    format,
    mimeType: FORMAT_MIME_TYPES[format] || "audio/mpeg",
    audioBase64Chunks: parsed.audioBase64Chunks
  };
}

async function synthesizeV1(text, input, env) {
  const appId = envValue(env, "DOUBAO_TTS_APP_ID", "DOUBAO_TTS_APPID", "VOLCENGINE_TTS_APP_ID", "VOLCENGINE_TTS_APPID");
  const accessToken = envValue(env, "DOUBAO_TTS_ACCESS_TOKEN", "DOUBAO_TTS_TOKEN", "DOUBAO_TTS_ACCESS_KEY", "VOLCENGINE_TTS_ACCESS_TOKEN", "VOLCENGINE_TTS_ACCESS_KEY");
  const endpoint = envValue(env, "DOUBAO_TTS_ENDPOINT", "VOLCENGINE_TTS_ENDPOINT") || DEFAULT_V1_ENDPOINT;
  const cluster = envValue(env, "DOUBAO_TTS_CLUSTER", "VOLCENGINE_TTS_CLUSTER") || DEFAULT_CLUSTER;
  const format = normalizeFormat(input.format || envValue(env, "DOUBAO_TTS_FORMAT"));
  const requestId = requestIdFor(input);

  if (!appId || !accessToken) {
    throw new TtsConfigError("豆包语音合成未配置，请设置 DOUBAO_TTS_APP_ID 和 DOUBAO_TTS_ACCESS_TOKEN。", {
      required: ["DOUBAO_TTS_APP_ID", "DOUBAO_TTS_ACCESS_TOKEN"]
    });
  }

  const body = {
    app: {
      appid: appId,
      token: "access_token",
      cluster
    },
    user: {
      uid: String(input.uid || "moca-web-client")
    },
    audio: {
      voice_type: voiceTypeFor(input, env) || DEFAULT_V1_VOICE_TYPE,
      encoding: format,
      rate: sampleRateFor(input, env),
      speed_ratio: speedRatioFor(input),
      volume_ratio: volumeRatioFor(input),
      pitch_ratio: pitchRatioFor(input)
    },
    request: {
      reqid: requestId,
      text,
      text_type: "plain",
      operation: "query"
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer;${accessToken}`
    },
    body: JSON.stringify(body)
  });
  const responseText = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = null;
  }

  const hasAudio = typeof parsed?.data === "string" && parsed.data.trim();
  const successCode = parsed?.code === 3000 || parsed?.code === 0 || parsed?.success === true;
  if (!response.ok || !parsed || (!hasAudio && !successCode)) {
    throw new TtsUpstreamError(parsed?.message || `豆包 TTS 请求失败：HTTP ${response.status}`, response.ok ? 502 : response.status, {
      provider: "doubao-v1",
      requestId,
      upstreamStatus: response.status,
      upstream: parsed || responseText.slice(0, 500)
    });
  }
  if (!hasAudio) {
    throw new TtsUpstreamError("豆包 TTS 没有返回音频数据。", 502, {
      provider: "doubao-v1",
      requestId,
      upstreamStatus: response.status,
      upstream: parsed
    });
  }

  return {
    provider: "doubao-v1",
    requestId,
    voiceType: body.audio.voice_type,
    format,
    mimeType: FORMAT_MIME_TYPES[format] || "audio/mpeg",
    audioBase64Chunks: [cleanBase64(parsed.data)]
  };
}

function parseV3Response(text) {
  const candidates = jsonCandidatesFromText(text);
  const audioBase64Chunks = [];
  let upstreamError = null;

  for (const entry of candidates) {
    if (typeof entry?.data === "string" && entry.data.trim()) {
      audioBase64Chunks.push(cleanBase64(entry.data));
    }
    if (Array.isArray(entry?.data)) {
      entry.data.forEach((chunk) => {
        if (typeof chunk === "string" && chunk.trim()) audioBase64Chunks.push(cleanBase64(chunk));
      });
    }
    const statusCode = Number(entry?.code ?? entry?.status_code ?? entry?.statusCode);
    const isOkCode = !Number.isFinite(statusCode) || statusCode === 0 || statusCode === 20000000;
    if (!isOkCode) {
      upstreamError = {
        code: statusCode,
        message: entry?.message || entry?.msg || "豆包 TTS 上游返回错误。",
        raw: entry
      };
    }
  }

  return { audioBase64Chunks, error: upstreamError };
}

function jsonCandidatesFromText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return [];

  try {
    return [JSON.parse(trimmed)];
  } catch {
    // The v3 streaming endpoint may return newline-delimited JSON or SSE data lines.
  }

  return trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.startsWith("data:") ? line.slice(5).trim() : line)
    .filter((line) => line && line !== "[DONE]")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function envValue(env, ...keys) {
  for (const key of keys) {
    const value = env?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function voiceTypeFor(input, env) {
  const profile = String(input.profile || "").replace(/[^a-z0-9_]/gi, "").toUpperCase();
  const profileVoice = profile ? envValue(env, `DOUBAO_TTS_VOICE_${profile}`, `VOLCENGINE_TTS_VOICE_${profile}`) : "";
  return input.voiceType || profileVoice || envValue(env, "DOUBAO_TTS_VOICE_TYPE", "VOLCENGINE_TTS_VOICE_TYPE");
}

function normalizeText(value) {
  const text = String(value || "").trim();
  return text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text;
}

function normalizeVersion(value) {
  return String(value || "v3").toLowerCase() === "v1" ? "v1" : "v3";
}

function normalizeFormat(value) {
  const format = String(value || DEFAULT_AUDIO_FORMAT).toLowerCase();
  return FORMAT_MIME_TYPES[format] ? format : DEFAULT_AUDIO_FORMAT;
}

function sampleRateFor(input, env) {
  const value = Number(input.sampleRate || envValue(env, "DOUBAO_TTS_SAMPLE_RATE"));
  return Number.isFinite(value) && value > 0 ? Math.round(value) : DEFAULT_SAMPLE_RATE;
}

function speedRatioFor(input) {
  return clampNumber(input.speedRatio, 0.6, 1.4, 1);
}

function volumeRatioFor(input) {
  return clampNumber(input.volumeRatio, 0.1, 2, 1);
}

function pitchRatioFor(input) {
  return clampNumber(input.pitchRatio, 0.6, 1.4, 1);
}

function speechRateFor(input) {
  return Math.round((speedRatioFor(input) - 1) * 100);
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function requestIdFor(input) {
  if (input.requestId) return String(input.requestId);
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cleanBase64(value) {
  return String(value || "").replace(/^data:[^,]+,/, "").replace(/\s+/g, "");
}

function base64ToUint8Array(value) {
  const binary = globalThis.atob(cleanBase64(value));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
