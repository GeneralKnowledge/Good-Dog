import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";
import { db } from "@/lib/db";
import {
  dogSkillProgress,
  dogs,
  exerciseVersions,
  trainingSessions,
} from "@/lib/db/schema";
import {
  applyOutcomeToProgress,
  type ProgressSnapshot,
} from "@/lib/domain/progression";
import type { SessionOutcome, SkillState } from "@/lib/types";
import { markPlanItemComplete } from "./plans";

export function submitSessionFeedback(options: {
  ownerId: string;
  dogId: string;
  exerciseId: string;
  exerciseVersionId: string;
  dailyPlanId?: string;
  planItemId?: string;
  outcome: SessionOutcome;
  welfareConcern: boolean;
  ownerNote?: string;
  clientMutationId: string;
}) {
  const dog = db
    .select()
    .from(dogs)
    .where(and(eq(dogs.id, options.dogId), eq(dogs.ownerId, options.ownerId)))
    .get();

  if (!dog) {
    throw new Error("Dog not found");
  }

  const existing = db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.clientMutationId, options.clientMutationId))
    .get();

  if (existing) {
    return existing;
  }

  const version = db
    .select()
    .from(exerciseVersions)
    .where(eq(exerciseVersions.id, options.exerciseVersionId))
    .get();

  if (!version) {
    throw new Error("Exercise version not found");
  }

  const exercise = EXERCISE_LIBRARY.find((e) => e.id === options.exerciseId);
  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const sessionId = nanoid();
  const now = new Date();

  db.insert(trainingSessions)
    .values({
      id: sessionId,
      dogId: dog.id,
      exerciseId: options.exerciseId,
      exerciseVersionId: options.exerciseVersionId,
      dailyPlanId: options.dailyPlanId ?? null,
      planItemId: options.planItemId ?? null,
      startedAt: now,
      completedAt: now,
      outcome: options.outcome,
      welfareConcern: options.welfareConcern,
      ownerNote: options.ownerNote?.trim() || null,
      clientMutationId: options.clientMutationId,
    })
    .run();

  // Update skill progress
  const existingProgress = db
    .select()
    .from(dogSkillProgress)
    .where(
      and(
        eq(dogSkillProgress.dogId, dog.id),
        eq(dogSkillProgress.learningObjectiveId, exercise.learningObjectiveId),
      ),
    )
    .get();

  const current: ProgressSnapshot = existingProgress
    ? {
        state: existingProgress.state as SkillState,
        easyStreak: existingProgress.easyStreak,
        recentOutcomes: JSON.parse(existingProgress.recentOutcomesJson),
      }
    : { state: "not_introduced", easyStreak: 0, recentOutcomes: [] };

  const next = applyOutcomeToProgress(
    current,
    options.outcome,
    options.welfareConcern,
  );

  if (existingProgress) {
    db.update(dogSkillProgress)
      .set({
        state: next.state,
        easyStreak: next.easyStreak,
        recentOutcomesJson: JSON.stringify(next.recentOutcomes),
        lastPractisedAt: now,
        updatedAt: now,
      })
      .where(eq(dogSkillProgress.id, existingProgress.id))
      .run();
  } else {
    db.insert(dogSkillProgress)
      .values({
        id: nanoid(),
        dogId: dog.id,
        learningObjectiveId: exercise.learningObjectiveId,
        state: next.state,
        easyStreak: next.easyStreak,
        recentOutcomesJson: JSON.stringify(next.recentOutcomes),
        lastPractisedAt: now,
        updatedAt: now,
      })
      .run();
  }

  if (options.dailyPlanId && options.planItemId) {
    markPlanItemComplete({
      planId: options.dailyPlanId,
      planItemId: options.planItemId,
      sessionId,
    });
  }

  return db.select().from(trainingSessions).where(eq(trainingSessions.id, sessionId)).get()!;
}
