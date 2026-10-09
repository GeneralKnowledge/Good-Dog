import { describe, expect, it } from "vitest";
import {
  applyOutcomeToProgress,
  shouldPreferEasierVariation,
  shouldPreferHarderVariation,
  type ProgressSnapshot,
} from "./progression";
import { DEFAULT_PROGRESSION_CONFIG } from "@/lib/types";

const fresh: ProgressSnapshot = {
  state: "not_introduced",
  easyStreak: 0,
  recentOutcomes: [],
};

describe("applyOutcomeToProgress", () => {
  it("does not declare ready_to_increase after a single easy result", () => {
    const next = applyOutcomeToProgress(fresh, "easy", false);
    expect(next.state).not.toBe("ready_to_increase");
    expect(["introduced", "practising"]).toContain(next.state);
  });

  it("supports gradual progression after repeated comfortable outcomes", () => {
    let progress = fresh;
    for (let i = 0; i < DEFAULT_PROGRESSION_CONFIG.easyResultsForIncrease; i++) {
      progress = applyOutcomeToProgress(progress, "easy", false);
    }
    expect(["becoming_consistent", "ready_to_increase"]).toContain(progress.state);

    // Continue until ready
    while (
      progress.state !== "ready_to_increase" &&
      progress.easyStreak < DEFAULT_PROGRESSION_CONFIG.easyResultsForIncrease + 3
    ) {
      progress = applyOutcomeToProgress(progress, "easy", false);
    }
    expect(progress.state).toBe("ready_to_increase");
    expect(shouldPreferHarderVariation(progress)).toBe(true);
  });

  it("favours consolidation on mixed results", () => {
    let progress = applyOutcomeToProgress(fresh, "easy", false);
    progress = applyOutcomeToProgress(progress, "getting_there", false);
    expect(progress.state).toBe("practising");
    expect(progress.easyStreak).toBe(0);
    expect(shouldPreferHarderVariation(progress)).toBe(false);
  });

  it("marks needs_easier on difficult outcomes", () => {
    const progress = applyOutcomeToProgress(
      { state: "practising", easyStreak: 2, recentOutcomes: [] },
      "too_difficult",
      false,
    );
    expect(progress.state).toBe("needs_easier");
    expect(shouldPreferEasierVariation(progress)).toBe(true);
  });

  it("lets welfare concerns override ordinary progression", () => {
    const progress = applyOutcomeToProgress(
      { state: "ready_to_increase", easyStreak: 4, recentOutcomes: [] },
      "easy",
      true,
    );
    expect(progress.state).toBe("needs_easier");
    expect(progress.easyStreak).toBe(0);
  });
});
