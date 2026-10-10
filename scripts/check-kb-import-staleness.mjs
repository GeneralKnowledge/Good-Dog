#!/usr/bin/env node
/**
 * Fail CI when vendored KB JSON is older than MAX_AGE_DAYS (default 45).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const importDir = join(root, "src/lib/domains/dog-training/content/kb-import");
const maxAgeDays = Number(process.env.KB_IMPORT_MAX_AGE_DAYS ?? "45");

const files = [
  "good-dog-domain.json",
  "good-dog-safety.json",
  "good-dog-guides.json",
  "good-dog-referrals.json",
  "good-dog-ask-patterns.json",
];

const now = Date.now();
let failed = false;

for (const file of files) {
  const path = join(importDir, file);
  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    console.error(`Missing or invalid ${file}`);
    failed = true;
    continue;
  }
  const generatedAt = json.generatedAt;
  if (!generatedAt) {
    console.error(`${file}: missing generatedAt`);
    failed = true;
    continue;
  }
  const ageMs = now - Date.parse(generatedAt);
  const ageDays = ageMs / (24 * 60 * 60 * 1000);
  if (ageDays > maxAgeDays) {
    console.error(
      `${file}: generatedAt ${generatedAt} is ${Math.floor(ageDays)} days old (max ${maxAgeDays})`,
    );
    failed = true;
  }
}

if (failed) {
  console.error(
    "Refresh kb-import via ./scripts/sync-kb-import.sh or node scripts/build-kb-companion-exports.mjs",
  );
  process.exit(1);
}

console.log(`KB import fresh (all ${files.length} files within ${maxAgeDays} days)`);
