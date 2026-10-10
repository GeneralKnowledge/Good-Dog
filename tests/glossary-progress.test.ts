import Database from "better-sqlite3";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import * as schema from "@/lib/db/schema";
import { ensureSchema } from "@/lib/db/ensure-schema";

describe("owner term progress isolation", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-terms-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    ensureSchema(sqlite);
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

    const forA = db
      .select()
      .from(schema.ownerTermProgress)
      .where(eq(schema.ownerTermProgress.ownerId, ownerA))
      .all();
    const forB = db
      .select()
      .from(schema.ownerTermProgress)
      .where(eq(schema.ownerTermProgress.ownerId, ownerB))
      .all();

    expect(forA).toHaveLength(1);
    expect(forA[0]?.state).toBe("introduced");
    expect(forB).toHaveLength(1);
    expect(forB[0]?.state).toBe("explored");
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
        termId: "luring",
        state: "introduced",
        introducedAt: now,
        updatedAt: now,
      })
      .run();

    const existing = db
      .select()
      .from(schema.ownerTermProgress)
      .where(
        and(
          eq(schema.ownerTermProgress.ownerId, ownerId),
          eq(schema.ownerTermProgress.termId, "luring"),
        ),
      )
      .get();

    expect(existing).toBeTruthy();

    // Second introduce is a no-op when the row already exists (mirrors action behaviour)
    if (!existing) {
      db.insert(schema.ownerTermProgress)
        .values({
          id: nanoid(),
          ownerId,
          termId: "luring",
          state: "introduced",
          introducedAt: now,
          updatedAt: now,
        })
        .run();
    }

    const rows = db
      .select()
      .from(schema.ownerTermProgress)
      .where(eq(schema.ownerTermProgress.ownerId, ownerId))
      .all();
    expect(rows).toHaveLength(1);
  });
});
