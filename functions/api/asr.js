import { json } from "../_lib/http.js";

const WHISPER_MODEL = "@cf/openai/whisper-large-v3-turbo";
const WHISPER_FALLBACK_MODEL = "@cf/openai/whisper";
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const IFLYTEK_IAT_HOST = "iat-api.xfyun.cn";
const IFLYTEK_IAT_PATH = "/v2/iat";
const IFLYTEK_IAT_MODEL = "iat";
const IFLYTEK_DEFAULT_FRAME_BYTES = 1280;
const CHINESE_ASR_PROMPT = "这是一段中文普通话认知测验语音回答。请按听到内容转写为简体中文。";
const FLUENCY_ASR_PROMPT = [
  "这是一段中文普通话认知测验中的动物词语流畅性回答。",
  "说话者会连续、快速地列举动物名称，例如狗、猫、牛、马、羊、猪、鸡、鸭、鹅、兔、老虎、狮子、大象、猴子、熊猫、长颈鹿、斑马、河马、鱼、鸟、蛇、乌龟、青蛙、海豚等。",
  "请把听到的每一个动物名都逐个转写出来，用逗号或空格分隔；即使说得很快、连在一起或有重复，也不要省略动物名称。",
  "不要总结，不要只输出数量，不要改写成句子，输出简体中文。"
].join("");
const TRADITIONAL_PHRASE_REPLACEMENTS = [
  ["甚麼", "什么"],
  ["什麼", "什么"],
  ["為什麼", "为什么"],
  ["怎麼", "怎么"],
  ["這個", "这个"],
  ["那個", "那个"],
  ["裡面", "里面"],
  ["裏面", "里面"],
  ["語音", "语音"],
  ["轉文字", "转文字"],
  ["識別", "识别"],
  ["動物", "动物"],
  ["詞語", "词语"],
  ["複述", "复述"],
  ["聽力", "听力"],
  ["認知", "认知"],
  ["測驗", "测验"],
  ["記憶", "记忆"],
  ["數字", "数字"],
  ["畫圖", "画图"]
];
const TRADITIONAL_CHAR_REPLACEMENTS = {
  語: "语", 題: "题", 轉: "转", 錄: "录", 識: "识", 別: "别", 顯: "显", 體: "体", 簡: "简",
  聽: "听", 說: "说", 請: "请", 動: "动", 詞: "词", 暢: "畅", 複: "复", 選: "选", 擇: "择",
  記: "记", 憶: "忆", 測: "测", 驗: "验", 視: "视", 覺: "觉", 結: "结", 後: "后", 臺: "台",
  這: "这", 個: "个", 麼: "么", 為: "为", 對: "对", 還: "还", 會: "会", 開: "开", 關: "关",
  時: "时", 鐘: "钟", 錶: "表", 畫: "画", 圖: "图", 長: "长", 順: "顺", 應: "应", 該: "该",
  歲: "岁", 無: "无", 聲: "声", 麥: "麦", 風: "风", 權: "权", 傳: "传", 雲: "云", 華: "华",
  寫: "写", 萬: "万", 與: "与", 來: "来", 國: "国", 電: "电", 腦: "脑", 點: "点", 擊: "击",
  貓: "猫", 雞: "鸡", 鷄: "鸡", 鴨: "鸭", 鵝: "鹅", 馬: "马", 魚: "鱼", 鳥: "鸟", 豬: "猪",
  龍: "龙", 龜: "龟", 鯨: "鲸", 鯊: "鲨", 鱷: "鳄", 鴿: "鸽", 鷹: "鹰", 鶴: "鹤", 獅: "狮",
  駱: "骆", 駝: "驼", 驢: "驴", 騾: "骡", 犛: "牦", 獵: "猎", 錢: "钱", 獺: "獭",
  鴉: "鸦", 鵲: "鹊", 鴕: "鸵", 鱸: "鲈", 鮭: "鲑", 鮑: "鲍", 蟬: "蝉", 蠍: "蝎",
  蠶: "蚕", 蟲: "虫", 蟻: "蚁", 蠅: "蝇", 蝸: "蜗", 蝦: "虾", 鳳: "凤",
  發: "发", 隻: "只", 裡: "里", 裏: "里"
};

