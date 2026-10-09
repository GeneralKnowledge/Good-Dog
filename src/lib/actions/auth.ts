"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  dailyPlans,
  dogSkillProgress,
  dogs,
  ownerTermProgress,
  trainingSessions,
  users,
} from "@/lib/db/schema";
import { signInSchema, signUpSchema } from "@/lib/validation";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function signUpAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    return { ok: false, error: "An account with that email already exists" };
  }

  const id = nanoid();
  const passwordHash = await hashPassword(parsed.data.password);
  db.insert(users)
    .values({
      id,
      email,
      passwordHash,
      timezone: "Europe/London",
    })
    .run();

  await createSession(id);
  redirect("/onboarding");
}

export async function signInAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    return { ok: false, error: "Email or password is incorrect" };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Email or password is incorrect" };
  }

  await createSession(user.id);

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  redirect(dog?.onboardingComplete ? "/today" : "/onboarding");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function deleteAccountAction(): Promise<void> {
  const user = await requireUser();
  if (!user) {
    redirect("/sign-in");
  }

  const ownedDogs = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).all();
  for (const dog of ownedDogs) {
    db.delete(trainingSessions).where(eq(trainingSessions.dogId, dog.id)).run();
    db.delete(dailyPlans).where(eq(dailyPlans.dogId, dog.id)).run();
    db.delete(dogSkillProgress).where(eq(dogSkillProgress.dogId, dog.id)).run();
    db.delete(dogs).where(eq(dogs.id, dog.id)).run();
  }
  db.delete(ownerTermProgress).where(eq(ownerTermProgress.ownerId, user.id)).run();
  db.delete(users).where(eq(users.id, user.id)).run();
  await destroySession();
  redirect("/");
}
