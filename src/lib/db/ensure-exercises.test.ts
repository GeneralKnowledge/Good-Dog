import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";
import { ensureExercises } from "./ensure-exercises";
import { ensureSchema } from "./ensure-schema";
import * as schema from "./schema";

describe("ensureExercises", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-ensure-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    ensureSchema(sqlite);
    db = drizzle(sqlite, { schema });
  });

  afterEach(() => {
    sqlite.close();
    fs.rmSync(dbPath, { force: true });
  });

  it("creates version snapshots for every library exercise including ex-name-response", () => {
    expect(
      db
        .select()
        .from(schema.exerciseVersions)
        .where(eq(schema.exerciseVersions.id, "ex-name-response-v1"))
        .get(),
    ).toBeUndefined();

    ensureExercises(db);

    const nameResponse = db
      .select()
      .from(schema.exerciseVersions)
      .where(eq(schema.exerciseVersions.id, "ex-name-response-v1"))
      .get();

    expect(nameResponse).toBeDefined();
    expect(nameResponse!.exerciseId).toBe("ex-name-response");
    expect(nameResponse!.version).toBe(1);

    const versions = db.select().from(schema.exerciseVersions).all();
    expect(versions).toHaveLength(EXERCISE_LIBRARY.length);

    for (const exercise of EXERCISE_LIBRARY) {
      const versionId = `${exercise.id}-v${exercise.contentVersion}`;
      expect(versions.some((row) => row.id === versionId)).toBe(true);
    }
  });

  it("is idempotent and does not overwrite existing version snapshots", () => {
    ensureExercises(db);

    const original = db
      .select()
      .from(schema.exerciseVersions)
      .where(eq(schema.exerciseVersions.id, "ex-name-response-v1"))
      .get()!;

    db.update(schema.exerciseVersions)
      .set({ snapshotJson: JSON.stringify({ preserved: true }) })
      .where(eq(schema.exerciseVersions.id, "ex-name-response-v1"))
      .run();

    ensureExercises(db);

    const after = db
      .select()
      .from(schema.exerciseVersions)
      .where(eq(schema.exerciseVersions.id, "ex-name-response-v1"))
      .get()!;

    expect(after.snapshotJson).toBe(JSON.stringify({ preserved: true }));
    expect(after.publishedAt).toEqual(original.publishedAt);
  });
});