function toSimplifiedChinese(text) {
  let output = String(text || "");
  TRADITIONAL_PHRASE_REPLACEMENTS.forEach(([from, to]) => {
    output = output.split(from).join(to);
  });
  return Array.from(output, (char) => TRADITIONAL_CHAR_REPLACEMENTS[char] || char).join("");
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function utf8Base64(text) {
  const bytes = new TextEncoder().encode(String(text || ""));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function asrPromptForTask(taskId) {
  return taskId === "fluency" ? FLUENCY_ASR_PROMPT : CHINESE_ASR_PROMPT;
}

function envText(env, ...names) {
  for (const name of names) {
    const value = env?.[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function iflytekCredentials(env) {
  return {
    appId: envText(env, "IFLYTEK_APP_ID", "XFYUN_APP_ID"),
    apiKey: envText(env, "IFLYTEK_API_KEY", "XFYUN_API_KEY"),
    apiSecret: envText(env, "IFLYTEK_API_SECRET", "XFYUN_API_SECRET")
  };
}

function isIflytekConfigured(env) {
  const credentials = iflytekCredentials(env);
  return Boolean(credentials.appId && credentials.apiKey && credentials.apiSecret);
}

function preferredAsrProvider(env) {
  const configured = envText(env, "ASR_PROVIDER").toLowerCase();
  if (configured) return configured;
  return isIflytekConfigured(env) ? "iflytek" : "cloudflare";
}

async function hmacSha256Base64(secret, text) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return arrayBufferToBase64(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text)));
}

async function iflytekIatUrl(apiKey, apiSecret) {
  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${IFLYTEK_IAT_HOST}\ndate: ${date}\nGET ${IFLYTEK_IAT_PATH} HTTP/1.1`;
  const signature = await hmacSha256Base64(apiSecret, signatureOrigin);
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const params = new URLSearchParams({
    authorization: utf8Base64(authorizationOrigin),
    date,
    host: IFLYTEK_IAT_HOST
  });
  return `wss://${IFLYTEK_IAT_HOST}${IFLYTEK_IAT_PATH}?${params.toString()}`;
}

function asciiAt(bytes, offset, text) {
  for (let index = 0; index < text.length; index += 1) {
    if (bytes[offset + index] !== text.charCodeAt(index)) return false;
  }
  return true;
}

function parseWavPcm(audioBuffer) {
  const bytes = new Uint8Array(audioBuffer);
  if (bytes.length < 44 || !asciiAt(bytes, 0, "RIFF") || !asciiAt(bytes, 8, "WAVE")) return null;
  const view = new DataView(audioBuffer);
  let offset = 12;
  let sampleRate = 16000;
  let channels = 1;
  let bitsPerSample = 16;
  let dataStart = -1;
  let dataLength = 0;
  while (offset + 8 <= bytes.length) {
    const chunkId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
    const chunkLength = view.getUint32(offset + 4, true);
    const chunkStart = offset + 8;
    if (chunkId === "fmt " && chunkLength >= 16) {
      channels = view.getUint16(chunkStart + 2, true);
      sampleRate = view.getUint32(chunkStart + 4, true);
      bitsPerSample = view.getUint16(chunkStart + 14, true);
    }
    if (chunkId === "data") {
      dataStart = chunkStart;
      dataLength = Math.min(chunkLength, bytes.length - chunkStart);
      break;
    }
    offset = chunkStart + chunkLength + (chunkLength % 2);
  }
  if (dataStart < 0 || dataLength <= 0) return null;
  return {
    bytes: bytes.slice(dataStart, dataStart + dataLength),
    sampleRate,
    channels,
    bitsPerSample
  };
}

function audioForIflytek(audioBuffer, contentType = "") {
  const wav = parseWavPcm(audioBuffer);
  if (wav) {
    if (wav.channels !== 1 || wav.bitsPerSample !== 16) {
      throw new Error("科大讯飞语音听写需要 16bit 单声道 PCM/WAV 音频。");
    }
    return {
      bytes: wav.bytes,
      format: `audio/L16;rate=${wav.sampleRate || 16000}`,
      encoding: "raw",
      sampleRate: wav.sampleRate || 16000
    };
  }
  const normalizedType = String(contentType || "").toLowerCase();
  if (normalizedType.includes("mpeg") || normalizedType.includes("mp3")) {
    return {
      bytes: new Uint8Array(audioBuffer),
      format: "audio/L16;rate=16000",
      encoding: "lame",
      sampleRate: 16000
    };
  }
  return {
    bytes: new Uint8Array(audioBuffer),
    format: "audio/L16;rate=16000",
    encoding: "raw",
    sampleRate: 16000
  };
}

function iflytekTextFromMessage(message) {
  const words = message?.data?.result?.ws || [];
  return words.map((entry) => entry?.cw?.[0]?.w || "").join("");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runIflytekIat(env, audioBuffer, taskId, contentType = "") {
  if (typeof WebSocket === "undefined") {
    throw new Error("当前运行环境不支持 WebSocket，无法连接科大讯飞语音听写。");
  }
  const { appId, apiKey, apiSecret } = iflytekCredentials(env);
  if (!appId || !apiKey || !apiSecret) {
    throw new Error("缺少科大讯飞语音识别配置：IFLYTEK_APP_ID、IFLYTEK_API_KEY、IFLYTEK_API_SECRET。");
  }
  const audio = audioForIflytek(audioBuffer, contentType);
  if (!audio.bytes.length) throw new Error("音频为空，无法进行科大讯飞语音识别。");
  const url = await iflytekIatUrl(apiKey, apiSecret);
  const frameBytes = Math.max(640, Number(envText(env, "IFLYTEK_FRAME_BYTES")) || IFLYTEK_DEFAULT_FRAME_BYTES);
  const frameDelayMs = Math.max(0, Number(envText(env, "IFLYTEK_FRAME_DELAY_MS")) || 0);
  const timeoutMs = Math.max(15000, Number(envText(env, "IFLYTEK_TIMEOUT_MS")) || 120000);
  const rawMessages = [];

  return await new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const textParts = [];
    let settled = false;
    const finish = (handler, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      try {
        ws.close();
      } catch {}
      handler(value);
    };
    const timeout = setTimeout(() => {
      finish(reject, new Error("科大讯飞语音识别超时。"));
    }, timeoutMs);

    ws.addEventListener("open", () => {
      (async () => {
        const total = Math.ceil(audio.bytes.length / frameBytes);
        for (let index = 0; index < total; index += 1) {
          const start = index * frameBytes;
          const chunk = audio.bytes.slice(start, Math.min(audio.bytes.length, start + frameBytes));
          const status = index === 0 ? 0 : index === total - 1 ? 2 : 1;
          ws.send(JSON.stringify({
            common: index === 0 ? { app_id: appId } : undefined,
            business: index === 0 ? {
              language: envText(env, "IFLYTEK_LANGUAGE") || "zh_cn",
              domain: envText(env, "IFLYTEK_DOMAIN") || "iat",
              accent: envText(env, "IFLYTEK_ACCENT") || "mandarin",
              vad_eos: Number(envText(env, "IFLYTEK_VAD_EOS")) || 10000,
              ptt: 0
            } : undefined,
            data: {
              status,
              format: audio.format,
              encoding: audio.encoding,
              audio: arrayBufferToBase64(chunk.buffer)
            }
          }));
          if (frameDelayMs && index < total - 1) await delay(frameDelayMs);
        }
      })().catch((error) => finish(reject, error));
    });

    ws.addEventListener("message", (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      rawMessages.push(message);
      const code = Number(message.code || 0);
      if (code !== 0) {
        finish(reject, new Error(message.message || `科大讯飞语音识别失败：${message.code}`));
        return;
      }
      const text = iflytekTextFromMessage(message);
      if (text) textParts.push(text);
      if (Number(message?.data?.status) === 2) {
        finish(resolve, {
          provider: "iflytek",
          model: IFLYTEK_IAT_MODEL,
          text: toSimplifiedChinese(textParts.join("")),
          raw: { sid: message.sid || "", messages: rawMessages.slice(-6), sampleRate: audio.sampleRate }
        });
      }
    });

    ws.addEventListener("error", () => {
      finish(reject, new Error("科大讯飞语音识别连接失败。"));
    });

    ws.addEventListener("close", () => {
      if (!settled) finish(reject, new Error("科大讯飞语音识别连接已关闭。"));
    });
  });
}

async function runWhisper(env, audioBuffer, taskId) {
  const audioBase64 = arrayBufferToBase64(audioBuffer);
  try {
    const result = await env.AI.run(WHISPER_MODEL, {
      audio: audioBase64,
      task: "transcribe",
      language: "zh",
      initial_prompt: asrPromptForTask(taskId),
      vad_filter: false
    });
    return { model: WHISPER_MODEL, result };
  } catch (error) {
    const result = await env.AI.run(WHISPER_FALLBACK_MODEL, {
      audio: [...new Uint8Array(audioBuffer)]
    });
    return {
      model: WHISPER_FALLBACK_MODEL,
      result,
      fallbackFrom: WHISPER_MODEL,
      fallbackReason: error?.message || "Primary Whisper model failed"
    };
  }
}

function textFromAsrResult(result) {
  return String(result?.text || result?.transcription || result?.transcription_info?.text || "").trim();
}

export async function onRequestPost({ request, env }) {
  const audioBuffer = await request.arrayBuffer();
  if (!audioBuffer.byteLength) {
    return json({ error: "Empty audio" }, 400);
  }
  if (audioBuffer.byteLength > MAX_AUDIO_BYTES) {
    return json({ error: "Audio too large", maxBytes: MAX_AUDIO_BYTES }, 413);
  }

  const url = new URL(request.url);
  const taskId = url.searchParams.get("taskId") || "";
  const provider = preferredAsrProvider(env);
  if (provider === "iflytek" || provider === "xunfei" || provider === "xfyun") {
    try {
      const asr = await runIflytekIat(env, audioBuffer, taskId, request.headers.get("content-type") || "");
      return json(asr);
    } catch (error) {
      return json({
        error: "Speech transcription failed",
        provider: "iflytek",
        model: IFLYTEK_IAT_MODEL,
        message: error?.message || "科大讯飞语音识别失败"
      }, 502);
    }
  }

  if (!env.AI?.run) {
    return json({
      error: "Workers AI is not bound",
      message: "请配置科大讯飞 IFLYTEK_APP_ID / IFLYTEK_API_KEY / IFLYTEK_API_SECRET，或在 Cloudflare Pages Functions 绑定 Workers AI。"
    }, 500);
  }

  let asr;
  try {
    asr = await runWhisper(env, audioBuffer, taskId);
  } catch (error) {
    return json({
      error: "Speech transcription failed",
      message: error?.message || "Cloudflare Workers AI Whisper failed"
    }, 502);
  }

  return json({
    provider: "cloudflare-workers-ai",
    model: asr.model,
    fallbackFrom: asr.fallbackFrom || null,
    fallbackReason: asr.fallbackReason || null,
    text: toSimplifiedChinese(textFromAsrResult(asr.result)),
    raw: asr.result
  });
}
