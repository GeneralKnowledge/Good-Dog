import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { EXERCISE_LIBRARY } from "../src/lib/content/exercises";
import { ensureExercises } from "../src/lib/db/ensure-exercises";
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

ensureSchema(sqlite);
const db = drizzle(sqlite, { schema });
ensureExercises(db);

console.log(`Seeded ${EXERCISE_LIBRARY.length} exercises into ${absolutePath}`);
sqlite.close();
