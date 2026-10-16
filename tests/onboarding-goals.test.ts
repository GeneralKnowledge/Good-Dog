import { describe, expect, it } from "vitest";
import { ONBOARDING_GOALS } from "@/lib/onboarding/goals";
import { dogTrainingPolicy } from "@/lib/domains/dog-training/policy";
import type { DogSubject } from "@/lib/domains/dog-training/types";

const baseDog: DogSubject = {
  id: "d",
  name: "Moss",
  lifeStage: "adult",
  availableTime: "about_10",
  trainingExperience: "new",
  primaryReason: "",
};

describe("onboarding goals", () => {
  it("maps each goal to a primaryReason the plan policy can score", () => {
    const exercises = [
      { id: "ex-recall", category: "recall", difficulty: 1, lifeStages: ["adult"] },
      { id: "ex-walk", category: "walking", difficulty: 1, lifeStages: ["adult"] },
    ] as Parameters<typeof dogTrainingPolicy.affinityScore>[0][];

    for (const goal of ONBOARDING_GOALS) {
      const dog = { ...baseDog, primaryReason: goal.primaryReason };
      const scores = exercises.map((ex) => dogTrainingPolicy.affinityScore(ex, dog));
      expect(scores.some((s) => s > 0), goal.id).toBe(true);
    }
  });
});
