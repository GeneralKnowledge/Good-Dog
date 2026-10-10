import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { EXERCISE_LIBRARY } from "../src/lib/domains/dog-training/content/exercises";
import { ensureSchema } from "../src/lib/db/ensure-schema";
import * as schema from "../src/lib/db/schema";

const dbUrl = process.env.DATABASE_URL ?? "./data/good-dog.db";
const absolutePath = path.isAbsolute(dbUrl)
  ? dbUrl
  : path.join(process.cwd(), "data", path.basename(dbUrl));

fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

const sqlite = new Database(absolutePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

ensureSchema(sqlite);

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

console.log(`Seeded ${EXERCISE_LIBRARY.length} exercises into ${absolutePath}`);
sqlite.close();
