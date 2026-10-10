"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, pushSubscriptions, users } from "@/lib/db/schema";
import { sendPushToUser } from "@/lib/push/reminders";
import { isPushConfigured } from "@/lib/push/vapid";

export type ReminderActionResult =
  | { ok: true; message?: string }
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

  const timeChanged = timeRaw !== user.reminderLocalTime;
  db.update(users)
    .set({
      reminderEnabled: enabled,
      reminderLocalTime: timeRaw,
      // If they pick a new time, allow that slot to fire today.
      reminderLastSentDate: timeChanged ? null : user.reminderLastSentDate,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .run();

  return { ok: true };
}

export async function getReminderDebugAction(): Promise<{
  ok: true;
  reminderEnabled: boolean;
  reminderLocalTime: string;
  reminderLastSentDate: string | null;
  timezone: string;
  subscriptionCount: number;
  pushConfigured: boolean;
} | { ok: false; error: string }> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Not signed in" };
  }
  const subscriptionCount = db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, user.id))
    .all().length;

  return {
    ok: true,
    reminderEnabled: user.reminderEnabled,
    reminderLocalTime: user.reminderLocalTime,
    reminderLastSentDate: user.reminderLastSentDate,
    timezone: user.timezone,
    subscriptionCount,
    pushConfigured: isPushConfigured(),
  };
}

export async function sendTestReminderAction(): Promise<ReminderActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Not signed in" };
  }
  if (!isPushConfigured()) {
    return { ok: false, error: "Reminders are not configured on this server" };
  }

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  const dogName = dog?.name ?? "your dog";

  try {
    const result = await sendPushToUser({
      userId: user.id,
      title: "Good Dog — test",
      body: `Notifications are working. A quiet minute with ${dogName} whenever you’re ready.`,
      url: "/today",
    });

    if (result.delivered === 0) {
      return {
        ok: false,
        error:
          "No active push subscription on this account yet. Turn reminders on (and allow notifications), preferably from the installed Home Screen app on iPhone.",
      };
    }

    return {
      ok: true,
      message: `Test notification sent to ${result.delivered} device${result.delivered === 1 ? "" : "s"}. Check your lock screen / notification shade.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send test notification";
    return { ok: false, error: message };
  }
}
