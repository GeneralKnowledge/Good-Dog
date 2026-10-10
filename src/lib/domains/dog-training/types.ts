import type { CoachingExercise, CoachingSubject } from "@/lib/coaching";

export type LifeStage =
  | "young_puppy"
  | "older_puppy"
  | "adolescent"
  | "adult"
  | "senior";

export type AvailableTime = "few_minutes" | "about_10" | "more";

export type TrainingExperience = "new" | "some";

export type TopicGroup =
  | "everyday_foundations"
  | "puppy_life"
  | "walking_together"
  | "coming_back"
  | "calm_confidence"
  | "life_at_home";

export type TermExposureState = "introduced" | "explored";

export interface ExerciseContent extends CoachingExercise {
  slug: string;
  title: string;
  summary: string;
  lifeStages: LifeStage[];
  purpose: string;
  preparation: string;
  steps: string[];
  lookFor: string;
  ifDifficult: string;
  safetyNote?: string;
  hint: string;
  topicGroup: TopicGroup;
  /** Glossary terms introduced or reinforced by this exercise */
  glossaryTermIds?: string[];
  /**
   * Optional quiet “why this works” teaching moment (plain English + one term).
   * Shown once per exercise guide; does not interrupt the steps.
   */
  whyThisWorks?: {
    plainWhy: string;
    termId: string;
  };
  contentVersion: number;
}

export interface DogSubject extends CoachingSubject {
  lifeStage: LifeStage;
  availableTime: AvailableTime;
  primaryReason: string;
  trainingExperience: TrainingExperience;
}
