"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs } from "@/lib/db/schema";
import { getOrCreateDailyPlan } from "@/lib/services/plans";
import { onboardingSchema, updateDogSchema } from "@/lib/validation";

export type DogActionResult =
  | { ok: true; dogId?: string }
  | { ok: false; error: string };

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

  const dogId = nanoid();
  const data = parsed.data;

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

  getOrCreateDailyPlan({ dogId, ownerId: user.id });

  revalidatePath("/today");
  redirect("/today?welcome=1");
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

  getOrCreateDailyPlan({ dogId, ownerId: user.id, shortPlan: true });
  revalidatePath("/today");
  return { ok: true, dogId };
}
