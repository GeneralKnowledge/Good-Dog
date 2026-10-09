import { describe, expect, it } from "vitest";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";
import {
  GLOSSARY,
  LEARN_ASK_ONLY_TERM_IDS,
  collectLinkedTermIds,
  extractTermIdsFromText,
  findUntaughtPublishedTerms,
  getGlossaryTerm,
  getPublishedGlossary,
  searchGlossary,
  validateGlossaryIntegrity,
} from "@/lib/content/glossary";
import {
  answerFromGlossary,
  preferApprovedGlossaryOverAi,
} from "@/lib/content/terminology-answers";

const exerciseIds = new Set(EXERCISE_LIBRARY.map((e) => e.id));

describe("glossary integrity", () => {
  it("has stable unique ids, published flags, and valid related terms", () => {
    const errors = validateGlossaryIntegrity(exerciseIds);
    expect(errors).toEqual([]);
  });

  it("publishes core reward-based and welfare terms with examples", () => {
    const required = [
      "positive-reinforcement",
      "reinforcer",
      "reward",
      "marker-word",
      "event-marker",
      "timing",
      "luring",
      "shaping",
      "threshold",
      "enrichment",
      "generalisation",
      "desensitisation",
      "counterconditioning",
      "management",
      "arousal",
      "housetraining",
      "down",
      "mouthing",
    ];
    for (const id of required) {
      const term = getGlossaryTerm(id);
      expect(term, id).toBeTruthy();
      expect(term!.published).toBe(true);
      expect(term!.shortDefinition.length).toBeGreaterThan(20);
      expect(term!.example.length).toBeGreaterThan(30);
      expect(term!.contentVersion).toBeGreaterThanOrEqual(1);
    }
  });

  it("distinguishes reward vs reinforcer and marker vs reward", () => {
    const reward = getGlossaryTerm("reward")!;
    const reinforcer = getGlossaryTerm("reinforcer")!;
    const marker = getGlossaryTerm("marker-word")!;
    expect(reward.commonMisunderstanding ?? reinforcer.commonMisunderstanding).toBeTruthy();
    expect(reinforcer.shortDefinition.toLowerCase()).toMatch(/more likely|effect/);
    expect(marker.shortDefinition.toLowerCase()).toMatch(/moment|signal|mark/);
    expect(marker.commonMisunderstanding?.toLowerCase() ?? "").toMatch(
      /not a cue|comments on what just happened/,
    );
    expect(marker.deeperExplanation.toLowerCase()).toMatch(/then deliver the reward/);
  });

  it("does not equate positive with good in positive reinforcement", () => {
    const term = getGlossaryTerm("positive-reinforcement")!;
    expect(term.deeperExplanation.toLowerCase()).toMatch(/added|addition/);
    expect(term.commonMisunderstanding?.toLowerCase()).toMatch(/not.*good|adding/);
  });

  it("keeps desensitisation and counterconditioning distinct", () => {
    const desense = getGlossaryTerm("desensitisation")!;
    const cc = getGlossaryTerm("counterconditioning")!;
    expect(desense.shortDefinition.toLowerCase()).not.toEqual(
      cc.shortDefinition.toLowerCase(),
    );
    expect(desense.relatedTermIds).toContain("counterconditioning");
    expect(cc.relatedTermIds).toContain("desensitisation");
    expect(desense.needsQualifiedReview || cc.needsQualifiedReview).toBe(true);
  });
});

describe("glossary search", () => {
  it("finds technical terms by preferred name", () => {
    const hits = searchGlossary("marker word");
    expect(hits[0]?.id).toBe("marker-word");
  });

  it("finds marker word via everyday description", () => {
    const hits = searchGlossary(
      "the word I say when my dog does something right",
    );
    expect(hits.map((h) => h.id)).toContain("marker-word");
  });

  it("finds positive reinforcement and threshold by common phrasing", () => {
    expect(searchGlossary("treats for good behaviour")[0]?.id).toBe(
      "positive-reinforcement",
    );
    expect(searchGlossary("too overwhelmed to listen").some((t) => t.id === "threshold")).toBe(
      true,
    );
  });

  it("supports spelling variants for generalisation", () => {
    const ids = searchGlossary("generalization").map((t) => t.id);
    expect(ids).toContain("generalisation");
  });
});

