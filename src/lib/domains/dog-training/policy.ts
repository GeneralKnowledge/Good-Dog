import type {
  CoachingPolicy,
  PlanBudget,
} from "@/lib/coaching";
import type { AvailableTime, DogSubject, ExerciseContent, LifeStage } from "./types";
import { explainPlanItem } from "./why-today";

const PLAN_LIMITS: Record<AvailableTime, PlanBudget> = {
  few_minutes: { maxMinutes: 5, itemCount: 2 },
  about_10: { maxMinutes: 10, itemCount: 3 },
  more: { maxMinutes: 15, itemCount: 3 },
};

const STARTER_EXERCISE_IDS = [
  "ex-engagement-easy",
  "ex-name-response",
  "ex-reward-marker",
  "ex-mat-settle",
  "ex-rest-spot",
  "ex-handling-touch",
  "ex-lead-intro",
];

const PUPPY_STARTER_EXERCISE_IDS = ["ex-puppy-sounds", "ex-puppy-surfaces"];

function isPuppy(lifeStage: LifeStage) {
  return lifeStage === "young_puppy" || lifeStage === "older_puppy";
}

/**
 * Matches the free-text "what would you like help with" answer to exercise
 * categories. Free text is brittle; a closed set of goals would be sturdier.
 */
const GOAL_KEYWORDS: Array<{ keyword: string; category: string; boost: number }> = [
  { keyword: "recall", category: "recall", boost: 4 },
  { keyword: "walk", category: "walking", boost: 4 },
  { keyword: "settle", category: "calm", boost: 4 },
  { keyword: "manners", category: "manners", boost: 3 },
  { keyword: "puppy", category: "puppy", boost: 4 },
];

export const dogTrainingPolicy: CoachingPolicy<ExerciseContent, DogSubject> = {
  isEligible(exercise, dog) {
    return exercise.lifeStages.includes(dog.lifeStage);
  },

  dailyBudget(dog) {
    return PLAN_LIMITS[dog.availableTime];
  },

  starterExercises(eligible, dog) {
    const preferredIds = isPuppy(dog.lifeStage)
      ? [...STARTER_EXERCISE_IDS, ...PUPPY_STARTER_EXERCISE_IDS]
      : STARTER_EXERCISE_IDS;

    return eligible.filter(
      (exercise) =>
        preferredIds.includes(exercise.id) &&
        exercise.difficulty <= 1 &&
        exercise.lifeStages.includes(dog.lifeStage),
    );
  },

  affinityScore(exercise, dog) {
    let score = 0;

    if (dog.trainingExperience === "new" && exercise.difficulty === 1) {
      score += 3;
    }

    const reason = dog.primaryReason.toLowerCase();
    for (const goal of GOAL_KEYWORDS) {
      if (reason.includes(goal.keyword) && exercise.category === goal.category) {
        score += goal.boost;
      }
    }

    return score;
  },

  explain: explainPlanItem,
};
