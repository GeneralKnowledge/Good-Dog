import { describe, expect, it } from "vitest";
import { pickPlanItemReplacement } from "@/lib/coaching/plan-generator";
import { WELFARE_CALM_EXERCISE_IDS } from "@/lib/coaching/welfare";
import {
  EXERCISE_LIBRARY,
  dogTrainingPolicy,
  exercisesWithRecallPromotionGate,
} from "@/lib/domains/dog-training";
import { toDogSubject } from "@/lib/services/dogs";

const defaultDog = toDogSubject({
  id: "d1",
  ownerId: "o1",
  name: "Pip",
  lifeStage: "adult",
  primaryReason: "Everyday manners",
  availableTime: "about_10",
  trainingExperience: "new",
  breedOrMix: null,
  householdContext: null,
  alreadyEasy: null,
  knownTriggers: null,
  preferredRewards: null,
  onboardingComplete: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("pickPlanItemReplacement", () => {
  it("picks a different exercise not already on the plan", () => {
    const onPlan = EXERCISE_LIBRARY.slice(0, 2).map((e) => e.id);
    const pick = pickPlanItemReplacement({
      subject: defaultDog,
      exercises: exercisesWithRecallPromotionGate(EXERCISE_LIBRARY, {}, []),
      policy: dogTrainingPolicy,
      progressByObjective: {},
      recentSessions: [],
      excludeExerciseIds: onPlan,
      replaceExerciseId: onPlan[0]!,
      itemRole: "skill",
    });

    expect(pick).not.toBeNull();
    expect(pick!.exerciseId).not.toBe(onPlan[0]);
    expect(onPlan).not.toContain(pick!.exerciseId);
  });

  it("prefers calm exercises after a recent welfare concern", () => {
    const recall = EXERCISE_LIBRARY.find((e) => e.category === "recall" && e.lifeStages.includes("adult"));
    expect(recall).toBeTruthy();

    const now = Date.now();
    const pick = pickPlanItemReplacement({
      subject: defaultDog,
      exercises: exercisesWithRecallPromotionGate(EXERCISE_LIBRARY, {}, []),
      policy: dogTrainingPolicy,
      progressByObjective: {},
      recentSessions: [
        {
          exerciseId: recall!.id,
          learningObjectiveId: recall!.learningObjectiveId,
          completedAt: now - 60_000,
          outcome: "too_difficult",
          welfareConcern: true,
        },
      ],
      excludeExerciseIds: [recall!.id],
      replaceExerciseId: recall!.id,
      itemRole: "skill",
      now,
    });

    expect(pick).not.toBeNull();
    expect(WELFARE_CALM_EXERCISE_IDS as readonly string[]).toContain(pick!.exerciseId);
  });
});
