import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";
import { localDateString } from "@/lib/dates";
import { db } from "@/lib/db";
import {
  dailyPlans,
  dogSkillProgress,
  dogs,
  exerciseVersions,
  trainingSessions,
  users,
} from "@/lib/db/schema";
import { generateDailyPlan } from "@/lib/domain/plan-generator";
import type { ProgressSnapshot } from "@/lib/domain/progression";
import type { PlanItem, SkillState } from "@/lib/types";

function exerciseVersionId(exerciseId: string, version: number) {
  return `${exerciseId}-v${version}`;
}

export async function getOwnedDog(dogId: string, ownerId: string) {
  return db
    .select()
    .from(dogs)
    .where(and(eq(dogs.id, dogId), eq(dogs.ownerId, ownerId)))
    .get();
}

export function loadProgressMap(dogId: string): Record<string, ProgressSnapshot> {
  const rows = db
    .select()
    .from(dogSkillProgress)
    .where(eq(dogSkillProgress.dogId, dogId))
    .all();

  const map: Record<string, ProgressSnapshot> = {};
  for (const row of rows) {
    map[row.learningObjectiveId] = {
      state: row.state as SkillState,
      easyStreak: row.easyStreak,
      recentOutcomes: JSON.parse(row.recentOutcomesJson) as ProgressSnapshot["recentOutcomes"],
    };
  }
  return map;
}

export function getOrCreateDailyPlan(options: {
  dogId: string;
  ownerId: string;
  shortPlan?: boolean;
  forceRegenerate?: boolean;
}) {
  const dog = db
    .select()
    .from(dogs)
    .where(and(eq(dogs.id, options.dogId), eq(dogs.ownerId, options.ownerId)))
    .get();

  if (!dog) {
    throw new Error("Dog not found");
  }

  const owner = db.select().from(users).where(eq(users.id, options.ownerId)).get();
  const timeZone = owner?.timezone ?? "Europe/London";
  const planDate = localDateString(new Date(), timeZone);

  if (!options.forceRegenerate) {
    const existing = db
      .select()
      .from(dailyPlans)
      .where(and(eq(dailyPlans.dogId, dog.id), eq(dailyPlans.planDate, planDate)))
      .get();

    if (existing && (!options.shortPlan || existing.isShortPlan)) {
      return existing;
    }

    // If short plan requested and a full plan exists, create short only when force or no completions
    if (existing && options.shortPlan && !existing.isShortPlan) {
      const items = JSON.parse(existing.itemsJson) as PlanItem[];
      const anyComplete = items.some((i) => i.completedSessionId);
      if (anyComplete) {
        return existing;
      }
      // Replace open full plan with short plan
      db.delete(dailyPlans).where(eq(dailyPlans.id, existing.id)).run();
    } else if (existing) {
      return existing;
    }
  } else {
    db.delete(dailyPlans)
      .where(and(eq(dailyPlans.dogId, dog.id), eq(dailyPlans.planDate, planDate)))
      .run();
  }

  const progressByObjective = loadProgressMap(dog.id);
  const recent = db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.dogId, dog.id))
    .orderBy(desc(trainingSessions.completedAt))
    .limit(30)
    .all();

  const recentSessions = recent
    .filter((s) => s.completedAt && s.outcome)
    .map((s) => {
      const exercise = EXERCISE_LIBRARY.find((e) => e.id === s.exerciseId);
      return {
        exerciseId: s.exerciseId,
        learningObjectiveId: exercise?.learningObjectiveId ?? "unknown",
        completedAt: s.completedAt!.getTime(),
        outcome: s.outcome as "easy" | "getting_there" | "too_difficult",
        welfareConcern: s.welfareConcern,
      };
    });

  const generated = generateDailyPlan({
    dog: {
      id: dog.id,
      name: dog.name,
      lifeStage: dog.lifeStage,
      availableTime: dog.availableTime,
      primaryReason: dog.primaryReason,
      trainingExperience: dog.trainingExperience,
    },
    exercises: EXERCISE_LIBRARY,
    progressByObjective,
    recentSessions,
    shortPlan: options.shortPlan,
  });

  const items: PlanItem[] = generated.items.map((item) => {
    const exercise = EXERCISE_LIBRARY.find((e) => e.id === item.exerciseId)!;
    const versionId = exerciseVersionId(exercise.id, exercise.contentVersion);
    const version = db
      .select()
      .from(exerciseVersions)
      .where(eq(exerciseVersions.id, versionId))
      .get();

    if (!version) {
      throw new Error(`Missing exercise version for ${exercise.id}`);
    }

    return {
      ...item,
      exerciseVersionId: version.id,
    };
  });

  const planId = nanoid();
  try {
    db.insert(dailyPlans)
      .values({
        id: planId,
        dogId: dog.id,
        planDate,
        itemsJson: JSON.stringify(items),
        isShortPlan: Boolean(options.shortPlan),
        completionState: "open",
        generationMetaJson: JSON.stringify(generated.meta),
      })
      .run();
  } catch (error) {
    // Concurrent create — return existing
    const existing = db
      .select()
      .from(dailyPlans)
      .where(and(eq(dailyPlans.dogId, dog.id), eq(dailyPlans.planDate, planDate)))
      .get();
    if (existing) return existing;
    throw error;
  }

  return db.select().from(dailyPlans).where(eq(dailyPlans.id, planId)).get()!;
}

export function markPlanItemComplete(options: {
  planId: string;
  planItemId: string;
  sessionId: string;
}) {
  const plan = db.select().from(dailyPlans).where(eq(dailyPlans.id, options.planId)).get();
  if (!plan) return null;

  const items = JSON.parse(plan.itemsJson) as PlanItem[];
  const updated = items.map((item) =>
    item.id === options.planItemId
      ? { ...item, completedSessionId: options.sessionId }
      : item,
  );

  const allDone = updated.every((item) => item.completedSessionId);
  db.update(dailyPlans)
    .set({
      itemsJson: JSON.stringify(updated),
      completionState: allDone ? "completed" : "open",
    })
    .where(eq(dailyPlans.id, plan.id))
    .run();

  return db.select().from(dailyPlans).where(eq(dailyPlans.id, plan.id)).get()!;
}
