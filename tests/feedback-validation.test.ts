import { describe, expect, it } from "vitest";
import { feedbackSchema, onboardingSchema } from "@/lib/validation";

describe("validation", () => {
  it("rejects invalid feedback outcomes", () => {
    const result = feedbackSchema.safeParse({
      dogId: "dog",
      exerciseId: "ex",
      exerciseVersionId: "ver",
      outcome: "failed",
      welfareConcern: false,
      clientMutationId: "mutation-123456",
    });
    expect(result.success).toBe(false);
  });

  it("requires dog name and life stage for onboarding", () => {
    const result = onboardingSchema.safeParse({
      name: "",
      lifeStage: "adult",
      primaryReason: "manners",
      availableTime: "about_10",
      trainingExperience: "new",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid feedback", () => {
    const result = feedbackSchema.safeParse({
      dogId: "dog",
      exerciseId: "ex",
      exerciseVersionId: "ver",
      outcome: "getting_there",
      welfareConcern: true,
      clientMutationId: "mutation-123456",
    });
    expect(result.success).toBe(true);
  });
});