describe("exercise term links", () => {
  it("only links published glossary terms", () => {
    for (const exercise of EXERCISE_LIBRARY) {
      const texts = [
        exercise.purpose,
        exercise.preparation,
        ...exercise.steps,
        exercise.lookFor,
        exercise.ifDifficult,
        exercise.hint,
        exercise.safetyNote ?? "",
      ];
      const linked = collectLinkedTermIds(texts);
      for (const id of linked) {
        expect(getGlossaryTerm(id), `${exercise.id} → ${id}`).toBeTruthy();
      }
      for (const id of exercise.glossaryTermIds ?? []) {
        expect(getGlossaryTerm(id), `${exercise.id} meta ${id}`).toBeTruthy();
      }
    }
  });

  it("introduces marker-word in the reward marker exercise", () => {
    const exercise = EXERCISE_LIBRARY.find((e) => e.id === "ex-reward-marker")!;
    const blob = [exercise.purpose, ...exercise.steps].join(" ");
    expect(extractTermIdsFromText(blob)).toContain("marker-word");
    expect(exercise.glossaryTermIds).toContain("marker-word");
    expect(exercise.contentVersion).toBeGreaterThanOrEqual(2);
  });

  it("keeps exercises on content version 2+ with glossary metadata", () => {
    const withTerms = EXERCISE_LIBRARY.filter(
      (e) => (e.glossaryTermIds?.length ?? 0) > 0,
    );
    expect(withTerms.length).toBe(EXERCISE_LIBRARY.length);
    expect(getPublishedGlossary().length).toBeGreaterThanOrEqual(30);
    expect(GLOSSARY.every((t) => t.id.match(/^[a-z0-9-]+$/))).toBe(true);
  });

  it("teaches every published term in an exercise or on the Learn/Ask-only allowlist", () => {
    const linked = new Set<string>();
    for (const exercise of EXERCISE_LIBRARY) {
      const texts = [
        exercise.purpose,
        exercise.preparation,
        ...exercise.steps,
        exercise.lookFor,
        exercise.ifDifficult,
        exercise.hint,
        exercise.safetyNote ?? "",
      ];
      for (const id of collectLinkedTermIds(texts)) linked.add(id);
    }
    expect(findUntaughtPublishedTerms(linked)).toEqual([]);
    expect(LEARN_ASK_ONLY_TERM_IDS.has("negative-reinforcement")).toBe(true);
    expect(linked.has("marker-signal")).toBe(true);
    expect(linked.has("training-vs-management")).toBe(true);
    expect(linked.has("stay")).toBe(true);
    expect(linked.has("drop-swap")).toBe(true);
    expect(linked.has("behaviour-chain")).toBe(true);
    expect(linked.has("reinforcement-schedule")).toBe(true);
  });
});

describe("Ask terminology grounding", () => {
  it("answers why-say-yes with the marker word glossary entry", () => {
    const result = answerFromGlossary(
      "Why do I say yes before giving the treat?",
      "Pip",
    );
    expect(result?.term.id).toBe("marker-word");
    expect(result?.answer.toLowerCase()).toContain("marker");
    expect(result?.answer).toContain("Pip");
  });

  it("answers what-is-positive-reinforcement from glossary", () => {
    const result = answerFromGlossary(
      "What does positive reinforcement mean?",
      "Pip",
    );
    expect(result?.term.id).toBe("positive-reinforcement");
    expect(result?.answer.toLowerCase()).toMatch(/added|more likely/);
  });

  it("returns null for unrelated practical questions", () => {
    expect(answerFromGlossary("What if we miss a day?", "Pip")).toBeNull();
  });

  it("prefers approved glossary text when AI invents a conflicting definition", () => {
    const result = preferApprovedGlossaryOverAi(
      "What is a marker word?",
      "Pip",
      "A marker word means you are telling the dog off for being naughty.",
    );
    expect(result?.term.id).toBe("marker-word");
    expect(result?.answer.toLowerCase()).not.toMatch(/telling the dog off/);
    expect(result?.answer.toLowerCase()).toMatch(/mark|moment|reward/);
  });

  it("answers negative reinforcement as literacy without equating negative with bad", () => {
    const result = answerFromGlossary(
      "What does negative reinforcement mean?",
      "Pip",
    );
    expect(result?.term.id).toBe("negative-reinforcement");
    expect(result?.answer.toLowerCase()).toMatch(/remov/);
    expect(result?.answer.toLowerCase()).toMatch(/not .*bad|means removal/);
  });
});
