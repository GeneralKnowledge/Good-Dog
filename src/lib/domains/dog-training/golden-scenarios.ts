import { LEARNING_OBJECTIVES } from "./content/learning-objectives";

export const GOLDEN_NOW = Date.UTC(2026, 0, 15, 9, 0, 0);

export interface GoldenScenario {
  key: string;
  dog: {
    id: string;
    name: string;
    lifeStage: "young_puppy" | "older_puppy" | "adolescent" | "adult" | "senior";
    availableTime: "few_minutes" | "about_10" | "more";
    primaryReason: string;
    trainingExperience: "new" | "some";
  };
  progress: Record<
    string,
    { state: string; easyStreak: number; recentOutcomes: never[] }
  >;
  recent: Array<{
    exerciseId: string;
    learningObjectiveId: string;
    completedAt: number;
    outcome: "easy" | "getting_there" | "too_difficult";
    welfareConcern: boolean;
  }>;
  shortPlan: boolean;
}

const LIFE_STAGES = ["young_puppy", "older_puppy", "adolescent", "adult", "senior"] as const;
const TIMES = ["few_minutes", "about_10", "more"] as const;
const REASONS = [
  "",
  "Recall help",
  "Loose lead walking",
  "Settle at home",
  "Everyday manners",
  "New puppy basics",
];
const EXPERIENCE = ["new", "some"] as const;
const STATES = [
  "not_introduced",
  "introduced",
  "practising",
  "becoming_consistent",
  "ready_to_increase",
  "needs_easier",
];

export function buildGoldenScenarios(): GoldenScenario[] {
  const scenarios: GoldenScenario[] = [];

  for (const lifeStage of LIFE_STAGES)
    for (const availableTime of TIMES)
      for (const primaryReason of REASONS)
        for (const trainingExperience of EXPERIENCE)
          for (const shortPlan of [false, true]) {
            scenarios.push({
              key: `empty|${lifeStage}|${availableTime}|${primaryReason}|${trainingExperience}|${shortPlan}`,
              dog: { id: "d", name: "Moss", lifeStage, availableTime, primaryReason, trainingExperience },
              progress: {},
              recent: [],
              shortPlan,
            });
          }

  for (let rotation = 0; rotation < STATES.length; rotation++) {
    const progress: GoldenScenario["progress"] = {};
    LEARNING_OBJECTIVES.forEach((objective, index) => {
      const state = STATES[(index + rotation) % STATES.length]!;
      progress[objective.id] = {
        state,
        easyStreak: state === "needs_easier" || state === "not_introduced" ? 0 : (index % 4) + 1,
        recentOutcomes: [],
      };
    });

    for (const lifeStage of LIFE_STAGES)
      for (const availableTime of TIMES)
        for (const primaryReason of ["", "Recall help", "Loose lead walking"])
          for (const withRecent of [false, true]) {
            const recent = withRecent
              ? LEARNING_OBJECTIVES.slice(0, 4).map((objective, i) => ({
                  exerciseId: `ex-${objective.id}`,
                  learningObjectiveId: objective.id,
                  completedAt: GOLDEN_NOW - (i + 1) * 3_600_000,
                  outcome: (["easy", "getting_there", "too_difficult", "easy"] as const)[i]!,
                  welfareConcern: false,
                }))
              : [];
            scenarios.push({
              key: `progress${rotation}|${lifeStage}|${availableTime}|${primaryReason}|recent=${withRecent}`,
              dog: { id: "d", name: "Moss", lifeStage, availableTime, primaryReason, trainingExperience: "some" },
              progress,
              recent,
              shortPlan: false,
            });
          }
  }
  return scenarios;
}
