import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import * as schema from "@/lib/db/schema";
import { ensureExercises } from "@/lib/db/ensure-exercises";
import { ensureSchema } from "@/lib/db/ensure-schema";
import { DEFAULT_DOG_PROFILE, toDogSubject } from "@/lib/services/dogs";
import { EXERCISE_LIBRARY } from "@/lib/domains/dog-training";
import { generateDailyPlan } from "@/lib/coaching";
import { dogTrainingPolicy } from "@/lib/domains/dog-training";

describe("plan resilience without full user info", () => {
  it("toDogSubject fills soft defaults for blank or unexpected fields", () => {
    const subject = toDogSubject({
      id: "dog-1",
      ownerId: "owner-1",
      name: "   ",
      lifeStage: "not-a-stage" as never,
      primaryReason: "",
      availableTime: "forever" as never,
      trainingExperience: "" as never,
      breedOrMix: null,
      householdContext: null,
      alreadyEasy: null,
      knownTriggers: null,
      preferredRewards: null,
      onboardingComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(subject.name).toBe(DEFAULT_DOG_PROFILE.name);
    expect(subject.lifeStage).toBe(DEFAULT_DOG_PROFILE.lifeStage);
    expect(subject.primaryReason).toBe(DEFAULT_DOG_PROFILE.primaryReason);
    expect(subject.availableTime).toBe(DEFAULT_DOG_PROFILE.availableTime);
    expect(subject.trainingExperience).toBe(DEFAULT_DOG_PROFILE.trainingExperience);
  });

  it("generates a plan from default subject fields alone", () => {
    const subject = toDogSubject({
      id: "dog-defaults",
      ownerId: "owner-1",
      name: "",
      lifeStage: "adult",
      primaryReason: "",
      availableTime: "about_10",
      trainingExperience: "new",
      breedOrMix: null,
      householdContext: null,
      alreadyEasy: null,
      knownTriggers: null,
      preferredRewards: null,
      onboardingComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const plan = generateDailyPlan({
      subject,
      exercises: EXERCISE_LIBRARY,
      policy: dogTrainingPolicy,
      progressByObjective: {},
      recentSessions: [],
    });

    expect(plan.items.length).toBeGreaterThan(0);
  });
});

describe("ensureExercises heals missing version snapshots", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-plan-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    ensureSchema(sqlite);
    db = drizzle(sqlite, { schema });
  });

  afterEach(() => {
    sqlite.close();
    fs.rmSync(dbPath, { force: true });
  });

  it("recreates wiped version rows so plan generation can resolve them", () => {
    ensureExercises(db);
    sqlite.exec("DELETE FROM exercise_versions");
    expect(db.select().from(schema.exerciseVersions).all()).toHaveLength(0);

    ensureExercises(db);

    const versions = db.select().from(schema.exerciseVersions).all();
    expect(versions).toHaveLength(EXERCISE_LIBRARY.length);

    for (const exercise of EXERCISE_LIBRARY) {
      const versionId = `${exercise.id}-v${exercise.contentVersion}`;
      expect(versions.some((row) => row.id === versionId)).toBe(true);
    }
  });
});
