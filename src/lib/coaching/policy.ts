import type {
  CoachingExercise,
  CoachingSubject,
  PlanItemRole,
  SkillState,
} from "./types";

export interface PlanBudget {
  maxMinutes: number;
  itemCount: number;
}

export interface WhyTodayInput {
  subjectName: string;
  role: PlanItemRole;
  skillState?: SkillState;
  preferredEasier?: boolean;
  preferredHarder?: boolean;
  isStarter?: boolean;
}

/**
 * Everything the plan generator needs to know about a specific domain.
 * A domain implements this once; the engine stays free of domain knowledge.
 */
export interface CoachingPolicy<
  E extends CoachingExercise = CoachingExercise,
  S extends CoachingSubject = CoachingSubject,
> {
  isEligible(exercise: E, subject: S): boolean;
  /** Time and item limits for a normal (not short) plan. */
  dailyBudget(subject: S): PlanBudget;
  /** Gentle first exercises, used until the subject has any progress. May return an empty list. */
  starterExercises(eligible: E[], subject: S): E[];
  /** Extra score for exercises that suit this subject's goals and experience. */
  affinityScore(exercise: E, subject: S): number;
  /** Plain-English reason shown to the user for choosing an exercise today. */
  explain(input: WhyTodayInput): string;
}
