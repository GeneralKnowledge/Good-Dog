import { describe, expect, it } from "vitest";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";
import { generateDailyPlan } from "./plan-generator";
import type { ProgressSnapshot } from "./progression";

const dog = {
  id: "dog-1",
  name: "Moss",
  lifeStage: "adult" as const,
  availableTime: "about_10" as const,
  primaryReason: "Everyday manners",
  trainingExperience: "new" as const,
};

describe("generateDailyPlan", () => {
  it("gives a new dog an appropriate starter plan", () => {
    const plan = generateDailyPlan({
      dog,
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {},
      recentSessions: [],
    });

    expect(plan.items.length).toBeGreaterThan(0);
    expect(plan.items.length).toBeLessThanOrEqual(3);
    expect(plan.meta.reason).toBe("starter");

    for (const item of plan.items) {
      const exercise = EXERCISE_LIBRARY.find((e) => e.id === item.exerciseId)!;
      expect(exercise.difficulty).toBeLessThanOrEqual(1);
      expect(exercise.lifeStages).toContain("adult");
    }
  });

  it("respects prerequisites", () => {
    const progress: Record<string, ProgressSnapshot> = {
      engagement: { state: "not_introduced", easyStreak: 0, recentOutcomes: [] },
    };

    const plan = generateDailyPlan({
      dog,
      exercises: EXERCISE_LIBRARY,
      progressByObjective: progress,
      recentSessions: [],
    });

    const ids = plan.items.map((i) => i.exerciseId);
    expect(ids).not.toContain("ex-sit-comfort");
    expect(ids).not.toContain("ex-wait-brief");
  });

  it("respects available training time", () => {
    const plan = generateDailyPlan({
      dog: { ...dog, availableTime: "few_minutes" },
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {},
      recentSessions: [],
    });

    expect(plan.meta.totalMinutes).toBeLessThanOrEqual(5);
    expect(plan.items.length).toBeLessThanOrEqual(2);
  });

  it("creates a one-activity short plan", () => {
    const plan = generateDailyPlan({
      dog,
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {},
      recentSessions: [],
      shortPlan: true,
    });

    expect(plan.items).toHaveLength(1);
    expect(plan.meta.shortPlan).toBe(true);
  });

  it("avoids unnecessary repetition when alternatives exist", () => {
    const now = Date.now();
    const recentExercise = "ex-name-response";
    const plan = generateDailyPlan({
      dog,
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {
        "name-response": {
          state: "practising",
          easyStreak: 1,
          recentOutcomes: [],
        },
      },
      recentSessions: [
        {
          exerciseId: recentExercise,
          learningObjectiveId: "name-response",
          completedAt: now - 60_000,
          outcome: "easy",
          welfareConcern: false,
        },
      ],
      now,
    });

    // Should prefer other starters/alternatives when possible
    const onlyRepeated =
      plan.items.length === 1 && plan.items[0]?.exerciseId === recentExercise;
    expect(onlyRepeated).toBe(false);
  });

  it("boosts toilet routine when the owner asks about housetraining", () => {
    const plan = generateDailyPlan({
      dog: {
        ...dog,
        lifeStage: "young_puppy",
        primaryReason: "Toilet training accidents",
      },
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {},
      recentSessions: [],
    });

    expect(plan.items.some((item) => item.exerciseId === "ex-toilet-routine")).toBe(
      true,
    );
  });

  it("boosts mouthing redirect for puppy nipping goals", () => {
    const plan = generateDailyPlan({
      dog: {
        ...dog,
        lifeStage: "young_puppy",
        primaryReason: "Puppy mouthing and nipping hands",
      },
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {},
      recentSessions: [],
    });

    expect(plan.items.some((item) => item.exerciseId === "ex-puppy-mouthing")).toBe(
      true,
    );
  });

  it("selects easier variation when progress needs_easier", () => {
    const plan = generateDailyPlan({
      dog,
      exercises: EXERCISE_LIBRARY,
      progressByObjective: {
        recall: {
          state: "needs_easier",
          easyStreak: 0,
          recentOutcomes: [],
        },
        "name-response": {
          state: "practising",
          easyStreak: 1,
          recentOutcomes: [],
        },
      },
      recentSessions: [],
    });

    const recallish = plan.items.find((item) => {
      const ex = EXERCISE_LIBRARY.find((e) => e.id === item.exerciseId);
      return ex?.learningObjectiveId === "recall" || ex?.id === "ex-name-response";
    });

    // If a recall-related item appears while needs_easier, easier path should be preferred
    if (recallish) {
      expect(["ex-name-response", "ex-recall-foundation"]).toContain(recallish.exerciseId);
    }
  });
});
