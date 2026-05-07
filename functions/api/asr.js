import { json } from "../_lib/http.js";

const WHISPER_MODEL = "@cf/openai/whisper";
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

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

  let result;
  try {
    result = await env.AI.run(WHISPER_MODEL, {
      audio: [...new Uint8Array(audioBuffer)]
    });
  } catch (error) {
    return json({
      error: "Speech transcription failed",
      message: error?.message || "Cloudflare Workers AI Whisper failed"
    }, 502);
  }

  return json({
    provider: "cloudflare-workers-ai",
    model: WHISPER_MODEL,
    text: String(result?.text || "").trim(),
    raw: result
  });
}
