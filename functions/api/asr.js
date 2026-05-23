import { json } from "../_lib/http.js";

const WHISPER_MODEL = "@cf/openai/whisper-large-v3-turbo";
const WHISPER_FALLBACK_MODEL = "@cf/openai/whisper";
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
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

function asrPromptForTask(taskId) {
  return taskId === "fluency" ? FLUENCY_ASR_PROMPT : CHINESE_ASR_PROMPT;
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
  if (!env.AI?.run) {
    return json({
      error: "Workers AI is not bound",
      message: "请在 Cloudflare Pages 的 Functions 绑定中添加 Workers AI，变量名设为 AI。"
    }, 500);
  }

  const audioBuffer = await request.arrayBuffer();
  if (!audioBuffer.byteLength) {
    return json({ error: "Empty audio" }, 400);
  }
  if (audioBuffer.byteLength > MAX_AUDIO_BYTES) {
    return json({ error: "Audio too large", maxBytes: MAX_AUDIO_BYTES }, 413);
  }

  const url = new URL(request.url);
  const taskId = url.searchParams.get("taskId") || "";
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
