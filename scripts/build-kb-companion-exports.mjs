#!/usr/bin/env node
/**
 * FALLBACK ONLY when DogResearch dist/ does not publish companion JSON.
 * Native good-dog-guides.json from DogResearch includes full ownerBodyMarkdown;
 * do not overwrite those files.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const importDir = join(root, "src/lib/domains/dog-training/content/kb-import");

function hasNativeGuides() {
  const path = join(importDir, "good-dog-guides.json");
  if (!existsSync(path)) return false;
  try {
    const bundle = JSON.parse(readFileSync(path, "utf8"));
    const first = bundle.guides?.[0];
    return Boolean(first?.ownerBodyMarkdown?.includes("## What to try"));
  } catch {
    return false;
  }
}

if (hasNativeGuides()) {
  console.log("Native good-dog-guides.json present — skipping companion fallback.");
  process.exit(0);
}

const domain = JSON.parse(
  readFileSync(join(importDir, "good-dog-domain.json"), "utf8"),
);
const safety = JSON.parse(
  readFileSync(join(importDir, "good-dog-safety.json"), "utf8"),
);

const generatedAt = domain.generatedAt ?? new Date().toISOString();

function bodyFromSummary(title, summary) {
  return `## ${title}\n\n${summary}\n\nThis guide summarises approved management and education content from the Good Dog knowledge base. For personalised behaviour treatment, contact your vet and a qualified reward-based professional.`;
}

function keywordsForLesson(lessonId) {
  const map = {
    "lesson-puppy-socialisation": ["puppy", "socialise", "socialization", "vaccination"],
    "lesson-steal-chase": ["steal", "chase", "run away", "grab"],
    "lesson-fireworks-management": ["fireworks", "noise", "thunder", "fear"],
    "lesson-reactive-management": ["reactive", "bark", "lunge", "walk"],
    "lesson-rescue-settling": ["rescue", "adopt", "settle", "new home"],
    "lesson-adolescent-regression": ["teenage", "adolescent", "regress"],
    "lesson-read-your-dog-stress": ["stress", "worried", "yawn", "lip lick"],
  };
  return map[lessonId] ?? [];
}

const guides = [
  ...(domain.managementModules ?? []).map((m) => ({
    lessonId: m.lessonId,
    title: m.title,
    summary: m.summary,
    advisory: Boolean(m.advisory),
    advisoryMessage: m.advisoryMessage ?? null,
    protocolId: m.protocolId,
    ownerBodyMarkdown: bodyFromSummary(m.title, m.summary),
    provenance: {
      protocolId: m.protocolId,
      claimIds: [],
      sourceIds: [],
      reviewStatus: "paraphrase_ok_export",
      lastVerified: generatedAt.slice(0, 10),
    },
    suggestedAskKeywords: keywordsForLesson(m.lessonId),
  })),
  ...(domain.educationOnly ?? []).map((m) => ({
    lessonId: m.lessonId,
    title: m.title,
    summary: m.summary,
    advisory: false,
    advisoryMessage: null,
    protocolId: m.protocolId,
    ownerBodyMarkdown: bodyFromSummary(m.title, m.summary),
    provenance: {
      protocolId: m.protocolId,
      claimIds: [],
      sourceIds: [],
      reviewStatus: "paraphrase_ok_export",
      lastVerified: generatedAt.slice(0, 10),
    },
    suggestedAskKeywords: keywordsForLesson(m.lessonId),
  })),
];

const guidesPath = join(importDir, "good-dog-guides.json");
if (!existsSync(guidesPath)) {
  writeFileSync(
    guidesPath,
    `${JSON.stringify({ schemaVersion: "1.0.0", generatedAt, guides }, null, 2)}\n`,
  );
}

const referralsPath = join(importDir, "good-dog-referrals.json");
if (!existsSync(referralsPath)) {
  writeFileSync(
    referralsPath,
    `${JSON.stringify(
      {
        schemaVersion: "1.0.0",
        generatedAt,
        ethicsDisclaimer:
          "Good Dog offers general reward-based training education. It is not veterinary care, clinical behaviour treatment, or a substitute for hands-on professional assessment.",
        referrals: [
          {
            id: "ref-vet-first",
            title: "Contact your vet first",
            body: "Sudden behaviour change, pain, illness, or loss of appetite needs a medical check before training plans change.",
            url: "https://www.rspca.org.uk/adviceandwelfare/pets/dogs/health",
            rationaleClaimIds: ["claim-imdt-003-referral"],
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
}

const askPath = join(importDir, "good-dog-ask-patterns.json");
if (!existsSync(askPath)) {
  writeFileSync(
    askPath,
    `${JSON.stringify(
      {
        schemaVersion: "1.0.0",
        generatedAt,
        violatesNoAversivePatterns: safety.violatesNoAversivePatterns,
        escalateQuestionPatterns: [],
        ownerQuestionCrosswalk: [],
      },
      null,
      2,
    )}\n`,
  );
}

console.log(`Companion fallback wrote missing files under ${importDir}`);
