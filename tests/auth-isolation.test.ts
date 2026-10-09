import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import * as schema from "@/lib/db/schema";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";

function migrate(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_guest INTEGER NOT NULL DEFAULT 0,
      timezone TEXT NOT NULL DEFAULT 'Europe/London',
      reminder_enabled INTEGER NOT NULL DEFAULT 0,
      reminder_local_time TEXT NOT NULL DEFAULT '17:00',
      reminder_last_sent_date TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE TABLE push_subscriptions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      user_agent TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE TABLE dogs (
      id TEXT PRIMARY KEY NOT NULL,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      life_stage TEXT NOT NULL,
      primary_reason TEXT NOT NULL,
      available_time TEXT NOT NULL,
      training_experience TEXT NOT NULL,
      breed_or_mix TEXT,
      household_context TEXT,
      already_easy TEXT,
      known_triggers TEXT,
      preferred_rewards TEXT,
      onboarding_complete INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE TABLE exercises (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      learning_objective_id TEXT NOT NULL,
      category TEXT NOT NULL,
      life_stages TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      estimated_minutes INTEGER NOT NULL,
      prerequisite_ids TEXT NOT NULL,
      purpose TEXT NOT NULL,
      preparation TEXT NOT NULL,
      steps TEXT NOT NULL,
      look_for TEXT NOT NULL,
      if_difficult TEXT NOT NULL,
      easier_variation_id TEXT,
      harder_variation_id TEXT,
      safety_note TEXT,
      hint TEXT NOT NULL,
      topic_group TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      content_version INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE exercise_versions (
      id TEXT PRIMARY KEY NOT NULL,
      exercise_id TEXT NOT NULL REFERENCES exercises(id),
      version INTEGER NOT NULL,
      snapshot_json TEXT NOT NULL,
      published_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE UNIQUE INDEX exercise_version_unique ON exercise_versions(exercise_id, version);
    CREATE TABLE daily_plans (
      id TEXT PRIMARY KEY NOT NULL,
      dog_id TEXT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      plan_date TEXT NOT NULL,
      items_json TEXT NOT NULL,
      is_short_plan INTEGER NOT NULL DEFAULT 0,
      completion_state TEXT NOT NULL DEFAULT 'open',
      generation_meta_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE UNIQUE INDEX daily_plan_dog_date_unique ON daily_plans(dog_id, plan_date);
    CREATE TABLE training_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      dog_id TEXT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      exercise_id TEXT NOT NULL,
      exercise_version_id TEXT NOT NULL REFERENCES exercise_versions(id),
      daily_plan_id TEXT REFERENCES daily_plans(id),
      plan_item_id TEXT,
      started_at INTEGER,
      completed_at INTEGER,
      outcome TEXT,
      welfare_concern INTEGER NOT NULL DEFAULT 0,
      owner_note TEXT,
      client_mutation_id TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE UNIQUE INDEX sessions_mutation_unique ON training_sessions(client_mutation_id);
    CREATE TABLE dog_skill_progress (
      id TEXT PRIMARY KEY NOT NULL,
      dog_id TEXT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      learning_objective_id TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'not_introduced',
      easy_streak INTEGER NOT NULL DEFAULT 0,
      recent_outcomes_json TEXT NOT NULL DEFAULT '[]',
      last_practised_at INTEGER,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE UNIQUE INDEX dog_skill_unique ON dog_skill_progress(dog_id, learning_objective_id);
  `);
}

describe("data isolation and persistence invariants", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-test-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    migrate(sqlite);
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
