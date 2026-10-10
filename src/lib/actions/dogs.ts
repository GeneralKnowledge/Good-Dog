"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs } from "@/lib/db/schema";
import { DEFAULT_DOG_PROFILE, getDogForOwner } from "@/lib/services/dogs";
import { getOrCreateDailyPlan } from "@/lib/services/plans";
import { onboardingSchema, updateDogSchema } from "@/lib/validation";

export type DogActionResult =
  | { ok: true; dogId?: string }
  | { ok: false; error: string };

function finishOnboarding(dogId: string, ownerId: string): void {
  try {
    getOrCreateDailyPlan({ dogId, ownerId });
  } catch (error) {
    // Dog is saved — Today will retry plan generation. Don't strand the guest.
    console.error("Initial daily plan failed; continuing to Today", error);
  }
  revalidatePath("/today");
  redirect("/today?welcome=1");
}

export async function createDogAction(
  _prev: DogActionResult | null,
  formData: FormData,
): Promise<DogActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Please sign in first" };
  }

  const parsed = onboardingSchema.safeParse({
    name: formData.get("name"),
    lifeStage: formData.get("lifeStage"),
    primaryReason: formData.get("primaryReason"),
    availableTime: formData.get("availableTime"),
    trainingExperience: formData.get("trainingExperience"),
    preferredRewards: formData.get("preferredRewards") || "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = getDogForOwner(user.id);
  if (existing?.onboardingComplete) {
    redirect("/today");
  }

  const dogId = existing?.id ?? nanoid();
  const data = parsed.data;

  if (existing) {
    db.update(dogs)
      .set({
        name: data.name,
        lifeStage: data.lifeStage,
        primaryReason: data.primaryReason,
        availableTime: data.availableTime,
        trainingExperience: data.trainingExperience,
        preferredRewards: data.preferredRewards || null,
        onboardingComplete: true,
        updatedAt: new Date(),
      })
      .where(eq(dogs.id, existing.id))
      .run();
  } else {
    db.insert(dogs)
      .values({
        id: dogId,
        ownerId: user.id,
        name: data.name,
        lifeStage: data.lifeStage,
        primaryReason: data.primaryReason,
        availableTime: data.availableTime,
        trainingExperience: data.trainingExperience,
        preferredRewards: data.preferredRewards || null,
        onboardingComplete: true,
      })
      .run();
  }

  finishOnboarding(dogId, user.id);
  return { ok: true, dogId };
}

/** Create a starter profile with defaults so guests can reach a plan without forms. */
export async function skipOnboardingWithDefaultsAction(): Promise<void> {
  const user = await requireUser();
  if (!user) {
    redirect("/sign-in");
  }

  const existing = getDogForOwner(user.id);
  if (existing?.onboardingComplete) {
    redirect("/today");
  }

  const dogId = existing?.id ?? nanoid();

  if (existing) {
    db.update(dogs)
      .set({
        name: existing.name?.trim() || DEFAULT_DOG_PROFILE.name,
        lifeStage: existing.lifeStage || DEFAULT_DOG_PROFILE.lifeStage,
        primaryReason: existing.primaryReason?.trim() || DEFAULT_DOG_PROFILE.primaryReason,
        availableTime: existing.availableTime || DEFAULT_DOG_PROFILE.availableTime,
        trainingExperience:
          existing.trainingExperience || DEFAULT_DOG_PROFILE.trainingExperience,
        onboardingComplete: true,
        updatedAt: new Date(),
      })
      .where(eq(dogs.id, existing.id))
      .run();
  } else {
    db.insert(dogs)
      .values({
        id: dogId,
        ownerId: user.id,
        name: DEFAULT_DOG_PROFILE.name,
        lifeStage: DEFAULT_DOG_PROFILE.lifeStage,
        primaryReason: DEFAULT_DOG_PROFILE.primaryReason,
        availableTime: DEFAULT_DOG_PROFILE.availableTime,
        trainingExperience: DEFAULT_DOG_PROFILE.trainingExperience,
        onboardingComplete: true,
      })
      .run();
  }

  finishOnboarding(dogId, user.id);
}

export async function updateDogAction(
  _prev: DogActionResult | null,
  formData: FormData,
): Promise<DogActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Please sign in first" };
  }

  const parsed = updateDogSchema.safeParse({
    dogId: formData.get("dogId"),
    name: formData.get("name") || undefined,
    lifeStage: formData.get("lifeStage") || undefined,
    primaryReason: formData.get("primaryReason") || undefined,
    availableTime: formData.get("availableTime") || undefined,
    trainingExperience: formData.get("trainingExperience") || undefined,
    preferredRewards: formData.get("preferredRewards") ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const dog = db
    .select()
    .from(dogs)
    .where(eq(dogs.id, parsed.data.dogId))
    .get();

  if (!dog || dog.ownerId !== user.id) {
    return { ok: false, error: "Dog not found" };
  }

  const { dogId, ...rest } = parsed.data;
  db.update(dogs)
    .set({
      ...Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, v === "" ? null : v]),
      ),
      updatedAt: new Date(),
    })
    .where(eq(dogs.id, dogId))
    .run();

  revalidatePath("/dog");
  revalidatePath("/today");
  return { ok: true, dogId };
}

export async function requestShortPlanAction(dogId: string): Promise<DogActionResult> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Please sign in first" };

  const dog = db.select().from(dogs).where(eq(dogs.id, dogId)).get();
  if (!dog || dog.ownerId !== user.id) {
    return { ok: false, error: "Dog not found" };
  }

  try {
    getOrCreateDailyPlan({ dogId, ownerId: user.id, shortPlan: true });
  } catch (error) {
    console.error("Short plan generation failed", error);
    return {
      ok: false,
      error: "Could not build a short plan just now. Please try again in a moment.",
    };
  }
  revalidatePath("/today");
  return { ok: true, dogId };
}
