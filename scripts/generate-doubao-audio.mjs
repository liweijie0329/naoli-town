import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { base64ChunksToUint8Array, synthesizeDoubaoSpeech } from "../functions/_lib/doubao-tts.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceFile = join(root, "data", "tts-texts.json");
const audioDir = join(root, "assets", "audio");
const manifestFile = join(audioDir, "manifest.json");

const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const manifestOnly = args.includes("--manifest-only");
const changedOnly = args.includes("--changed-only");
const verbose = args.includes("--verbose");
const continueOnError = args.includes("--continue-on-error");
const timeoutMs = numberArg("--timeout-ms", Number(process.env.DOUBAO_TTS_TIMEOUT_MS) || 60000);
const keyPrefix = argValue("--key-prefix");
const partialRun = manifestOnly || changedOnly || Boolean(keyPrefix);

const source = JSON.parse(await readFile(sourceFile, "utf8"));
const entries = Array.isArray(source.entries) ? source.entries : [];
const existingManifest = await readJsonIfExists(manifestFile);

if (!entries.length) {
  throw new Error("data/tts-texts.json 没有可生成的 entries。");
}

await mkdir(audioDir, { recursive: true });

const manifest = {
  version: source.version || 1,
  generatedAt: new Date().toISOString(),
  provider: "doubao",
  source: "data/tts-texts.json",
  entries: partialRun ? { ...(existingManifest?.entries || {}) } : {}
};

let generatedCount = 0;
let skippedCount = 0;
let changedTextCount = 0;
let missingFileCount = 0;
let manifestOnlyCount = 0;
let failedCount = 0;

for (const entry of entries) {
  validateEntry(entry);

  const format = String(entry.format || source.defaultFormat || "mp3").toLowerCase();
  const filename = entry.file || `${safeFilename(entry.key)}.${format}`;
  const outputFile = join(audioDir, filename);
  const src = `assets/audio/${filename}`;
  const previous = existingManifest?.entries?.[entry.key] || null;
  const fileExists = await exists(outputFile);

  const manifestEntry = {
    src,
    text: entry.text,
    profile: entry.profile || source.defaultProfile || "gentle",
    speedRatio: entry.speedRatio || 1
  };

  if (entry.pitchRatio && entry.pitchRatio !== 1) manifestEntry.pitchRatio = entry.pitchRatio;
  if (entry.volumeRatio && entry.volumeRatio !== 1) manifestEntry.volumeRatio = entry.volumeRatio;

  const reasons = generationReasons({ force, fileExists, previous, manifestEntry });
  const selectedByPrefix = !keyPrefix || entry.key.startsWith(keyPrefix);
  const selectedByChange = !changedOnly || reasons.some((reason) => reason.includes("changed"));
  const shouldGenerate = selectedByPrefix && selectedByChange && reasons.length > 0;

  if (!fileExists) missingFileCount += 1;
  if (previous?.text !== undefined && previous.text !== entry.text) changedTextCount += 1;

  if (!shouldGenerate) {
    if (previous && !selectedByPrefix) {
      manifest.entries[entry.key] = previous;
    } else if (fileExists || previous) {
      manifest.entries[entry.key] = mergeExistingAudioMetadata(manifestEntry, previous, format);
    }
    skippedCount += 1;
    if (verbose) console.log(`skip ${entry.key} -> ${src}`);
    continue;
  }

  if (manifestOnly) {
    if (fileExists) {
      manifestOnlyCount += 1;
      manifest.entries[entry.key] = mergeExistingAudioMetadata(manifestEntry, previous, format);
      console.log(`manifest-only ${entry.key} -> ${src} (${reasons.join(", ")})`);
    } else {
      console.log(`skip ${entry.key} -> ${src} (${reasons.join(", ")}, file missing)`);
    }
    continue;
  }

  if (dryRun) {
    console.log(`dry-run generate ${entry.key} -> ${src} (${reasons.join(", ")})`);
    continue;
  }

  console.log(`generate ${entry.key} -> ${src} (${reasons.join(", ")})`);
  let result;
  try {
    result = await synthesizeWithTimeout({
      text: entry.text,
      profile: manifestEntry.profile,
      speedRatio: manifestEntry.speedRatio,
      pitchRatio: entry.pitchRatio || 1,
      volumeRatio: entry.volumeRatio || 1,
      format
    });
  } catch (error) {
    failedCount += 1;
    console.error(`failed ${entry.key}: ${formatError(error)}`);
    if (!continueOnError) throw error;
    continue;
  }

  const bytes = base64ChunksToUint8Array(result.audioBase64Chunks);
  await writeFile(outputFile, Buffer.from(bytes));
  generatedCount += 1;

  manifest.entries[entry.key] = {
    ...manifestEntry,
    src,
    provider: result.provider,
    voiceType: result.voiceType,
    format: result.format
  };
}

if (!dryRun) {
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

console.log(`Audio generation done. generated=${generatedCount}, skipped=${skippedCount}, failed=${failedCount}, missingFiles=${missingFileCount}, changedText=${changedTextCount}, manifestOnly=${manifestOnlyCount}, total=${entries.length}`);
if (dryRun) console.log("Dry run only. No audio files or manifest were written.");
if (failedCount) process.exitCode = 1;

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

function generationReasons({ force, fileExists, previous, manifestEntry }) {
  if (force) return ["force"];
  const reasons = [];
  if (!fileExists) reasons.push("missing file");
  if (previous?.text !== undefined && previous.text !== manifestEntry.text) reasons.push("text changed");
  if (previous?.profile !== undefined && previous.profile !== manifestEntry.profile) reasons.push("profile changed");
  if (previous?.speedRatio !== undefined && !sameNumber(previous.speedRatio, manifestEntry.speedRatio)) reasons.push("speed changed");
  if (previous?.pitchRatio !== undefined && !sameNumber(previous.pitchRatio, manifestEntry.pitchRatio || 1)) reasons.push("pitch changed");
  if (previous?.volumeRatio !== undefined && !sameNumber(previous.volumeRatio, manifestEntry.volumeRatio || 1)) reasons.push("volume changed");
  return reasons;
}

function mergeExistingAudioMetadata(entry, previous, format) {
  const merged = { ...entry };
  if (previous?.provider) merged.provider = previous.provider;
  if (previous?.voiceType) merged.voiceType = previous.voiceType;
  if (previous?.format) merged.format = previous.format;
  if (!merged.format) merged.format = format;
  return merged;
}

function sameNumber(left, right) {
  return Number(left) === Number(right);
}

function argValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] || "" : "";
}

function numberArg(name, fallback) {
  const value = Number(argValue(name));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

async function synthesizeWithTimeout(input) {
  if (!timeoutMs) return synthesizeDoubaoSpeech(input, process.env);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await synthesizeDoubaoSpeech({ ...input, signal: controller.signal }, process.env);
  } finally {
    clearTimeout(timer);
  }
}

function formatError(error) {
  if (error?.name === "AbortError") return `请求超过 ${timeoutMs}ms 未返回，已中止`;
  const upstream = error?.details?.upstream;
  const upstreamText = upstream ? ` upstream=${typeof upstream === "string" ? upstream : JSON.stringify(upstream)}` : "";
  return `${error?.message || error}${upstreamText}`;
}

async function readJsonIfExists(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
