import { json, readJson } from "../_lib/http.js";
import { demoScore, scorePayload } from "../_lib/vision-score.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);

  try {
    return json(await scorePayload(payload, env, { demoMode: "cloudflare-demo-ai" }));
  } catch (error) {
    const fallback = demoScore(payload, "cloudflare-demo-ai");
    return json({
      ...fallback,
      error: "ai_score_failed",
      comment: error?.message || fallback.comment
    }, 200);
  }
}
