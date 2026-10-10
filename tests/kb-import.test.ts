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

describe("KB import loaders", () => {
  it("vendors seven guides", () => {
    expect(getAllGuides()).toHaveLength(7);
  });

  it("exposes import metadata", () => {
    const meta = getKbImportMeta();
    expect(meta.generatedAt).toBeTruthy();
    expect(meta.guidesSchemaVersion).toBe("1.0.0");
  });

  it("links reactive questions to management guide", () => {
    const guides = findGuidesForQuestion("my dog is reactive on walks");
    expect(guides.some((g) => g.lessonId === "lesson-reactive-management")).toBe(true);
  });

  it("crosswalks escalate help articles", () => {
    const guides = findGuidesForHelpArticle("help-aggression");
    expect(guides[0]?.lessonId).toBe("lesson-reactive-management");
  });

  it("maps escalate patterns to guide ids", () => {
    expect(getEscalateGuideLessonIds("My dog is biting children")).toContain(
      "lesson-reactive-management",
    );
  });

  it("includes referrals", () => {
    expect(getReferrals().length).toBeGreaterThan(0);
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
