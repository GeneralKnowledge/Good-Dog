import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nanoid } from "nanoid";
import * as schema from "@/lib/db/schema";
import { ensureSchema } from "@/lib/db/ensure-schema";

describe("guest accounts", () => {
  let dbPath: string;
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `good-dog-guest-${nanoid()}.db`);
    sqlite = new Database(dbPath);
    sqlite.pragma("foreign_keys = ON");
    ensureSchema(sqlite);
    db = drizzle(sqlite, { schema });
  });

  afterEach(() => {
    sqlite.close();
    fs.rmSync(dbPath, { force: true });
  });

  it("creates guest users and can claim them with a real email", () => {
    const id = nanoid();
    db.insert(schema.users)
      .values({
        id,
        email: `guest-${id}@guest.local`,
        passwordHash: "guest-hash",
        isGuest: true,
      })
      .run();

    const guest = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    expect(guest?.isGuest).toBe(true);

    db.update(schema.users)
      .set({
        email: "owner@example.com",
        passwordHash: "real-hash",
        isGuest: false,
      })
      .where(eq(schema.users.id, id))
      .run();

    const claimed = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    expect(claimed?.isGuest).toBe(false);
    expect(claimed?.email).toBe("owner@example.com");
  });

  it("migrates existing users tables without is_guest", () => {
    const legacyPath = path.join(os.tmpdir(), `good-dog-legacy-${nanoid()}.db`);
    const legacy = new Database(legacyPath);
    legacy.exec(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        timezone TEXT NOT NULL DEFAULT 'Europe/London',
        created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
      );
    `);
    legacy
      .prepare(
        `INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)`,
      )
      .run("u1", "old@example.com", "hash");
    ensureSchema(legacy);
    const columns = legacy.prepare(`PRAGMA table_info(users)`).all() as Array<{ name: string }>;
    expect(columns.some((c) => c.name === "is_guest")).toBe(true);
    expect(columns.some((c) => c.name === "reminder_enabled")).toBe(true);
    const row = legacy.prepare(`SELECT is_guest FROM users WHERE id = ?`).get("u1") as {
      is_guest: number;
    };
    expect(row.is_guest).toBe(0);
    legacy.close();
    fs.rmSync(legacyPath, { force: true });
  });
});
