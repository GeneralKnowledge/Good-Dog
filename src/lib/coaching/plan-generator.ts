import { nanoid } from "nanoid";
import type { CoachingPolicy } from "./policy";
import {
  shouldPreferEasierVariation,
  shouldPreferHarderVariation,
  type ProgressSnapshot,
} from "./progression";
import {
  objectiveInWelfareCooldown,
  WELFARE_CALM_EXERCISE_IDS,
} from "./welfare";
import {
  DEFAULT_PROGRESSION_CONFIG,
  type CoachingExercise,
  type CoachingSubject,
  type PlanItem,
  type PlanItemRole,
  type ProgressionConfig,
  type SessionOutcome,
  type SkillState,
} from "./types";

export interface RecentSessionSummary {
  exerciseId: string;
  learningObjectiveId: string;
  completedAt: number;
  outcome: SessionOutcome;
  welfareConcern: boolean;
}

export interface GeneratePlanInput<
  E extends CoachingExercise,
  S extends CoachingSubject,
> {
  subject: S;
  exercises: E[];
  policy: CoachingPolicy<E, S>;
  progressByObjective: Record<string, ProgressSnapshot>;
  recentSessions: RecentSessionSummary[];
  shortPlan?: boolean;
  config?: ProgressionConfig;
  now?: number;
}

