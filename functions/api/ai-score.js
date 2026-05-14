import { json, readJson } from "../_lib/http.js";

function clampScore(value, maxScore) {
  const score = Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;
  return Math.max(0, Math.min(maxScore, score));
}

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);

  if (env.AI_SCORE_ENDPOINT) {
    const aiResponse = await fetch(env.AI_SCORE_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await aiResponse.json();
    return json(result, aiResponse.ok ? 200 : aiResponse.status);
  }

  const maxScore = Number.isFinite(Number(payload.maxScore)) ? Number(payload.maxScore) : 0;
  let scoreSuggestion = typeof payload.clientAutoScore === "number"
    ? payload.clientAutoScore
    : null;
  const needsConfiguredAi = ["cube", "clock"].includes(payload.taskId) && payload.image && scoreSuggestion === null;

  if (scoreSuggestion === null) scoreSuggestion = 0;

  return json({
    mode: "cloudflare-demo-ai",
    taskId: payload.taskId,
    scoreSuggestion: clampScore(scoreSuggestion, maxScore),
    confidence: needsConfiguredAi ? 0 : payload.image ? 0.68 : 0.82,
    requiresHumanReview: needsConfiguredAi,
    rubricMatched: !needsConfiguredAi,
    comment: needsConfiguredAi
      ? "画图题已关闭人工勾选；请绑定 AI_SCORE_ENDPOINT 进行图片 AI 评分。"
      : "Cloudflare 演示评分已返回结果；正式研究请绑定 AI_SCORE_ENDPOINT。"
  });
}
