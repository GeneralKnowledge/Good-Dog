import { describe, expect, it } from "vitest";
import {
  findGuidesForHelpArticle,
  findGuidesForQuestion,
  getAllGuides,
  getKbImportMeta,
  getReferrals,
} from "@/lib/domains/dog-training/kb-import";
import { getEscalateGuideLessonIds } from "@/lib/domains/dog-training/kb-safety";
import { inferMetricProgress, getAssessmentMetrics } from "@/lib/domains/dog-training/kb-assessment";
import { getCrashCourseStages } from "@/lib/domains/dog-training/kb-crash-course";

const EXPECTED_GUIDE_IDS = [
  "lesson-adolescent-regression",
  "lesson-alone-prevention",
  "lesson-equipment-and-law",
  "lesson-fireworks-management",
  "lesson-how-dogs-learn",
  "lesson-plan-and-measure",
  "lesson-puppy-socialisation",
  "lesson-reactive-management",
  "lesson-read-your-dog-stress",
  "lesson-rescue-settling",
  "lesson-steal-chase",
  "lesson-vet-handling-prep",
];

describe("KB import loaders", () => {
  it("vendors twelve guides from DogResearch export", () => {
    const guides = getAllGuides();
    expect(guides).toHaveLength(12);
    expect(guides.map((g) => g.lessonId).sort()).toEqual([...EXPECTED_GUIDE_IDS].sort());
    expect(guides[0]?.ownerBodyMarkdown).toContain("## What to try");
  });

  it("exposes import metadata", () => {
    const meta = getKbImportMeta();
    expect(meta.generatedAt).toBeTruthy();
    expect(meta.guidesSchemaVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("links reactive questions to management guide", () => {
    const guides = findGuidesForQuestion("my dog is reactive on walks");
    expect(guides.some((g) => g.lessonId === "lesson-reactive-management")).toBe(true);
  });

  it("crosswalks escalate help articles", () => {
    const guides = findGuidesForHelpArticle("help-aggression");
    expect(guides.some((g) => g.lessonId === "lesson-reactive-management")).toBe(true);
  });

  it("maps escalate patterns to guide ids", () => {
    expect(getEscalateGuideLessonIds("My dog is biting children")).toContain(
      "lesson-reactive-management",
    );
  });

  it("includes referrals", () => {
    expect(getReferrals().length).toBeGreaterThan(0);
  });

  it("loads crash course stages", () => {
    expect(getCrashCourseStages().length).toBeGreaterThan(5);
  });

  it("infers assessment metrics from progress", () => {
    expect(getAssessmentMetrics()).toHaveLength(5);
    const rows = inferMetricProgress(
      {
        recall: { state: "introduced", easyStreak: 0, recentOutcomes: [] },
      },
      [],
    );
    expect(rows.some((r) => r.metric.id === "metric-recall-long-line-5m")).toBe(true);
  });
});
