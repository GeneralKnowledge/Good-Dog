import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";
import { ensureExercises } from "./ensure-exercises";
import { ensureSchema } from "./ensure-schema";

const dbUrl = process.env.DATABASE_URL ?? "./data/good-dog.db";
const absolutePath = path.isAbsolute(dbUrl)
  ? dbUrl
  : path.join(/*turbopackIgnore: true*/ process.cwd(), "data", path.basename(dbUrl));

fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

const sqlite = new Database(absolutePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
ensureSchema(sqlite);

export const db = drizzle(sqlite, { schema });
ensureExercises(db);
export { sqlite };
