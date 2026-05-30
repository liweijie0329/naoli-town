const DEFAULT_OPENAI_VISION_MODEL = "gpt-4.1-mini";
const DEFAULT_OPENAI_RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";
const DEFAULT_WORKERS_AI_VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";
const DRAWING_RUBRICS = {
  cube: [
    { key: "threeDimensional", label: "三维结构", standard: "图形为三维结构" },
    { key: "allLinesPresent", label: "线条完整", standard: "所有的线都存在" },
    { key: "noExtraLines", label: "无多余线", standard: "无多余的线" },
    { key: "parallelAndSimilar", label: "平行等长", standard: "相对的边基本平行，长度基本一致（长方体或棱柱体也算正确）" }
  ],
  clock: [
    { key: "contour", label: "轮廓", standard: "表面必须是个圆，允许有轻微的缺陷（如，圆没有闭合）" },
    { key: "numbers", label: "数字", standard: "所有的数字必须完整且无多余的数字；数字顺序必须正确且在所属的象限内；可以是罗马数字；数字可以放在圆圈之外" },
    { key: "hands", label: "指针", standard: "必须有两个指针且一起指向正确的时间；时针必须明显短于分针；指针的中心交点必须在表内且接近于钟表的中心" }
  ]
};

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
              "严格按照 MoCA 中文量表评分，不要放宽标准；不得凭题目要求推测图片中不存在的线、数字或指针。",
              "必须返回严格 JSON，不要 Markdown，不要解释 JSON 以外的文字。",
              "scoreSuggestion 必须是 0 到 maxScore 的整数；confidence 是 0 到 1；requiresHumanReview 固定返回 false。",
              "criteria 必须列出每个分项的 passed true/false；evidence 写图片证据；comment 只写未得分项目，满分时 comment 为空字符串。",
              "comment 示例：未得分：指针（必须有两个指针且一起指向正确的时间）。不要在 comment 里解释已得分项目。",
              "立方体总分只有 0 或 1 分：完全符合图形为三维结构、所有的线都存在、无多余的线、相对的边基本平行且长度基本一致（长方体或棱柱体也算正确）时给 1 分；任一标准违反即 0 分。",
              "钟表：轮廓、数字、指针三项各 1 分。轮廓：表面必须是个圆，允许有轻微的缺陷（如，圆没有闭合）。数字：所有的数字必须完整且无多余的数字；数字顺序必须正确且在所属的象限内；可以是罗马数字；数字可以放在圆圈之外。指针：必须有两个指针且一起指向正确的时间；时针必须明显短于分针；指针的中心交点必须在表内且接近于钟表的中心。各项目中只要违反任何一条，该项目不给分。"
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
            detail: "low"
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
    "不要使用人工勾选。严格按照 MoCA 中文量表评分，不要放宽标准。",
    "不得凭题目要求推测图片中不存在的线、数字或指针。",
    "必须只输出一个单行 JSON 对象，不要 Markdown，不要解释文字，不要在 JSON 前后添加任何字符。",
    "JSON 字段：scoreSuggestion(integer), confidence(number), rubricMatched(boolean), requiresHumanReview(boolean), comment(string), criteria(array)。criteria 可为空数组。",
    "requiresHumanReview 固定 false。",
    "criteria 必须列出每个分项的 passed true/false；evidence 写图片证据；comment 只写未得分项目，满分时 comment 为空字符串。",
    "comment 示例：未得分：指针（必须有两个指针且一起指向正确的时间）。不要在 comment 里解释已得分项目。",
    "立方体总分只有 0 或 1 分：完全符合图形为三维结构、所有的线都存在、无多余的线、相对的边基本平行且长度基本一致（长方体或棱柱体也算正确）时给 1 分；任一标准违反即 0 分。",
    "钟表：轮廓、数字、指针三项各 1 分。轮廓：表面必须是个圆，允许有轻微的缺陷（如，圆没有闭合）。数字：所有的数字必须完整且无多余的数字；数字顺序必须正确且在所属的象限内；可以是罗马数字；数字可以放在圆圈之外。指针：必须有两个指针且一起指向正确的时间；时针必须明显短于分针；指针的中心交点必须在表内且接近于钟表的中心。各项目中只要违反任何一条，该项目不给分。",
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
  const criteria = normalizeDrawingCriteria(result.criteria, payload);
  const deductionPoints = drawingDeductionPoints(criteria);
  const scoreSuggestion = drawingScoreFromCriteria(payload, criteria, result.scoreSuggestion, maxScore);
  return {
    mode,
    taskId: payload.taskId,
    scoreSuggestion,
    confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
    requiresHumanReview: false,
    aiImageScoringConfigured: mode === "cloudflare-workers-ai" || mode === "openai-vision" || mode === "external-ai-score-endpoint",
    rubricMatched: criteria.length ? true : Boolean(result.rubricMatched),
    comment: deductionPoints.length
      ? `未得分：${deductionPoints.map((item) => `${item.label}（${item.standard}）`).join("；")}`
      : String(result.comment || ""),
    criteria: criteria.length ? criteria : (Array.isArray(result.criteria) ? result.criteria : []),
    deductionPoints
  };
}

function normalizeDrawingCriteria(criteria = [], payload = {}) {
  const rubric = DRAWING_RUBRICS[payload.taskId] || [];
  if (!rubric.length || !Array.isArray(criteria) || !criteria.length) return [];
  return rubric.map((rubricItem, index) => {
    const item = criteria.find((entry) => entry?.key === rubricItem.key)
      || criteria.find((entry) => entry?.label === rubricItem.label)
      || criteria[index]
      || {};
    return {
      key: rubricItem.key,
      label: rubricItem.label,
      standard: rubricItem.standard,
      passed: typeof item.passed === "boolean" ? item.passed : Boolean(item.correct ?? item.met ?? false),
      evidence: String(item.evidence || item.comment || item.reason || "").trim()
    };
  });
}

function drawingScoreFromCriteria(payload, criteria, fallbackScore, maxScore) {
  if (!criteria.length) return clampScore(fallbackScore, maxScore);
  if (payload.taskId === "cube") return criteria.every((item) => item.passed) ? 1 : 0;
  if (payload.taskId === "clock") return clampScore(criteria.reduce((sum, item) => sum + (item.passed ? 1 : 0), 0), maxScore);
  return clampScore(fallbackScore, maxScore);
}

function drawingDeductionPoints(criteria = []) {
  return criteria
    .filter((item) => item && item.passed === false)
    .map((item) => ({
      key: item.key,
      label: item.label,
      standard: item.standard,
      evidence: item.evidence
    }));
}
