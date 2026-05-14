const DEFAULT_OPENAI_VISION_MODEL = "gpt-4.1-mini";
const DEFAULT_OPENAI_RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";

function clampScore(value, maxScore) {
  const score = Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;
  return Math.max(0, Math.min(maxScore, score));
}

function envValue(env = {}, key) {
  return env?.[key] || "";
}

function isDrawingPayload(payload = {}) {
  return ["cube", "clock"].includes(payload.taskId) && typeof payload.image === "string" && payload.image.startsWith("data:image/");
}

function hasClientScore(payload = {}) {
  return typeof payload.clientAutoScore === "number" && Number.isFinite(payload.clientAutoScore);
}

export function demoScore(payload = {}, mode = "demo-ai") {
  const maxScore = Number.isFinite(Number(payload.maxScore)) ? Number(payload.maxScore) : 0;
  const needsConfiguredAi = isDrawingPayload(payload) && !hasClientScore(payload);
  const scoreSuggestion = clampScore(hasClientScore(payload) ? payload.clientAutoScore : 0, maxScore);
  return {
    mode,
    taskId: payload.taskId,
    scoreSuggestion,
    confidence: needsConfiguredAi ? 0 : payload.image ? 0.68 : 0.82,
    requiresHumanReview: false,
    aiImageScoringConfigured: !needsConfiguredAi,
    rubricMatched: !needsConfiguredAi,
    comment: needsConfiguredAi
      ? "画图题已关闭人工勾选；请配置 OPENAI_API_KEY 启用内置图片 AI 评分。"
      : "演示评分已返回结果。"
  };
}

export async function scorePayload(payload = {}, env = {}, options = {}) {
  if (isDrawingPayload(payload) && envValue(env, "OPENAI_API_KEY")) {
    return scoreDrawingWithOpenAi(payload, env);
  }

  if (envValue(env, "AI_SCORE_ENDPOINT")) {
    return scoreWithExternalEndpoint(payload, env);
  }

  return demoScore(payload, options.demoMode || "demo-ai");
}

async function scoreWithExternalEndpoint(payload, env) {
  const aiResponse = await fetch(env.AI_SCORE_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await aiResponse.json();
  if (!aiResponse.ok) {
    throw new Error(result?.message || result?.error || `AI_SCORE_ENDPOINT HTTP ${aiResponse.status}`);
  }
  return normalizeAiScore(result, payload, "external-ai-score-endpoint");
}

async function scoreDrawingWithOpenAi(payload, env) {
  const endpoint = envValue(env, "OPENAI_RESPONSES_ENDPOINT") || DEFAULT_OPENAI_RESPONSES_ENDPOINT;
  const model = envValue(env, "OPENAI_VISION_MODEL") || DEFAULT_OPENAI_VISION_MODEL;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(openAiRequestBody(payload, model))
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error?.message || result?.message || `OpenAI HTTP ${response.status}`);
  }
  const parsed = parseModelJson(result);
  return normalizeAiScore(parsed, payload, "openai-vision");
}

function openAiRequestBody(payload, model) {
  return {
    model,
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: [
              "你是 MoCA 中文量表画图题评分助手。",
              "只根据用户提交的图片和评分标准评分，不使用人工勾选，也不要宽松给印象分。",
              "必须返回严格 JSON，不要 Markdown，不要解释 JSON 以外的文字。",
              "scoreSuggestion 必须是 0 到 maxScore 的整数；confidence 是 0 到 1；requiresHumanReview 固定返回 false。",
              "立方体：所有条件都满足才 1 分，任一条件不满足为 0 分。",
              "钟表：轮廓、数字、指针三项各 1 分，严格按 rubricDetails 判断。"
            ].join("\n")
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              taskId: payload.taskId,
              taskType: payload.taskType,
              maxScore: payload.maxScore,
              rubric: payload.rubric,
              rubricDetails: payload.rubricDetails
            })
          },
          {
            type: "input_image",
            image_url: payload.image,
            detail: "high"
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "moca_image_score",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["scoreSuggestion", "confidence", "rubricMatched", "requiresHumanReview", "comment", "criteria"],
          properties: {
            scoreSuggestion: { type: "integer" },
            confidence: { type: "number" },
            rubricMatched: { type: "boolean" },
            requiresHumanReview: { type: "boolean" },
            comment: { type: "string" },
            criteria: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["key", "label", "passed", "evidence"],
                properties: {
                  key: { type: "string" },
                  label: { type: "string" },
                  passed: { type: "boolean" },
                  evidence: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    max_output_tokens: 900,
    store: false
  };
}

function parseModelJson(result) {
  const text = extractOutputText(result);
  if (!text) throw new Error("OpenAI response did not include output text");
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/({[\s\S]*})/);
    if (match) return JSON.parse(match[1]);
    throw new Error("OpenAI response was not valid JSON");
  }
}

function extractOutputText(result) {
  if (typeof result?.output_text === "string") return result.output_text;
  const chunks = [];
  for (const item of result?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("").trim();
}

function normalizeAiScore(result = {}, payload = {}, mode = "ai-score") {
  const maxScore = Number.isFinite(Number(payload.maxScore)) ? Number(payload.maxScore) : 0;
  return {
    mode,
    taskId: payload.taskId,
    scoreSuggestion: clampScore(result.scoreSuggestion, maxScore),
    confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
    requiresHumanReview: false,
    aiImageScoringConfigured: mode === "openai-vision" || mode === "external-ai-score-endpoint",
    rubricMatched: Boolean(result.rubricMatched),
    comment: String(result.comment || ""),
    criteria: Array.isArray(result.criteria) ? result.criteria : []
  };
}
