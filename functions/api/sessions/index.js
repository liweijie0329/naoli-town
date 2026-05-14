import { json, missingDatabase, readJson } from "../../_lib/http.js";
import {
  itemRowParams,
  normalizeSessionPayload,
  sessionRowParams,
  slimSessionFromRow
} from "../../_lib/sessions.js";

const upsertSessionSql = `
  INSERT INTO sessions (
    id, participant_name, birth_year, participant_age, gender, education_level, participant_json,
    started_at, finished_at, saved_at, total_duration_ms, raw_score,
    education_bonus, total_score, risk_band, domain_scores_json, payload_json
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    participant_name = excluded.participant_name,
    birth_year = excluded.birth_year,
    participant_age = excluded.participant_age,
    gender = excluded.gender,
    education_level = excluded.education_level,
    participant_json = excluded.participant_json,
    started_at = excluded.started_at,
    finished_at = excluded.finished_at,
    saved_at = excluded.saved_at,
    total_duration_ms = excluded.total_duration_ms,
    raw_score = excluded.raw_score,
    education_bonus = excluded.education_bonus,
    total_score = excluded.total_score,
    risk_band = excluded.risk_band,
    domain_scores_json = excluded.domain_scores_json,
    payload_json = excluded.payload_json
`;

const insertItemSql = `
  INSERT INTO item_responses (
    id, session_id, task_id, domain, title, modality, max_score, score,
    started_at, ended_at, duration_ms, answer_json, behavior_json,
    ai_json, drawing_image, has_drawing
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

async function ensureSessionColumns(db) {
  const { results } = await db.prepare("PRAGMA table_info(sessions)").all();
  const columns = new Set((results || []).map((column) => column.name));
  if (!columns.has("participant_age")) {
    try {
      await db.prepare("ALTER TABLE sessions ADD COLUMN participant_age INTEGER").run();
    } catch (error) {
      if (!/duplicate column|already exists/i.test(error?.message || "")) throw error;
    }
  }
}

export async function onRequestGet({ env }) {
  if (!env.DB) return missingDatabase();

  const { results } = await env.DB.prepare(`
    SELECT
      s.id,
      s.participant_json,
      s.participant_age,
      s.started_at,
      s.finished_at,
      s.saved_at,
      s.total_duration_ms,
      s.raw_score,
      s.education_bonus,
      s.total_score,
      s.risk_band,
      COUNT(i.id) AS item_count
    FROM sessions s
    LEFT JOIN item_responses i ON i.session_id = s.id
    GROUP BY s.id
    ORDER BY s.saved_at DESC
    LIMIT 500
  `).all();

  return json(results.map(slimSessionFromRow));
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return missingDatabase();

  await ensureSessionColumns(env.DB);
  const payload = await readJson(request);
  const session = normalizeSessionPayload(payload);
  const statements = [
    env.DB.prepare(upsertSessionSql).bind(...sessionRowParams(session)),
    env.DB.prepare("DELETE FROM item_responses WHERE session_id = ?").bind(session.id),
    ...session.itemResponses.map((item) => (
      env.DB.prepare(insertItemSql).bind(...itemRowParams(session.id, item))
    ))
  ];

  await env.DB.batch(statements);

  const { results } = await env.DB.prepare("SELECT * FROM sessions WHERE id = ?")
    .bind(session.id)
    .all();
  return json(slimSessionFromRow({
    ...results[0],
    item_count: session.itemResponses.length
  }));
}
