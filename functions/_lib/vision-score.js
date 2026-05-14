const DEFAULT_OPENAI_VISION_MODEL = "gpt-4.1-mini";
const DEFAULT_OPENAI_RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";
const DEFAULT_WORKERS_AI_VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

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
  if (isDrawingPayload(payload) && env?.AI?.run) {
    return scoreDrawingWithWorkersAi(payload, env);
  }

  if (isDrawingPayload(payload) && envValue(env, "OPENAI_API_KEY")) {
    return scoreDrawingWithOpenAi(payload, env);
  }

  if (envValue(env, "AI_SCORE_ENDPOINT")) {
    return scoreWithExternalEndpoint(payload, env);
  }

  return demoScore(payload, options.demoMode || "demo-ai");
}

async function scoreDrawingWithWorkersAi(payload, env) {
  const model = envValue(env, "WORKERS_AI_VISION_MODEL") || DEFAULT_WORKERS_AI_VISION_MODEL;
  const result = await env.AI.run(model, {
    image: [...dataUrlToUint8Array(payload.image)],
    prompt: workersAiPrompt(payload),
    max_tokens: 700
  });
  const parsed = parseJsonText(result?.response || result?.description || result?.text || JSON.stringify(result));
  return normalizeAiScore(parsed, payload, "cloudflare-workers-ai");
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
              "只根据用户提交的图片和评分标准评分，不使用人工勾选。",
              "评分必须考虑手绘因素：线条抖动、重描、轻微断开、歪斜、大小不一、间距不均、椭圆或近似圆表盘都不应直接扣分。",
              "必须返回严格 JSON，不要 Markdown，不要解释 JSON 以外的文字。",
              "scoreSuggestion 必须是 0 到 maxScore 的整数；confidence 是 0 到 1；requiresHumanReview 固定返回 false。",
              "立方体：能辨认为三维盒状/立方体、主要边线基本存在、无明显无关多余线、相对边大致平行且长度接近，即可 1 分。",
              "钟表：轮廓、数字、指针三项各 1 分；圆/椭圆/近似圆可给轮廓分，1-12 基本写全且总体顺时针可给数字分，两根指针大致表示 11 点 10 分可给指针分。"
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
  return parseJsonText(text);
}

function parseJsonText(text) {
  if (text && typeof text === "object") {
    if (!Array.isArray(text)) return text;
    const object = text.find((item) => item && typeof item === "object" && !Array.isArray(item));
    if (object) return object;
  }
  const cleaned = String(text || "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      const parsed = tryParseJson(fenced[1].trim());
      if (parsed) return parsed;
    }
    const objectText = firstBalancedJsonObject(cleaned);
    if (objectText) {
      const parsed = tryParseJson(objectText);
      if (parsed) return parsed;
    }
    const looseScore = looseScoreFromText(cleaned);
    if (looseScore) return looseScore;
    throw new Error("AI response was not valid JSON");
  }
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function looseScoreFromText(text) {
  const scoreMatch = text.match(/"?scoreSuggestion"?\s*[:：]\s*"?(-?\d+)/i)
    || text.match(/(?:得分|分数|score)\D{0,12}(\d+)/i)
    || text.match(/给\s*(\d+)\s*分/);
  if (!scoreMatch) return null;
  const confidenceMatch = text.match(/"?confidence"?\s*[:：]\s*"?([01](?:\.\d+)?)/i);
  const commentMatch = text.match(/"?comment"?\s*[:：]\s*"([^"]{0,240})"/i);
  return {
    scoreSuggestion: Number(scoreMatch[1]),
    confidence: confidenceMatch ? Number(confidenceMatch[1]) : 0.5,
    rubricMatched: true,
    requiresHumanReview: false,
    comment: commentMatch?.[1] || "Workers AI 返回了非标准 JSON，已提取 scoreSuggestion 作为评分。",
    criteria: []
  };
}

function firstBalancedJsonObject(text) {
  for (let start = text.indexOf("{"); start >= 0; start = text.indexOf("{", start + 1)) {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === "\"") inString = false;
        continue;
      }
      if (char === "\"") inString = true;
      else if (char === "{") depth += 1;
      else if (char === "}") {
        depth -= 1;
        if (depth === 0) return text.slice(start, index + 1);
      }
    }
  }
  return "";
}

function workersAiPrompt(payload) {
  return [
    "你是 MoCA 中文量表画图题评分助手。只根据图片和评分标准评分。",
    "不要使用人工勾选。评分要考虑老年人手绘因素。",
    "线条抖动、重描、轻微断开、歪斜、大小不一、间距不均、椭圆或近似圆表盘都不应直接扣分。",
    "必须只输出一个单行 JSON 对象，不要 Markdown，不要解释文字，不要在 JSON 前后添加任何字符。",
    "JSON 字段：scoreSuggestion(integer), confidence(number), rubricMatched(boolean), requiresHumanReview(boolean), comment(string), criteria(array)。criteria 可为空数组。",
    "requiresHumanReview 固定 false。",
    "立方体：能辨认为三维盒状/立方体、主要边线基本存在、无明显无关多余线、相对边大致平行且长度接近，即可 1 分。",
    "钟表：轮廓、数字、指针三项各 1 分；圆/椭圆/近似圆可给轮廓分，1-12 基本写全且总体顺时针可给数字分，两根指针大致表示 11 点 10 分可给指针分。",
    JSON.stringify({
      taskId: payload.taskId,
      taskType: payload.taskType,
      maxScore: payload.maxScore,
      rubric: payload.rubric,
      rubricDetails: payload.rubricDetails
    })
  ].join("\n");
}

function dataUrlToUint8Array(dataUrl) {
  const [, body = ""] = String(dataUrl || "").split(",");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
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
    aiImageScoringConfigured: mode === "cloudflare-workers-ai" || mode === "openai-vision" || mode === "external-ai-score-endpoint",
    rubricMatched: Boolean(result.rubricMatched),
    comment: String(result.comment || ""),
    criteria: Array.isArray(result.criteria) ? result.criteria : []
  };
}
