import { json, missingDatabase, notFound } from "../../_lib/http.js";
import { fullSessionFromRows } from "../../_lib/sessions.js";

export async function onRequestGet({ env, params }) {
  if (!env.DB) return missingDatabase();

  const sessionResult = await env.DB.prepare("SELECT * FROM sessions WHERE id = ?")
    .bind(params.id)
    .all();
  const sessionRow = sessionResult.results?.[0];
  if (!sessionRow) return notFound();

  const itemResult = await env.DB.prepare("SELECT * FROM item_responses WHERE session_id = ? ORDER BY rowid")
    .bind(params.id)
    .all();

  return json(fullSessionFromRows(sessionRow, itemResult.results || []));
}
