import {
  DEFAULT_PROGRESSION_CONFIG,
  type ProgressionConfig,
  type SessionOutcome,
  type SkillState,
} from "./types";

export interface OutcomeRecord {
  outcome: SessionOutcome;
  welfareConcern: boolean;
  at: number;
}

export interface ProgressSnapshot {
  state: SkillState;
  easyStreak: number;
  recentOutcomes: OutcomeRecord[];
}

export function applyOutcomeToProgress(
  current: ProgressSnapshot,
  outcome: SessionOutcome,
  welfareConcern: boolean,
  config: ProgressionConfig = DEFAULT_PROGRESSION_CONFIG,
  now = Date.now(),
): ProgressSnapshot {
  const recentOutcomes = [
    { outcome, welfareConcern, at: now },
    ...current.recentOutcomes,
  ].slice(0, config.recentWindowSize);

  if (welfareConcern || outcome === "too_difficult") {
    return {
      state: "needs_easier",
      easyStreak: 0,
      recentOutcomes,
    };
  }

  if (outcome === "getting_there") {
    return {
      state: current.state === "not_introduced" ? "introduced" : "practising",
      easyStreak: 0,
      recentOutcomes,
    };
  }

  // easy
  const easyStreak = current.easyStreak + 1;
  let state: SkillState = current.state;

  if (state === "not_introduced") {
    state = "introduced";
  } else if (state === "introduced") {
    state = "practising";
  } else if (state === "needs_easier") {
    state = "practising";
  } else if (state === "practising") {
    state =
      easyStreak >= Math.max(2, config.easyResultsForIncrease - 1)
        ? "becoming_consistent"
        : "practising";
  } else if (state === "becoming_consistent") {
    state =
      easyStreak >= config.easyResultsForIncrease
        ? "ready_to_increase"
        : "becoming_consistent";
  }

  // One easy result alone must never jump to ready_to_increase
  if (
    current.state === "not_introduced" ||
    current.state === "introduced" ||
    current.easyStreak === 0
  ) {
    if (easyStreak < config.easyResultsForIncrease) {
      if (state === "ready_to_increase") {
        state = "becoming_consistent";
      }
    }
  }

  return { state, easyStreak, recentOutcomes };
}

export function shouldPreferEasierVariation(progress: ProgressSnapshot): boolean {
  return progress.state === "needs_easier";
}

export function shouldPreferHarderVariation(progress: ProgressSnapshot): boolean {
  return progress.state === "ready_to_increase";
}

export function describeSkillState(state: SkillState): string | null {
  switch (state) {
    case "not_introduced":
      return null;
    case "introduced":
      return "We’ve started practising this.";
    case "practising":
      return "This skill is still in progress.";
    case "becoming_consistent":
      return "This is becoming more familiar.";
    case "ready_to_increase":
      return "We’ve had enough good practice to try a tiny step forward.";
    case "needs_easier":
      return "We’re keeping this easier while confidence rebuilds.";
    default:
      return null;
  }
}

export function summariseRecentOutcomes(
  outcomes: OutcomeRecord[],
): "mostly_easy" | "mixed" | "mostly_hard" | "welfare" | "empty" {
  if (outcomes.length === 0) return "empty";
  if (outcomes.some((o) => o.welfareConcern)) return "welfare";
  const easy = outcomes.filter((o) => o.outcome === "easy").length;
  const hard = outcomes.filter((o) => o.outcome === "too_difficult").length;
  if (hard > easy) return "mostly_hard";
  if (easy >= outcomes.length - 1 && easy > 0) return "mostly_easy";
  return "mixed";
}
