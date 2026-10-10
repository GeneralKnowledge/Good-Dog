#!/usr/bin/env node
/**
 * Builds Good Dog companion KB exports from vendored domain + safety JSON.
 * DogResearch should produce the same shapes in dist/; this script keeps Good Dog
 * self-consistent when DogResearch is not checked out locally.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const importDir = join(root, "src/lib/domains/dog-training/content/kb-import");

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

const guides = [
  ...(domain.managementModules ?? []).map((m) => ({
    lessonId: m.lessonId,
    title: m.title,
    summary: m.summary,
    advisory: Boolean(m.advisory),
    advisoryMessage: m.advisoryMessage ?? null,
    protocolId: m.protocolId,
    kind: "management",
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
    kind: "education",
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

const guidesBundle = {
  schemaVersion: "1.0.0",
  generatedAt,
  guides,
};

const referralsBundle = {
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
    {
      id: "ref-abtc-find",
      title: "Find ABTC-registered help",
      body: "For ongoing aggression, severe fear, or clinical behaviour needs, use an ABTC-registered Clinical Animal Behaviourist or Veterinary Behaviourist.",
      url: "https://www.abtc.org.uk/",
      rationaleClaimIds: ["claim-imdt-003-referral", "claim-abtc-003-no-aversives"],
    },
    {
      id: "ref-imdt-ethics",
      title: "Reward-based training standards",
      body: "Choose trainers aligned with force-free, science-based methods — avoid pain, fear, and coercion as routine solutions.",
      url: "https://www.imdt.uk.com/",
      rationaleClaimIds: ["claim-imdt-001-force-free"],
    },
  ],
};

const escalateQuestionPatterns = [
  {
    id: "esc-bite-aggression",
    pattern: { source: "\\b(bite|biting|aggress|attack|blood|growl(?:s|ing)? at (?:me|child|children)|resource guard(?:ing)?)\\b", flags: "i" },
    safetyRuleIds: ["safe-004-scope-referral", "safe-007-no-punish-growling"],
    guideLessonIds: ["lesson-reactive-management"],
    helpArticleIds: ["help-aggression"],
  },
  {
    id: "esc-fear-pain",
    pattern: { source: "\\b(severe fear|panic|separation distress|in pain|limping|cannot eat|not eating|sudden(?:ly)? chang(?:e|ed))\\b", flags: "i" },
    safetyRuleIds: ["safe-004-scope-referral"],
    guideLessonIds: ["lesson-read-your-dog-stress", "lesson-fireworks-management"],
    helpArticleIds: ["help-pain", "help-worried"],
  },
];

const askPatternsBundle = {
  schemaVersion: "1.0.0",
  generatedAt,
  violatesNoAversivePatterns: safety.violatesNoAversivePatterns,
  escalateQuestionPatterns,
  ownerQuestionCrosswalk: [
    { helpArticleId: "help-aggression", guideLessonIds: ["lesson-reactive-management"] },
    { helpArticleId: "help-worried", guideLessonIds: ["lesson-read-your-dog-stress"] },
    { helpArticleId: "help-pain", guideLessonIds: ["lesson-read-your-dog-stress"] },
  ],
};

writeFileSync(
  join(importDir, "good-dog-guides.json"),
  `${JSON.stringify(guidesBundle, null, 2)}\n`,
);
writeFileSync(
  join(importDir, "good-dog-referrals.json"),
  `${JSON.stringify(referralsBundle, null, 2)}\n`,
);
writeFileSync(
  join(importDir, "good-dog-ask-patterns.json"),
  `${JSON.stringify(askPatternsBundle, null, 2)}\n`,
);

if (guides.length !== 7) {
  console.error(`Expected 7 guides, got ${guides.length}`);
  process.exit(1);
}

console.log(`Wrote companion KB exports (${guides.length} guides) to ${importDir}`);