export interface GeneratedPlan {
  items: PlanItem[];
  meta: {
    shortPlan: boolean;
    totalMinutes: number;
    reason: string;
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function prerequisitesMet<E extends CoachingExercise>(
  exercise: E,
  progressByObjective: Record<string, ProgressSnapshot>,
  exercisesById: Map<string, E>,
): boolean {
  return exercise.prerequisiteIds.every((preId) => {
    const pre = exercisesById.get(preId);
    if (!pre) return false;
    const progress = progressByObjective[pre.learningObjectiveId];
    if (!progress) return false;
    return (
      progress.state === "practising" ||
      progress.state === "becoming_consistent" ||
      progress.state === "ready_to_increase" ||
      progress.state === "introduced"
    );
  });
}

function recentlyPractised(
  exerciseId: string,
  recentSessions: RecentSessionSummary[],
  now: number,
  avoidWithinDays: number,
): boolean {
  const windowMs = avoidWithinDays * DAY_MS;
  return recentSessions.some(
    (s) => s.exerciseId === exerciseId && now - s.completedAt < windowMs,
  );
}

function resolveVariation<E extends CoachingExercise>(
  exercise: E,
  progress: ProgressSnapshot | undefined,
  exercisesById: Map<string, E>,
): { exercise: E; preferredEasier: boolean; preferredHarder: boolean } {
  if (!progress) {
    return { exercise, preferredEasier: false, preferredHarder: false };
  }

  if (shouldPreferEasierVariation(progress) && exercise.easierVariationId) {
    const easier = exercisesById.get(exercise.easierVariationId);
    if (easier) {
      return { exercise: easier, preferredEasier: true, preferredHarder: false };
    }
  }

  if (shouldPreferHarderVariation(progress) && exercise.harderVariationId) {
    const harder = exercisesById.get(exercise.harderVariationId);
    if (harder) {
      return { exercise: harder, preferredEasier: false, preferredHarder: true };
    }
  }

  return { exercise, preferredEasier: false, preferredHarder: false };
}

function scoreExercise<E extends CoachingExercise, S extends CoachingSubject>(
  exercise: E,
  subject: S,
  policy: CoachingPolicy<E, S>,
  progress: ProgressSnapshot | undefined,
  recentSessions: RecentSessionSummary[],
  now: number,
  config: ProgressionConfig,
): number {
  let score = 10 - exercise.difficulty;

  score += policy.affinityScore(exercise, subject);

  if (progress?.state === "practising") score += 3;
  if (progress?.state === "becoming_consistent") score += 2;
  if (progress?.state === "ready_to_increase") score += 2;
  if (!progress || progress.state === "not_introduced") {
    if (exercise.prerequisiteIds.length === 0) score += 2;
  }

  if (
    recentlyPractised(
      exercise.id,
      recentSessions,
      now,
      config.avoidRepeatWithinDays,
    )
  ) {
    score -= 8;
  }

  // Mild variety preference: less-used learning objectives
  const objectiveCount = recentSessions.filter(
    (s) => s.learningObjectiveId === exercise.learningObjectiveId,
  ).length;
  score -= objectiveCount;

  return score;
}

function pickRole(index: number, shortPlan: boolean): PlanItemRole {
  if (shortPlan) return "skill";
  if (index === 0) return "engage";
  if (index === 1) return "skill";
  return "everyday";
}

export function generateDailyPlan<
  E extends CoachingExercise,
  S extends CoachingSubject,
>(input: GeneratePlanInput<E, S>): GeneratedPlan {
  const { subject, policy } = input;
  const config = input.config ?? DEFAULT_PROGRESSION_CONFIG;
  const now = input.now ?? Date.now();
  const shortPlan = Boolean(input.shortPlan);
  const budget = shortPlan
    ? { maxMinutes: config.shortPlanMinutes, itemCount: 1 }
    : policy.dailyBudget(subject);
  const exercisesById = new Map(input.exercises.map((e) => [e.id, e]));

  const eligible = input.exercises.filter((exercise) => {
    if (!policy.isEligible(exercise, subject)) return false;
    if (!prerequisitesMet(exercise, input.progressByObjective, exercisesById)) {
      return false;
    }
    if (
      objectiveInWelfareCooldown(
        exercise.learningObjectiveId,
        input.recentSessions,
        now,
        config,
      )
    ) {
      return false;
    }
    return true;
  });

  const anyWelfareCooldown = input.recentSessions.some(
    (s) =>
      s.welfareConcern &&
      now - s.completedAt < config.welfareCooldownDays * DAY_MS,
  );

  const hasAnyProgress = Object.values(input.progressByObjective).some(
    (p) => p.state !== "not_introduced",
  );

  let candidates = eligible;
  if (anyWelfareCooldown && eligible.length > 0) {
    const calm = eligible.filter((e) =>
      (WELFARE_CALM_EXERCISE_IDS as readonly string[]).includes(e.id),
    );
    if (calm.length > 0) candidates = calm;
  }
  if (!hasAnyProgress) {
    const starters = policy.starterExercises(eligible, subject);
    if (starters.length > 0) candidates = starters;
  }

  const scored = candidates
    .map((exercise) => {
      const baseProgress =
        input.progressByObjective[exercise.learningObjectiveId];
      const resolved = resolveVariation(exercise, baseProgress, exercisesById);
      const progress =
        input.progressByObjective[resolved.exercise.learningObjectiveId];
      let score = scoreExercise(
        resolved.exercise,
        subject,
        policy,
        progress,
        input.recentSessions,
        now,
        config,
      );
      if (
        baseProgress?.state === "needs_easier" &&
        !exercise.easierVariationId &&
        resolved.exercise.id === exercise.id
      ) {
        score -= 25;
      }
      return {
        ...resolved,
        progress,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  const selected: typeof scored = [];
  const usedObjectives = new Set<string>();
  const usedCategories = new Set<string>();
  let minutes = 0;

  for (const candidate of scored) {
    if (selected.length >= budget.itemCount) break;
    if (
      minutes + candidate.exercise.estimatedMinutes > budget.maxMinutes &&
      selected.length > 0
    ) {
      continue;
    }
    if (usedObjectives.has(candidate.exercise.learningObjectiveId) && !shortPlan) {
      continue;
    }
    // Encourage variety across categories when possible
    if (
      selected.length > 0 &&
      usedCategories.has(candidate.exercise.category) &&
      scored.some(
        (s) =>
          !usedCategories.has(s.exercise.category) &&
          !usedObjectives.has(s.exercise.learningObjectiveId) &&
          !selected.includes(s),
      )
    ) {
      continue;
    }

    selected.push(candidate);
    usedObjectives.add(candidate.exercise.learningObjectiveId);
    usedCategories.add(candidate.exercise.category);
    minutes += candidate.exercise.estimatedMinutes;
  }

  // Guarantee at least one item
  if (selected.length === 0 && scored.length > 0) {
    selected.push(scored[0]!);
    minutes = scored[0]!.exercise.estimatedMinutes;
  }

  const items: PlanItem[] = selected.map((item, index) => {
    const role = pickRole(index, shortPlan);
    return {
      id: nanoid(),
      exerciseId: item.exercise.id,
      exerciseVersionId: "", // filled by persistence layer
      role,
      whyToday: policy.explain({
        subjectName: subject.name,
        role,
        skillState: item.progress?.state as SkillState | undefined,
        preferredEasier: item.preferredEasier,
        preferredHarder: item.preferredHarder,
        isStarter: !hasAnyProgress,
      }),
    };
  });

  return {
    items,
    meta: {
      shortPlan,
      totalMinutes: minutes,
      reason: shortPlan
        ? "short_on_time"
        : hasAnyProgress
          ? "adaptive"
          : "starter",
    },
  };
}
