import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { EXERCISE_LIBRARY } from "@/lib/domains/dog-training";
import * as schema from "./schema";

type AppDb = BetterSQLite3Database<typeof schema>;

/**
 * Upsert catalog exercises and ensure immutable version snapshots exist.
 * Safe to call on every boot — missing versions are the usual cause of
 * "Missing exercise version for …" during daily plan generation after deploys
 * that bump contentVersion without a manual db:seed.
 */
export function ensureExercises(db: AppDb): void {
  for (const exercise of EXERCISE_LIBRARY) {
    db.insert(schema.exercises)
      .values({
        id: exercise.id,
        slug: exercise.slug,
        title: exercise.title,
        summary: exercise.summary,
        learningObjectiveId: exercise.learningObjectiveId,
        category: exercise.category,
        lifeStages: exercise.lifeStages,
        difficulty: exercise.difficulty,
        estimatedMinutes: exercise.estimatedMinutes,
        prerequisiteIds: exercise.prerequisiteIds,
        purpose: exercise.purpose,
        preparation: exercise.preparation,
        steps: exercise.steps,
        lookFor: exercise.lookFor,
        ifDifficult: exercise.ifDifficult,
        easierVariationId: exercise.easierVariationId ?? null,
        harderVariationId: exercise.harderVariationId ?? null,
        safetyNote: exercise.safetyNote ?? null,
        hint: exercise.hint,
        topicGroup: exercise.topicGroup,
        published: true,
        contentVersion: exercise.contentVersion,
      })
      .onConflictDoUpdate({
        target: schema.exercises.id,
        set: {
          title: exercise.title,
          summary: exercise.summary,
          learningObjectiveId: exercise.learningObjectiveId,
          category: exercise.category,
          lifeStages: exercise.lifeStages,
          difficulty: exercise.difficulty,
          estimatedMinutes: exercise.estimatedMinutes,
          prerequisiteIds: exercise.prerequisiteIds,
          purpose: exercise.purpose,
          preparation: exercise.preparation,
          steps: exercise.steps,
          lookFor: exercise.lookFor,
          ifDifficult: exercise.ifDifficult,
          easierVariationId: exercise.easierVariationId ?? null,
          harderVariationId: exercise.harderVariationId ?? null,
          safetyNote: exercise.safetyNote ?? null,
          hint: exercise.hint,
          topicGroup: exercise.topicGroup,
          contentVersion: exercise.contentVersion,
          published: true,
          slug: exercise.slug,
        },
      })
      .run();

    const versionId = `${exercise.id}-v${exercise.contentVersion}`;
    const existing = db
      .select()
      .from(schema.exerciseVersions)
      .where(eq(schema.exerciseVersions.id, versionId))
      .get();

    if (!existing) {
      db.insert(schema.exerciseVersions)
        .values({
          id: versionId,
          exerciseId: exercise.id,
          version: exercise.contentVersion,
          snapshotJson: JSON.stringify(exercise),
        })
        .run();
    }
  }
}
