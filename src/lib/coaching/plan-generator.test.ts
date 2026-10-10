import { describe, expect, it } from "vitest";
import type { CoachingPolicy } from "./policy";
import { generateDailyPlan } from "./plan-generator";
import type { ProgressSnapshot } from "./progression";
import type { CoachingExercise, CoachingSubject } from "./types";

/**
 * A deliberately tiny, made-up domain. If the engine only works for the
 * domain it was extracted from, these tests are where that shows up.
 */
interface Step extends CoachingExercise {
  level: "beginner" | "advanced";
}

interface Learner extends CoachingSubject {
  level: "beginner" | "advanced";
  minutes: number;
}

function step(id: string, overrides: Partial<Step> = {}): Step {
  return {
    id,
    learningObjectiveId: `skill-${id}`,
    category: `cat-${id}`,
    difficulty: 1,
    estimatedMinutes: 2,
    prerequisiteIds: [],
    level: "beginner",
    ...overrides,
  };
}

const policy: CoachingPolicy<Step, Learner> = {
  isEligible: (exercise, learner) =>
    learner.level === "advanced" || exercise.level === "beginner",
  dailyBudget: (learner) => ({ maxMinutes: learner.minutes, itemCount: 3 }),
  starterExercises: (eligible) => eligible.filter((e) => e.id === "a"),
  affinityScore: () => 0,
  explain: ({ role, preferredEasier, preferredHarder, isStarter }) =>
    [role, preferredEasier && "easier", preferredHarder && "harder", isStarter && "starter"]
      .filter(Boolean)
      .join(","),
};

const learner: Learner = { id: "l1", name: "Sam", level: "beginner", minutes: 10 };

const none: Record<string, ProgressSnapshot> = {};

function progress(state: ProgressSnapshot["state"], easyStreak = 0): ProgressSnapshot {
  return { state, easyStreak, recentOutcomes: [] };
}

describe("generateDailyPlan (domain-neutral)", () => {
  const exercises = [
    step("a"),
    step("b"),
    step("c"),
    step("d", { level: "advanced" }),
    step("needs-a", { prerequisiteIds: ["a"] }),
  ];

  it("uses the policy's starter list until the learner has any progress", () => {
    const plan = generateDailyPlan({
      subject: learner,
      policy,
      exercises,
      progressByObjective: none,
      recentSessions: [],
    });

    expect(plan.items.map((i) => i.exerciseId)).toEqual(["a"]);
    expect(plan.meta.reason).toBe("starter");
    expect(plan.items[0]?.whyToday).toContain("starter");
  });

  it("filters by the policy's eligibility rule", () => {
    const plan = generateDailyPlan({
      subject: { ...learner, level: "beginner" },
      policy: { ...policy, starterExercises: () => [] },
      exercises,
      progressByObjective: { "skill-a": progress("practising") },
      recentSessions: [],
    });

    expect(plan.items.map((i) => i.exerciseId)).not.toContain("d");
  });

  it("only offers an exercise once its prerequisites are in progress", () => {
    const locked = generateDailyPlan({
      subject: learner,
      policy,
      exercises,
      progressByObjective: { "skill-a": progress("not_introduced") },
      recentSessions: [],
    });
    expect(locked.items.map((i) => i.exerciseId)).not.toContain("needs-a");

    const unlocked = generateDailyPlan({
      subject: learner,
      policy: { ...policy, dailyBudget: () => ({ maxMinutes: 30, itemCount: 10 }) },
      exercises,
      progressByObjective: { "skill-a": progress("practising") },
      recentSessions: [],
    });
    expect(unlocked.items.map((i) => i.exerciseId)).toContain("needs-a");
  });

  it("respects the policy's time and item limits", () => {
    const plan = generateDailyPlan({
      subject: { ...learner, minutes: 4 },
      policy,
      exercises,
      progressByObjective: { "skill-a": progress("practising") },
      recentSessions: [],
    });

    expect(plan.meta.totalMinutes).toBeLessThanOrEqual(4);
  });

  it("builds a one-item short plan using the configured short-plan minutes", () => {
    const plan = generateDailyPlan({
      subject: learner,
      policy,
      exercises,
      progressByObjective: { "skill-a": progress("practising") },
      recentSessions: [],
      shortPlan: true,
    });

    expect(plan.items).toHaveLength(1);
    expect(plan.items[0]?.role).toBe("skill");
    expect(plan.meta.reason).toBe("short_on_time");
  });

  it("swaps in the easier variation when the skill needs easier", () => {
    const withVariation = [
      step("hard", { easierVariationId: "easy", difficulty: 3 }),
      step("easy", { learningObjectiveId: "skill-easy" }),
    ];

    const plan = generateDailyPlan({
      subject: learner,
      policy: { ...policy, starterExercises: () => [] },
      exercises: withVariation,
      progressByObjective: { "skill-hard": progress("needs_easier") },
      recentSessions: [],
    });

    expect(plan.items[0]?.exerciseId).toBe("easy");
    expect(plan.items[0]?.whyToday).toContain("easier");
  });

  it("swaps in the harder variation when the skill is ready to increase", () => {
    const withVariation = [
      step("base", { harderVariationId: "stretch" }),
      step("stretch", { learningObjectiveId: "skill-stretch", difficulty: 2 }),
    ];

    const plan = generateDailyPlan({
      subject: learner,
      policy: { ...policy, starterExercises: () => [] },
      exercises: withVariation,
      progressByObjective: { "skill-base": progress("ready_to_increase", 3) },
      recentSessions: [],
    });

    expect(plan.items.map((i) => i.exerciseId)).toContain("stretch");
  });

  it("always returns at least one item when anything is eligible", () => {
    const plan = generateDailyPlan({
      subject: { ...learner, minutes: 0 },
      policy,
      exercises,
      progressByObjective: { "skill-a": progress("practising") },
      recentSessions: [],
    });

    expect(plan.items.length).toBeGreaterThanOrEqual(1);
  });

  it("returns an empty plan when nothing is eligible", () => {
    const plan = generateDailyPlan({
      subject: learner,
      policy: { ...policy, isEligible: () => false },
      exercises,
      progressByObjective: none,
      recentSessions: [],
    });

    expect(plan.items).toEqual([]);
  });
});
