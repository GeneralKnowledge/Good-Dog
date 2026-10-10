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
  contentVersion: number;
}

export interface DogSubject extends CoachingSubject {
  lifeStage: LifeStage;
  availableTime: AvailableTime;
  primaryReason: string;
  trainingExperience: TrainingExperience;
}
