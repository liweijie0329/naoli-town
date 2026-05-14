import { json, readJson } from "../_lib/http.js";

const DEFAULT_WORKERS_AI_VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

export async function onRequestPost({ request, env }) {
  if (!env?.AI?.run) {
    return json({
      success: false,
      error: "workers_ai_unbound",
      message: "Cloudflare Workers AI binding AI is not configured."
    }, 503);
  }

  const payload = await readJson(request);
  if (payload?.confirm !== "agree") {
    return json({
      success: false,
      error: "missing_confirm",
      message: "POST { \"confirm\": \"agree\" } to accept the configured model license through this Pages AI binding."
    }, 400);
  }

  const model = env.WORKERS_AI_VISION_MODEL || DEFAULT_WORKERS_AI_VISION_MODEL;
  try {
    const result = await env.AI.run(model, {
      prompt: "agree",
      max_tokens: 64
    });
    return json({
      success: true,
      model,
      result
    });
  } catch (error) {
    return json({
      success: false,
      model,
      error: "workers_ai_agree_failed",
      message: error?.message || String(error)
    }, 500);
  }
}
