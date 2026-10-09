import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  timezone: text("timezone").notNull().default("Europe/London"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const dogs = sqliteTable(
  "dogs",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    lifeStage: text("life_stage", {
      enum: [
        "young_puppy",
        "older_puppy",
        "adolescent",
        "adult",
        "senior",
      ],
    }).notNull(),
    primaryReason: text("primary_reason").notNull(),
    availableTime: text("available_time", {
      enum: ["few_minutes", "about_10", "more"],
    }).notNull(),
    trainingExperience: text("training_experience", {
      enum: ["new", "some"],
    }).notNull(),
    breedOrMix: text("breed_or_mix"),
    householdContext: text("household_context"),
    alreadyEasy: text("already_easy"),
    knownTriggers: text("known_triggers"),
    preferredRewards: text("preferred_rewards"),
    onboardingComplete: integer("onboarding_complete", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index("dogs_owner_idx").on(table.ownerId)],
);

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  learningObjectiveId: text("learning_objective_id").notNull(),
  category: text("category").notNull(),
  lifeStages: text("life_stages", { mode: "json" }).$type<string[]>().notNull(),
  difficulty: integer("difficulty").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  prerequisiteIds: text("prerequisite_ids", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  purpose: text("purpose").notNull(),
  preparation: text("preparation").notNull(),
  steps: text("steps", { mode: "json" }).$type<string[]>().notNull(),
  lookFor: text("look_for").notNull(),
  ifDifficult: text("if_difficult").notNull(),
  easierVariationId: text("easier_variation_id"),
  harderVariationId: text("harder_variation_id"),
  safetyNote: text("safety_note"),
  hint: text("hint").notNull(),
  topicGroup: text("topic_group").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  contentVersion: integer("content_version").notNull().default(1),
});

export const exerciseVersions = sqliteTable(
  "exercise_versions",
  {
    id: text("id").primaryKey(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id),
    version: integer("version").notNull(),
    snapshotJson: text("snapshot_json").notNull(),
    publishedAt: integer("published_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("exercise_version_unique").on(table.exerciseId, table.version),
  ],
);

export const dailyPlans = sqliteTable(
  "daily_plans",
  {
    id: text("id").primaryKey(),
    dogId: text("dog_id")
      .notNull()
      .references(() => dogs.id, { onDelete: "cascade" }),
    planDate: text("plan_date").notNull(),
    itemsJson: text("items_json").notNull(),
    isShortPlan: integer("is_short_plan", { mode: "boolean" })
      .notNull()
      .default(false),
    completionState: text("completion_state", {
      enum: ["open", "completed"],
    })
      .notNull()
      .default("open"),
    generationMetaJson: text("generation_meta_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("daily_plan_dog_date_unique").on(table.dogId, table.planDate),
  ],
);

export const trainingSessions = sqliteTable(
  "training_sessions",
  {
    id: text("id").primaryKey(),
    dogId: text("dog_id")
      .notNull()
      .references(() => dogs.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull(),
    exerciseVersionId: text("exercise_version_id")
      .notNull()
      .references(() => exerciseVersions.id),
    dailyPlanId: text("daily_plan_id").references(() => dailyPlans.id),
    planItemId: text("plan_item_id"),
    startedAt: integer("started_at", { mode: "timestamp_ms" }),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    outcome: text("outcome", {
      enum: ["easy", "getting_there", "too_difficult"],
    }),
    welfareConcern: integer("welfare_concern", { mode: "boolean" })
      .notNull()
      .default(false),
    ownerNote: text("owner_note"),
    clientMutationId: text("client_mutation_id"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("sessions_dog_idx").on(table.dogId),
    uniqueIndex("sessions_mutation_unique").on(table.clientMutationId),
  ],
);

export const dogSkillProgress = sqliteTable(
  "dog_skill_progress",
  {
    id: text("id").primaryKey(),
    dogId: text("dog_id")
      .notNull()
      .references(() => dogs.id, { onDelete: "cascade" }),
    learningObjectiveId: text("learning_objective_id").notNull(),
    state: text("state", {
      enum: [
        "not_introduced",
        "introduced",
        "practising",
        "becoming_consistent",
        "ready_to_increase",
        "needs_easier",
      ],
    })
      .notNull()
      .default("not_introduced"),
    easyStreak: integer("easy_streak").notNull().default(0),
    recentOutcomesJson: text("recent_outcomes_json").notNull().default("[]"),
    lastPractisedAt: integer("last_practised_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("dog_skill_unique").on(table.dogId, table.learningObjectiveId),
  ],
);

/** Owner vocabulary exposure — does not affect dog training progression */
export const ownerTermProgress = sqliteTable(
  "owner_term_progress",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    termId: text("term_id").notNull(),
    state: text("state", {
      enum: ["introduced", "explored"],
    }).notNull(),
    introducedAt: integer("introduced_at", { mode: "timestamp_ms" }).notNull(),
    exploredAt: integer("explored_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("owner_term_unique").on(table.ownerId, table.termId),
    index("owner_term_owner_idx").on(table.ownerId),
  ],
);

export type User = typeof users.$inferSelect;
export type Dog = typeof dogs.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type ExerciseVersion = typeof exerciseVersions.$inferSelect;
export type DailyPlan = typeof dailyPlans.$inferSelect;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type DogSkillProgress = typeof dogSkillProgress.$inferSelect;
export type OwnerTermProgress = typeof ownerTermProgress.$inferSelect;
