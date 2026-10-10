import type { ProgressionConfig } from "./types";
import { DEFAULT_PROGRESSION_CONFIG } from "./types";
import type { RecentSessionSummary } from "./plan-generator";
import type { OutcomeRecord } from "./progression";

const DAY_MS = 24 * 60 * 60 * 1000;

export function welfareCooldownMs(config: ProgressionConfig = DEFAULT_PROGRESSION_CONFIG): number {
  return config.welfareCooldownDays * DAY_MS;
}

export function objectiveInWelfareCooldown(
  learningObjectiveId: string,
  recentSessions: RecentSessionSummary[],
  now: number,
  config: ProgressionConfig = DEFAULT_PROGRESSION_CONFIG,
): boolean {
  const windowMs = welfareCooldownMs(config);
  return recentSessions.some(
    (s) =>
      s.learningObjectiveId === learningObjectiveId &&
      s.welfareConcern &&
      now - s.completedAt < windowMs,
  );
}

export function hasRecentWelfareInProgress(
  recentOutcomes: OutcomeRecord[],
  now: number,
  config: ProgressionConfig = DEFAULT_PROGRESSION_CONFIG,
): boolean {
  const windowMs = welfareCooldownMs(config);
  return recentOutcomes.some((o) => o.welfareConcern && now - o.at < windowMs);
}

/** Low-pressure exercises suitable after a welfare concern. */
export const WELFARE_CALM_EXERCISE_IDS = [
  "ex-engagement-easy",
  "ex-mat-settle",
  "ex-rest-spot",
  "ex-reward-marker",
  "ex-handling-touch",
] as const;
