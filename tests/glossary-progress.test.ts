import Database from "better-sqlite3";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import * as schema from "@/lib/db/schema";

function migrate(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_guest INTEGER NOT NULL DEFAULT 0,
      reminder_enabled INTEGER NOT NULL DEFAULT 0,
      reminder_local_time TEXT NOT NULL DEFAULT '17:00',
      reminder_last_sent_date TEXT,
      timezone TEXT NOT NULL DEFAULT 'Europe/London',
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE TABLE owner_term_progress (
      id TEXT PRIMARY KEY NOT NULL,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      term_id TEXT NOT NULL,
      state TEXT NOT NULL,
      introduced_at INTEGER NOT NULL,
      explored_at INTEGER,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE UNIQUE INDEX owner_term_unique ON owner_term_progress(owner_id, term_id);
  `);
}

describe("owner term progress isolation", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-terms-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    migrate(sqlite);
    db = drizzle(sqlite, { schema });
  });

  afterEach(() => {
    sqlite.close();
    fs.rmSync(dbPath, { force: true });
  });

  it("scopes introduced/explored terms to each owner", () => {
    const ownerA = nanoid();
    const ownerB = nanoid();
    const now = new Date();

    db.insert(schema.users)
      .values([
        {
          id: ownerA,
          email: "a@example.com",
          passwordHash: "x",
        },
        {
          id: ownerB,
          email: "b@example.com",
          passwordHash: "x",
        },
      ])
      .run();

    db.insert(schema.ownerTermProgress)
      .values({
        id: nanoid(),
        ownerId: ownerA,
        termId: "marker-word",
        state: "introduced",
        introducedAt: now,
        updatedAt: now,
      })
      .run();

    db.insert(schema.ownerTermProgress)
      .values({
        id: nanoid(),
        ownerId: ownerB,
        termId: "marker-word",
        state: "explored",
        introducedAt: now,
        exploredAt: now,
        updatedAt: now,
      })
      .run();

    const aRows = db
      .select()
      .from(schema.ownerTermProgress)
      .where(eq(schema.ownerTermProgress.ownerId, ownerA))
      .all();
    const bRows = db
      .select()
      .from(schema.ownerTermProgress)
      .where(eq(schema.ownerTermProgress.ownerId, ownerB))
      .all();

    expect(aRows).toHaveLength(1);
    expect(aRows[0]!.state).toBe("introduced");
    expect(bRows).toHaveLength(1);
    expect(bRows[0]!.state).toBe("explored");

    // Deleting owner A clears only their progress
    db.delete(schema.users).where(eq(schema.users.id, ownerA)).run();
    expect(
      db
        .select()
        .from(schema.ownerTermProgress)
        .where(eq(schema.ownerTermProgress.ownerId, ownerA))
        .all(),
    ).toHaveLength(0);
    expect(
      db
        .select()
        .from(schema.ownerTermProgress)
        .where(eq(schema.ownerTermProgress.ownerId, ownerB))
        .all(),
    ).toHaveLength(1);
  });

  it("does not duplicate introduced rows for the same owner+term", () => {
    const ownerId = nanoid();
    const now = new Date();
    db.insert(schema.users)
      .values({ id: ownerId, email: "solo@example.com", passwordHash: "x" })
      .run();

    db.insert(schema.ownerTermProgress)
      .values({
        id: nanoid(),
        ownerId,
        termId: "threshold",
        state: "introduced",
        introducedAt: now,
        updatedAt: now,
      })
      .run();

    expect(() =>
      db
        .insert(schema.ownerTermProgress)
        .values({
          id: nanoid(),
          ownerId,
          termId: "threshold",
          state: "introduced",
          introducedAt: now,
          updatedAt: now,
        })
        .run(),
    ).toThrow();

    const row = db
      .select()
      .from(schema.ownerTermProgress)
      .where(
        and(
          eq(schema.ownerTermProgress.ownerId, ownerId),
          eq(schema.ownerTermProgress.termId, "threshold"),
        ),
      )
      .get();
    expect(row?.state).toBe("introduced");
  });
});
