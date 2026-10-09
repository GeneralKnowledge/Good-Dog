export type LifeStage =
  | "young_puppy"
  | "older_puppy"
  | "adolescent"
  | "adult"
  | "senior";

export type AvailableTime = "few_minutes" | "about_10" | "more";

export type TrainingExperience = "new" | "some";

export type SessionOutcome = "easy" | "getting_there" | "too_difficult";

export type SkillState =
  | "not_introduced"
  | "introduced"
  | "practising"
  | "becoming_consistent"
  | "ready_to_increase"
  | "needs_easier";

export type TopicGroup =
  | "everyday_foundations"
  | "puppy_life"
  | "walking_together"
  | "coming_back"
  | "calm_confidence"
  | "life_at_home";

export type PlanItemRole = "engage" | "skill" | "everyday";

export interface PlanItem {
  id: string;
  exerciseId: string;
  exerciseVersionId: string;
  role: PlanItemRole;
  whyToday: string;
  completedSessionId?: string;
}

export interface ExerciseContent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  learningObjectiveId: string;
  category: string;
  lifeStages: LifeStage[];
  difficulty: number;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  purpose: string;
  preparation: string;
  steps: string[];
  lookFor: string;
  ifDifficult: string;
  easierVariationId?: string;
  harderVariationId?: string;
  safetyNote?: string;
  hint: string;
  topicGroup: TopicGroup;
  /** Glossary terms introduced or reinforced by this exercise */
  glossaryTermIds?: string[];
  contentVersion: number;
}

export type TermExposureState = "introduced" | "explored";

export interface ProgressionConfig {
  easyResultsForIncrease: number;
  recentWindowSize: number;
  maxPlanMinutesFew: number;
  maxPlanMinutesAbout10: number;
  maxPlanMinutesMore: number;
  avoidRepeatWithinDays: number;
}

export const DEFAULT_PROGRESSION_CONFIG: ProgressionConfig = {
  easyResultsForIncrease: 3,
  recentWindowSize: 5,
  maxPlanMinutesFew: 5,
  maxPlanMinutesAbout10: 10,
  maxPlanMinutesMore: 15,
  avoidRepeatWithinDays: 1,
};
