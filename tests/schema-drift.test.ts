import Database from "better-sqlite3";
import { getTableName, is } from "drizzle-orm";
import { getTableConfig, SQLiteTable } from "drizzle-orm/sqlite-core";
import { describe, expect, it } from "vitest";
import { ensureSchema } from "@/lib/db/ensure-schema";
import * as schema from "@/lib/db/schema";

const tables = Object.values(schema).filter((value): value is SQLiteTable =>
  is(value, SQLiteTable),
);

function bootstrap() {
  const sqlite = new Database(":memory:");
  ensureSchema(sqlite);
  return sqlite;
}

describe("ensureSchema stays in step with the Drizzle schema", () => {
  const sqlite = bootstrap();

  it("covers every table declared in schema.ts", () => {
    const actual = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
      .all() as { name: string }[];

    expect(actual.map((t) => t.name).sort()).toEqual(
      tables.map((t) => getTableName(t)).sort(),
    );
  });

  for (const table of tables) {
    const config = getTableConfig(table);

    it(`${config.name}: columns match`, () => {
      const actual = sqlite.prepare(`PRAGMA table_info(${config.name})`).all() as {
        name: string;
        notnull: number;
        pk: number;
      }[];

      const expected = config.columns.map((c) => ({
        name: c.name,
        notNull: c.notNull,
        primaryKey: c.primary,
      }));

      expect(
        actual
          .map((c) => ({ name: c.name, notNull: c.notnull === 1 || c.pk > 0, primaryKey: c.pk > 0 }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      ).toEqual(expected.sort((a, b) => a.name.localeCompare(b.name)));
    });

    it(`${config.name}: indexes match`, () => {
      const actual = (
        sqlite.prepare(`PRAGMA index_list(${config.name})`).all() as {
          name: string;
          origin: string;
        }[]
      )
        .filter((i) => i.origin === "c")
        .map((i) => i.name)
        .sort();

      expect(actual).toEqual(config.indexes.map((i) => i.config.name).sort());
    });
  }
});
