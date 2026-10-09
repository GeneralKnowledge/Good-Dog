"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { pushSubscriptions, users } from "@/lib/db/schema";
import { isPushConfigured } from "@/lib/push/vapid";

export type ReminderActionResult =
  | { ok: true }
  | { ok: false; error: string };

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function savePushSubscriptionAction(input: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}): Promise<ReminderActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Not signed in" };
  }
  if (!isPushConfigured()) {
    return { ok: false, error: "Reminders are not configured on this server" };
  }
  if (!input.endpoint || !input.p256dh || !input.auth) {
    return { ok: false, error: "Invalid subscription" };
  }

  const existing = db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, input.endpoint))
    .get();

  if (existing) {
    db.update(pushSubscriptions)
      .set({
        userId: user.id,
        p256dh: input.p256dh,
        auth: input.auth,
        userAgent: input.userAgent ?? existing.userAgent,
        updatedAt: new Date(),
      })
      .where(eq(pushSubscriptions.id, existing.id))
      .run();
  } else {
    db.insert(pushSubscriptions)
      .values({
        id: nanoid(),
        userId: user.id,
        endpoint: input.endpoint,
        p256dh: input.p256dh,
        auth: input.auth,
        userAgent: input.userAgent ?? null,
      })
      .run();
  }

  return { ok: true };
}

export async function removePushSubscriptionAction(
  endpoint: string,
): Promise<ReminderActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Not signed in" };
  }
  const row = db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .get();
  if (row && row.userId === user.id) {
    db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, row.id)).run();
  }
  return { ok: true };
}

export async function updateReminderSettingsAction(
  _prev: ReminderActionResult | null,
  formData: FormData,
): Promise<ReminderActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Not signed in" };
  }

  const enabled = formData.get("reminderEnabled") === "on";
  const timeRaw = String(formData.get("reminderLocalTime") ?? "17:00");
  if (!TIME_RE.test(timeRaw)) {
    return { ok: false, error: "Choose a valid time" };
  }

  db.update(users)
    .set({
      reminderEnabled: enabled,
      reminderLocalTime: timeRaw,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .run();

  return { ok: true };
}
