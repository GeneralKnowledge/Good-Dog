import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const onboardingSchema = z.object({
  name: z.string().trim().min(1, "Please enter your dog’s name").max(40),
  lifeStage: z.enum([
    "young_puppy",
    "older_puppy",
    "adolescent",
    "adult",
    "senior",
  ]),
  primaryReason: z.string().trim().min(1, "Tell us what you’d like help with").max(200),
  availableTime: z.enum(["few_minutes", "about_10", "more"]),
  trainingExperience: z.enum(["new", "some"]),
  preferredRewards: z.string().trim().max(120).optional().or(z.literal("")),
});

export const feedbackSchema = z.object({
  dogId: z.string().min(1),
  exerciseId: z.string().min(1),
  exerciseVersionId: z.string().min(1),
  dailyPlanId: z.string().optional(),
  planItemId: z.string().optional(),
  outcome: z.enum(["easy", "getting_there", "too_difficult"]),
  welfareConcern: z.boolean(),
  ownerNote: z.string().max(500).optional(),
  clientMutationId: z.string().min(8).max(80),
});

export const updateDogSchema = onboardingSchema.partial().extend({
  dogId: z.string().min(1),
});
