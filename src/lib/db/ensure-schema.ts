import type Database from "better-sqlite3";

/** Idempotent schema bootstrap for local SQLite development. */
export function ensureSchema(sqlite: Database.Database): void {
  sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS dogs (
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
CREATE INDEX IF NOT EXISTS dogs_owner_idx ON dogs(owner_id);

CREATE TABLE IF NOT EXISTS exercises (
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

CREATE TABLE IF NOT EXISTS exercise_versions (
  id TEXT PRIMARY KEY NOT NULL,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  published_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE UNIQUE INDEX IF NOT EXISTS exercise_version_unique ON exercise_versions(exercise_id, version);

CREATE TABLE IF NOT EXISTS daily_plans (
  id TEXT PRIMARY KEY NOT NULL,
  dog_id TEXT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  plan_date TEXT NOT NULL,
  items_json TEXT NOT NULL,
  is_short_plan INTEGER NOT NULL DEFAULT 0,
  completion_state TEXT NOT NULL DEFAULT 'open',
  generation_meta_json TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE UNIQUE INDEX IF NOT EXISTS daily_plan_dog_date_unique ON daily_plans(dog_id, plan_date);

CREATE TABLE IF NOT EXISTS training_sessions (
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
CREATE INDEX IF NOT EXISTS sessions_dog_idx ON training_sessions(dog_id);
CREATE UNIQUE INDEX IF NOT EXISTS sessions_mutation_unique ON training_sessions(client_mutation_id);

CREATE TABLE IF NOT EXISTS dog_skill_progress (
  id TEXT PRIMARY KEY NOT NULL,
  dog_id TEXT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  learning_objective_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'not_introduced',
  easy_streak INTEGER NOT NULL DEFAULT 0,
  recent_outcomes_json TEXT NOT NULL DEFAULT '[]',
  last_practised_at INTEGER,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE UNIQUE INDEX IF NOT EXISTS dog_skill_unique ON dog_skill_progress(dog_id, learning_objective_id);

CREATE TABLE IF NOT EXISTS owner_term_progress (
  id TEXT PRIMARY KEY NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  term_id TEXT NOT NULL,
  state TEXT NOT NULL,
  introduced_at INTEGER NOT NULL,
  explored_at INTEGER,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE UNIQUE INDEX IF NOT EXISTS owner_term_unique ON owner_term_progress(owner_id, term_id);
CREATE INDEX IF NOT EXISTS owner_term_owner_idx ON owner_term_progress(owner_id);
`);
}
