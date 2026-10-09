import { nanoid } from "nanoid";
import {
  DEFAULT_PROGRESSION_CONFIG,
  type AvailableTime,
  type ExerciseContent,
  type LifeStage,
  type PlanItem,
  type PlanItemRole,
  type ProgressionConfig,
  type SkillState,
} from "@/lib/types";
import {
  shouldPreferEasierVariation,
  shouldPreferHarderVariation,
  type ProgressSnapshot,
} from "./progression";
import { buildWhyToday } from "./why-today";

export interface DogPlanInput {
  id: string;
  name: string;
  lifeStage: LifeStage;
  availableTime: AvailableTime;
  primaryReason: string;
  trainingExperience: "new" | "some";
}

export interface RecentSessionSummary {
  exerciseId: string;
  learningObjectiveId: string;
  completedAt: number;
  outcome: "easy" | "getting_there" | "too_difficult";
  welfareConcern: boolean;
}

export interface GeneratePlanInput {
  dog: DogPlanInput;
  exercises: ExerciseContent[];
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

function maxMinutes(
  availableTime: AvailableTime,
  shortPlan: boolean,
  config: ProgressionConfig,
): number {
  if (shortPlan) return 4;
  switch (availableTime) {
    case "few_minutes":
      return config.maxPlanMinutesFew;
    case "about_10":
      return config.maxPlanMinutesAbout10;
    case "more":
      return config.maxPlanMinutesMore;
  }
}

function isLifeStageSuitable(
  exercise: ExerciseContent,
  lifeStage: LifeStage,
): boolean {
  return exercise.lifeStages.includes(lifeStage);
}

function prerequisitesMet(
  exercise: ExerciseContent,
  progressByObjective: Record<string, ProgressSnapshot>,
  exercisesById: Map<string, ExerciseContent>,
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
  const windowMs = avoidWithinDays * 24 * 60 * 60 * 1000;
  return recentSessions.some(
    (s) => s.exerciseId === exerciseId && now - s.completedAt < windowMs,
  );
}

function resolveVariation(
  exercise: ExerciseContent,
  progress: ProgressSnapshot | undefined,
  exercisesById: Map<string, ExerciseContent>,
): { exercise: ExerciseContent; preferredEasier: boolean; preferredHarder: boolean } {
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

function scoreExercise(
  exercise: ExerciseContent,
  dog: DogPlanInput,
  progress: ProgressSnapshot | undefined,
  recentSessions: RecentSessionSummary[],
  now: number,
  config: ProgressionConfig,
): number {
  let score = 10 - exercise.difficulty;

  if (dog.trainingExperience === "new" && exercise.difficulty === 1) {
    score += 3;
  }

  const reason = dog.primaryReason.toLowerCase();
  if (reason.includes("recall") && exercise.category === "recall") score += 4;
  if (reason.includes("walk") && exercise.category === "walking") score += 4;
  if (reason.includes("settle") && exercise.category === "calm") score += 4;
  if (reason.includes("manners") && exercise.category === "manners") score += 3;
  if (reason.includes("puppy") && exercise.category === "puppy") score += 4;

  if (progress?.state === "needs_easier") score += 2;
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

function starterPool(exercises: ExerciseContent[], lifeStage: LifeStage) {
  const preferredIds = [
    "ex-engagement-easy",
    "ex-name-response",
    "ex-reward-marker",
    "ex-mat-settle",
    "ex-rest-spot",
    "ex-handling-touch",
    "ex-lead-intro",
  ];

  if (lifeStage === "young_puppy" || lifeStage === "older_puppy") {
    preferredIds.push("ex-puppy-sounds", "ex-puppy-surfaces");
  }

  return exercises.filter(
    (e) =>
      preferredIds.includes(e.id) &&
      e.difficulty <= 1 &&
      isLifeStageSuitable(e, lifeStage),
  );
}

export function generateDailyPlan(input: GeneratePlanInput): GeneratedPlan {
  const config = input.config ?? DEFAULT_PROGRESSION_CONFIG;
  const now = input.now ?? Date.now();
  const shortPlan = Boolean(input.shortPlan);
  const budget = maxMinutes(input.dog.availableTime, shortPlan, config);
  const exercisesById = new Map(input.exercises.map((e) => [e.id, e]));

  const eligible = input.exercises.filter((exercise) => {
    if (!isLifeStageSuitable(exercise, input.dog.lifeStage)) return false;
    if (!prerequisitesMet(exercise, input.progressByObjective, exercisesById)) {
      return false;
    }
    return true;
  });

  const hasAnyProgress = Object.values(input.progressByObjective).some(
    (p) => p.state !== "not_introduced",
  );

  let candidates = eligible;
  if (!hasAnyProgress) {
    const starters = starterPool(eligible, input.dog.lifeStage);
    if (starters.length > 0) candidates = starters;
  }

  const scored = candidates
    .map((exercise) => {
      const baseProgress =
        input.progressByObjective[exercise.learningObjectiveId];
      const resolved = resolveVariation(exercise, baseProgress, exercisesById);
      const progress =
        input.progressByObjective[resolved.exercise.learningObjectiveId];
      return {
        ...resolved,
        progress,
        score: scoreExercise(
          resolved.exercise,
          input.dog,
          progress,
          input.recentSessions,
          now,
          config,
        ),
      };
    })
    .sort((a, b) => b.score - a.score);

  const targetCount = shortPlan ? 1 : input.dog.availableTime === "few_minutes" ? 2 : 3;
  const selected: typeof scored = [];
  const usedObjectives = new Set<string>();
  const usedCategories = new Set<string>();
  let minutes = 0;

  for (const candidate of scored) {
    if (selected.length >= targetCount) break;
    if (minutes + candidate.exercise.estimatedMinutes > budget && selected.length > 0) {
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
      whyToday: buildWhyToday({
        dogName: input.dog.name,
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
