import { json } from "../_lib/http.js";

export function onRequestGet({ env }) {
  return json({
    ok: true,
    service: "cognition-hearing-game",
    database: Boolean(env.DB),
    storageMode: env.DB ? "cloudflare-d1" : "unbound",
    now: new Date().toISOString()
  });
}
