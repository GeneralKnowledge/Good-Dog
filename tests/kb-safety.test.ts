import { describe, expect, it } from "vitest";
import {
  countRecentEasyRecallFoundation,
  exercisesWithRecallPromotionGate,
  getKbHeldExerciseIds,
  isOffLeadRecallPromotionUnlocked,
  sanitizeAskAnswer,
  violatesNoAversiveRule,
} from "@/lib/domains/dog-training/kb-safety";
import { EXERCISE_LIBRARY } from "@/lib/domains/dog-training";

describe("KB safety import", () => {
  it("vendors safety patterns from DogResearch export", () => {
    expect(violatesNoAversiveRule("Should I use a shock collar?")).toBe(true);
    expect(violatesNoAversiveRule("Reward calm behaviour generously")).toBe(false);
  });

  it("holds ex-lead-loose out of blind sync", () => {
    expect(getKbHeldExerciseIds().has("ex-lead-loose")).toBe(true);
  });

  it("blocks aversive Ask answers", () => {
    const out = sanitizeAskAnswer(
      "Try a prong collar for pulling.",
      "Moss",
      "How do I stop pulling?",
    );
    expect(out.toLowerCase()).toContain("reward-based");
    expect(out).not.toMatch(/prong/i);
  });

  it("prepends escalate referral for high-risk questions", () => {
    const out = sanitizeAskAnswer(
      "Keep sessions short.",
      "Moss",
      "My dog is biting children",
    );
    expect(out.toLowerCase()).toMatch(/vet|behaviourist|referral|professional/);
  });

  it("gates recall harder variation until recall progress is strong enough", () => {
    expect(
      isOffLeadRecallPromotionUnlocked(
        {
          recall: {
            state: "practising",
            easyStreak: 1,
            recentOutcomes: [],
          },
        },
        3,
      ),
    ).toBe(false);

    expect(
      isOffLeadRecallPromotionUnlocked(
        {
          recall: {
            state: "becoming_consistent",
            easyStreak: 2,
            recentOutcomes: [],
          },
        },
        3,
      ),
    ).toBe(true);

    const gated = exercisesWithRecallPromotionGate(
      EXERCISE_LIBRARY,
      {
        recall: {
          state: "introduced",
          easyStreak: 0,
          recentOutcomes: [],
        },
      },
      [],
    );
    const foundation = gated.find((e) => e.id === "ex-recall-foundation");
    expect(foundation?.harderVariationId).toBeUndefined();

    const unlocked = exercisesWithRecallPromotionGate(
      EXERCISE_LIBRARY,
      {
        recall: {
          state: "becoming_consistent",
          easyStreak: 2,
          recentOutcomes: [],
        },
      },
      [{ exerciseId: "ex-recall-foundation", outcome: "easy" }].concat(
        Array.from({ length: 2 }, () => ({
          exerciseId: "ex-recall-foundation",
          outcome: "easy" as const,
        })),
      ),
    );
    expect(unlocked.find((e) => e.id === "ex-recall-foundation")?.harderVariationId).toBe(
      "ex-recall-mild-distract",
    );
  });

  it("counts easy recall foundation sessions", () => {
    expect(
      countRecentEasyRecallFoundation([
        { exerciseId: "ex-recall-foundation", outcome: "easy" },
        { exerciseId: "ex-recall-foundation", outcome: "getting_there" },
        { exerciseId: "ex-name-response", outcome: "easy" },
      ]),
    ).toBe(1);
  });
});
