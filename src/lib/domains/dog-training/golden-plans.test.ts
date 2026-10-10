import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateDailyPlan } from "@/lib/coaching";
import { EXERCISE_LIBRARY } from "./content/exercises";
import { GOLDEN_NOW, buildGoldenScenarios } from "./golden-scenarios";
import { dogTrainingPolicy } from "./policy";

/**
 * Characterisation test: a sample of recorded plans for varied dogs and
 * progress. A failure means plan behaviour changed. If the change is
 * intended, regenerate with `UPDATE_GOLDEN=1 npx vitest run golden-plans`
 * and review the fixture diff.
 */
const FIXTURE = path.join(__dirname, "golden-plans.fixture.json");
const SAMPLE_EVERY = 9;

function planFor(scenario: ReturnType<typeof buildGoldenScenarios>[number]) {
  const plan = generateDailyPlan({
    subject: scenario.dog,
    policy: dogTrainingPolicy,
    exercises: EXERCISE_LIBRARY,
    progressByObjective: scenario.progress as never,
    recentSessions: scenario.recent,
    shortPlan: scenario.shortPlan,
    now: GOLDEN_NOW,
  });

  return {
    items: plan.items.map((i) => `${i.exerciseId} | ${i.role} | ${i.whyToday}`),
    meta: plan.meta,
  };
}

describe("dog training plans (golden)", () => {
  const scenarios = buildGoldenScenarios().filter((_, i) => i % SAMPLE_EVERY === 0);

  if (process.env.UPDATE_GOLDEN) {
    it("regenerates the fixture", () => {
      const recorded = Object.fromEntries(scenarios.map((s) => [s.key, planFor(s)]));
      fs.writeFileSync(FIXTURE, `${JSON.stringify(recorded, null, 1)}\n`);
    });
    return;
  }

  const recorded = JSON.parse(fs.readFileSync(FIXTURE, "utf8")) as Record<
    string,
    ReturnType<typeof planFor>
  >;

  it("covers the recorded scenarios", () => {
    expect(Object.keys(recorded)).toEqual(scenarios.map((s) => s.key));
  });

  it.each(scenarios.map((s) => [s.key, s] as const))("%s", (_key, scenario) => {
    expect(planFor(scenario)).toEqual(recorded[scenario.key]);
  });
});
