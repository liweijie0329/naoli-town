import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appFile = join(root, "app.js");
const ttsFile = join(root, "data", "tts-texts.json");
const checkOnly = process.argv.includes("--check");

const appSource = await readFile(appFile, "utf8");
const ttsSourceText = await readFile(ttsFile, "utf8");
const ttsSource = JSON.parse(ttsSourceText);
const entries = Array.isArray(ttsSource.entries) ? ttsSource.entries : [];
const changes = [];

syncMemoryWords();
syncVigilanceDigits();
syncDigitBanks();
syncDigitPad();
syncSerialSubtractionPrompts();

const nextText = `${JSON.stringify(ttsSource, null, 2)}\n`;

if (checkOnly) {
  if (nextText !== ttsSourceText) {
    console.error(`TTS text list is out of sync. pendingChanges=${changes.length}`);
    process.exitCode = 1;
  } else {
    console.log("TTS text list is in sync with app.js.");
  }
} else {
  if (nextText !== ttsSourceText) {
    await writeFile(ttsFile, nextText, "utf8");
  }
  console.log(`TTS text sync done. changes=${changes.length}`);
  if (changes.length) {
    changes.slice(0, 24).forEach((change) => console.log(`- ${change}`));
    if (changes.length > 24) console.log(`- ... ${changes.length - 24} more`);
  }
}

function syncMemoryWords() {
  const words = extractStringArrayConstant("MEMORY_WORD_BANK");
  words.forEach((word, index) => {
    upsertEntry(`word:memory:${String(index + 1).padStart(2, "0")}`, {
      text: word,
      speedRatio: 0.82
    });
  });
}

function syncVigilanceDigits() {
  const digits = extractSplitStringConstant("VIGILANCE_DIGITS");
  digits.forEach((digit, index) => {
    upsertEntry(`stimulus:vigilance:digit:${index}`, {
      text: digit,
      speedRatio: 0.78
    });
  });
}

function syncDigitBanks() {
  const forward = extractStringArrayConstant("DIGIT_FORWARD_BANK");
  forward.forEach((stimulus, index) => {
    upsertEntry(`stimulus:digitForward:bank:${String(index + 1).padStart(2, "0")}`, {
      text: digitSequenceText(stimulus),
      speedRatio: 0.78
    });
  });

  const backward = extractStringArrayConstant("DIGIT_BACKWARD_BANK");
  backward.forEach((stimulus, index) => {
    upsertEntry(`stimulus:digitBackward:bank:${String(index + 1).padStart(2, "0")}`, {
      text: digitSequenceText(stimulus),
      speedRatio: 0.78
    });
  });
}

function syncDigitPad() {
  extractStringArrayConstant("DIGIT_PAD").forEach((digit) => {
    upsertEntry(`digit:${digit}`, {
      text: digit,
      speedRatio: 0.78
    });
  });
}

function syncSerialSubtractionPrompts() {
  for (let subtractBy = 1; subtractBy <= 9; subtractBy += 1) {
    for (let step = 0; step < 5; step += 1) {
      upsertEntry(`instruction:serialSubtraction:${subtractBy}:${step}`, {
        text: step === 0 ? `100 减 ${subtractBy} 等于多少？` : `再减 ${subtractBy}，等于多少？`
      });
    }
  }
}

function upsertEntry(key, values) {
  const entry = entries.find((item) => item.key === key);
  if (!entry) {
    entries.push({ key, ...values });
    changes.push(`${key} added`);
    return;
  }

  for (const [field, value] of Object.entries(values)) {
    if (entry[field] === value) continue;
    changes.push(`${key} ${field}: ${JSON.stringify(entry[field])} -> ${JSON.stringify(value)}`);
    entry[field] = value;
  }
}

function digitSequenceText(value) {
  return String(value).split("").join(" ");
}

function extractSplitStringConstant(name) {
  const pattern = new RegExp(`const\\s+${name}\\s*=\\s*"([^"]*)"\\.split\\(""\\);`);
  const match = appSource.match(pattern);
  if (!match) throw new Error(`无法在 app.js 中找到 ${name}。`);
  return match[1].split("");
}

function extractStringArrayConstant(name) {
  const pattern = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*(?:\\.map\\([\\s\\S]*?\\))?;`);
  const match = appSource.match(pattern);
  if (!match) throw new Error(`无法在 app.js 中找到 ${name}。`);
  const values = [];
  const stringPattern = /"((?:\\.|[^"\\])*)"/g;
  let valueMatch;
  while ((valueMatch = stringPattern.exec(match[1]))) {
    values.push(JSON.parse(`"${valueMatch[1]}"`));
  }
  if (!values.length) throw new Error(`${name} 没有可同步的字符串。`);
  return values;
}
