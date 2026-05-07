export function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function notFound() {
  return json({ error: "Not found" }, 404);
}

export function methodNotAllowed() {
  return json({ error: "Method not allowed" }, 405);
}

export function missingDatabase() {
  return json({
    error: "D1 database is not bound",
    message: "请在 Cloudflare Pages 项目 Settings > Functions > D1 database bindings 中添加变量名 DB。"
  }, 500);
}

export async function readJson(request) {
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}
