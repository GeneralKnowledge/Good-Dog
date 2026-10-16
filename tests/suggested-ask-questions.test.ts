import { describe, expect, it } from "vitest";
import { suggestedAskQuestions } from "@/lib/ask/suggested-questions";

describe("suggestedAskQuestions", () => {
  it("returns walking prompts for walking category", () => {
    const questions = suggestedAskQuestions("walking");
    expect(questions.some((q) => /lead|pull/i.test(q))).toBe(true);
  });

  it("returns defaults when category is unknown", () => {
    const questions = suggestedAskQuestions("unknown-category");
    expect(questions.length).toBe(3);
    expect(questions[0]).toMatch(/Everyday manners/i);
  });
});
