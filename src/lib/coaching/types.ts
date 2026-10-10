export type SessionOutcome = "easy" | "getting_there" | "too_difficult";

export type SkillState =
  | "not_introduced"
  | "introduced"
  | "practising"
  | "becoming_consistent"
  | "ready_to_increase"
  | "needs_easier";

export type PlanItemRole = "engage" | "skill" | "everyday";

export interface PlanItem {
  id: string;
  exerciseId: string;
  exerciseVersionId: string;
  role: PlanItemRole;
  whyToday: string;
  completedSessionId?: string;
}

/** The part of an exercise the engine needs. Domains extend it with their own fields. */
export interface CoachingExercise {
  id: string;
  learningObjectiveId: string;
  category: string;
  difficulty: number;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  easierVariationId?: string;
  harderVariationId?: string;
}

/** The part of a coached subject the engine needs. Domains extend it with their own profile. */
export interface CoachingSubject {
  id: string;
  name: string;
}

export interface ProgressionConfig {
  easyResultsForIncrease: number;
  recentWindowSize: number;
  avoidRepeatWithinDays: number;
  shortPlanMinutes: number;
  /** Days to avoid repeating an objective after owner reports discomfort. */
  welfareCooldownDays: number;
}

export const DEFAULT_PROGRESSION_CONFIG: ProgressionConfig = {
  easyResultsForIncrease: 3,
  recentWindowSize: 5,
  avoidRepeatWithinDays: 1,
  shortPlanMinutes: 4,
  welfareCooldownDays: 3,
};
