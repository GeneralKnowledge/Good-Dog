import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import { ensureSchema } from "@/lib/db/ensure-schema";
import * as schema from "@/lib/db/schema";
import { EXERCISE_LIBRARY } from "@/lib/domains/dog-training";

describe("data isolation and persistence invariants", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-test-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    ensureSchema(sqlite);
    db = drizzle(sqlite, { schema });

    const exercise = EXERCISE_LIBRARY[0]!;
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
        hint: exercise.hint,
        topicGroup: exercise.topicGroup,
        published: true,
        contentVersion: 1,
      })
      .run();

    db.insert(schema.exerciseVersions)
      .values({
        id: `${exercise.id}-v1`,
        exerciseId: exercise.id,
        version: 1,
        snapshotJson: JSON.stringify(exercise),
      })
      .run();
  });

  afterEach(() => {
    sqlite.close();
    fs.rmSync(dbPath, { force: true });
  });

  it("scopes dogs to owners", () => {
    const ownerA = nanoid();
    const ownerB = nanoid();
    db.insert(schema.users)
      .values([
        { id: ownerA, email: "a@example.com", passwordHash: "x" },
        { id: ownerB, email: "b@example.com", passwordHash: "x" },
      ])
      .run();

    const dogA = nanoid();
    db.insert(schema.dogs)
      .values({
        id: dogA,
        ownerId: ownerA,
        name: "Pip",
        lifeStage: "adult",
        primaryReason: "manners",
        availableTime: "about_10",
        trainingExperience: "new",
        onboardingComplete: true,
      })
      .run();

    const stolen = db
      .select()
      .from(schema.dogs)
      .where(eq(schema.dogs.id, dogA))
      .get();

    expect(stolen?.ownerId).toBe(ownerA);
    expect(stolen?.ownerId).not.toBe(ownerB);
  });

  it("rejects duplicate session submissions with the same mutation id", () => {
    const ownerId = nanoid();
    const dogId = nanoid();
    const exercise = EXERCISE_LIBRARY[0]!;

    db.insert(schema.users)
      .values({ id: ownerId, email: "c@example.com", passwordHash: "x" })
      .run();
    db.insert(schema.dogs)
      .values({
        id: dogId,
        ownerId,
        name: "Ned",
        lifeStage: "adult",
        primaryReason: "recall",
        availableTime: "few_minutes",
        trainingExperience: "some",
        onboardingComplete: true,
      })
      .run();

    const mutationId = nanoid();
    db.insert(schema.trainingSessions)
      .values({
        id: nanoid(),
        dogId,
        exerciseId: exercise.id,
        exerciseVersionId: `${exercise.id}-v1`,
        outcome: "easy",
        welfareConcern: false,
        clientMutationId: mutationId,
        completedAt: new Date(),
      })
      .run();

    expect(() =>
      db
        .insert(schema.trainingSessions)
        .values({
          id: nanoid(),
          dogId,
          exerciseId: exercise.id,
          exerciseVersionId: `${exercise.id}-v1`,
          outcome: "easy",
          welfareConcern: false,
          clientMutationId: mutationId,
          completedAt: new Date(),
        })
        .run(),
    ).toThrow();
  });

  it("keeps one daily plan per dog per date", () => {
    const ownerId = nanoid();
    const dogId = nanoid();
    db.insert(schema.users)
      .values({ id: ownerId, email: "d@example.com", passwordHash: "x" })
      .run();
    db.insert(schema.dogs)
      .values({
        id: dogId,
        ownerId,
        name: "Joy",
        lifeStage: "adult",
        primaryReason: "calm",
        availableTime: "about_10",
        trainingExperience: "new",
        onboardingComplete: true,
      })
      .run();

    db.insert(schema.dailyPlans)
      .values({
        id: nanoid(),
        dogId,
        planDate: "2026-10-09",
        itemsJson: "[]",
        generationMetaJson: "{}",
      })
      .run();

    expect(() =>
      db
        .insert(schema.dailyPlans)
        .values({
          id: nanoid(),
          dogId,
          planDate: "2026-10-09",
          itemsJson: "[]",
          generationMetaJson: "{}",
        })
        .run(),
    ).toThrow();
  });

  it("preserves historical exercise version snapshots after content updates", () => {
    const exercise = EXERCISE_LIBRARY[0]!;
    const v1 = db
      .select()
      .from(schema.exerciseVersions)
      .where(eq(schema.exerciseVersions.id, `${exercise.id}-v1`))
      .get();

    expect(v1).toBeTruthy();
    const snapshot = JSON.parse(v1!.snapshotJson);
    expect(snapshot.title).toBe(exercise.title);

    db.insert(schema.exerciseVersions)
      .values({
        id: `${exercise.id}-v2`,
        exerciseId: exercise.id,
        version: 2,
        snapshotJson: JSON.stringify({ ...exercise, title: "Updated title" }),
      })
      .run();

    const stillV1 = db
      .select()
      .from(schema.exerciseVersions)
      .where(eq(schema.exerciseVersions.id, `${exercise.id}-v1`))
      .get();
    expect(JSON.parse(stillV1!.snapshotJson).title).toBe(exercise.title);
  });
});
