import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { base64ChunksToUint8Array, synthesizeDoubaoSpeech } from "../functions/_lib/doubao-tts.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceFile = join(root, "data", "tts-texts.json");
const audioDir = join(root, "assets", "audio");
const manifestFile = join(audioDir, "manifest.json");

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

const source = JSON.parse(await readFile(sourceFile, "utf8"));
const entries = Array.isArray(source.entries) ? source.entries : [];

if (!entries.length) {
  throw new Error("data/tts-texts.json 没有可生成的 entries。");
}

await mkdir(audioDir, { recursive: true });

const manifest = {
  version: source.version || 1,
  generatedAt: new Date().toISOString(),
  provider: "doubao",
  source: "data/tts-texts.json",
  entries: {}
};

let generatedCount = 0;
let skippedCount = 0;

for (const entry of entries) {
  validateEntry(entry);

  const format = String(entry.format || source.defaultFormat || "mp3").toLowerCase();
  const filename = entry.file || `${safeFilename(entry.key)}.${format}`;
  const outputFile = join(audioDir, filename);
  const src = `assets/audio/${filename}`;

  manifest.entries[entry.key] = {
    src,
    text: entry.text,
    profile: entry.profile || source.defaultProfile || "gentle",
    speedRatio: entry.speedRatio || 1
  };

  if (!force && await exists(outputFile)) {
    skippedCount += 1;
    console.log(`skip ${entry.key} -> ${src}`);
    continue;
  }

  if (dryRun) {
    console.log(`dry-run ${entry.key} -> ${src}`);
    continue;
  }

  console.log(`generate ${entry.key} -> ${src}`);
  const result = await synthesizeDoubaoSpeech({
    text: entry.text,
    profile: entry.profile || source.defaultProfile || "gentle",
    speedRatio: entry.speedRatio || 1,
    pitchRatio: entry.pitchRatio || 1,
    volumeRatio: entry.volumeRatio || 1,
    format
  }, process.env);

  const bytes = base64ChunksToUint8Array(result.audioBase64Chunks);
  await writeFile(outputFile, Buffer.from(bytes));
  generatedCount += 1;

  manifest.entries[entry.key] = {
    ...manifest.entries[entry.key],
    src,
    provider: result.provider,
    voiceType: result.voiceType,
    format: result.format
  };
}

if (!dryRun) {
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

console.log(`Audio generation done. generated=${generatedCount}, skipped=${skippedCount}, total=${entries.length}`);

function validateEntry(entry) {
  if (!entry || typeof entry !== "object") throw new Error("音频条目必须是对象。");
  if (!entry.key || typeof entry.key !== "string") throw new Error("音频条目缺少 key。");
  if (!entry.text || typeof entry.text !== "string") throw new Error(`${entry.key} 缺少 text。`);
}

function safeFilename(value) {
  return String(value)
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
