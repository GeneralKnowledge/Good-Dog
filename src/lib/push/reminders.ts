import { and, eq } from "drizzle-orm";
import { isReminderDueAt, localDateString, localTimeHm } from "@/lib/dates";
import { db } from "@/lib/db";
import { dailyPlans, dogs, pushSubscriptions, users } from "@/lib/db/schema";
import { configureWebPush, webpush } from "@/lib/push/vapid";
import type { PlanItem } from "@/lib/types";

function planNeedsReminder(itemsJson: string, completionState: string): boolean {
  if (completionState === "completed") return false;
  try {
    const items = JSON.parse(itemsJson) as PlanItem[];
    if (items.length === 0) return true;
    return items.some((item) => !item.completedSessionId);
  } catch {
    return true;
  }
}

export async function sendPushToUser(options: {
  userId: string;
  title: string;
  body: string;
  url?: string;
}): Promise<{ delivered: number; removed: number }> {
  if (!configureWebPush()) {
    throw new Error("Push is not configured (missing VAPID env vars)");
  }

  const subs = db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, options.userId))
    .all();

  if (subs.length === 0) {
    return { delivered: 0, removed: 0 };
  }

  const payload = JSON.stringify({
    title: options.title,
    body: options.body,
    url: options.url ?? "/today",
  });

  let delivered = 0;
  let removed = 0;

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload,
      );
      delivered += 1;
    } catch (error) {
      const statusCode =
        typeof error === "object" &&
        error &&
        "statusCode" in error &&
        typeof (error as { statusCode: unknown }).statusCode === "number"
          ? (error as { statusCode: number }).statusCode
          : null;
      if (statusCode === 404 || statusCode === 410) {
        db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id)).run();
        removed += 1;
      } else {
        console.error("Push send failed", {
          userId: options.userId,
          statusCode,
        });
      }
    }
  }

  return { delivered, removed };
}

export async function sendDueTrainingReminders(now: Date = new Date()): Promise<{
  considered: number;
  sent: number;
  skipped: number;
  removed: number;
}> {
  if (!configureWebPush()) {
    throw new Error("Push is not configured (missing VAPID env vars)");
  }

  const enabledUsers = db
    .select()
    .from(users)
    .where(eq(users.reminderEnabled, true))
    .all();

  let considered = 0;
  let sent = 0;
  let skipped = 0;
  let removed = 0;

  for (const user of enabledUsers) {
    considered += 1;
    const tz = user.timezone || "Europe/London";
    const today = localDateString(now, tz);
    const hm = localTimeHm(now, tz);

    if (user.reminderLastSentDate === today) {
      skipped += 1;
      continue;
    }
    // Only within a short window after the chosen time (works with 5–15 min cron).
    if (
      !isReminderDueAt({
        nowHm: hm,
        reminderHm: user.reminderLocalTime,
        windowMinutes: 20,
      })
    ) {
      skipped += 1;
      continue;
    }

    const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
    if (!dog?.onboardingComplete) {
      skipped += 1;
      continue;
    }

    const plan = db
      .select()
      .from(dailyPlans)
      .where(and(eq(dailyPlans.dogId, dog.id), eq(dailyPlans.planDate, today)))
      .get();

    // Remind if there is no plan yet, or an open incomplete plan.
    if (plan && !planNeedsReminder(plan.itemsJson, plan.completionState)) {
      skipped += 1;
      continue;
    }

    const result = await sendPushToUser({
      userId: user.id,
      title: "Good Dog",
      body: `A few quiet minutes with ${dog.name}? Today’s plan is ready.`,
      url: "/today",
    });
    removed += result.removed;

    if (result.delivered > 0) {
      db.update(users)
        .set({ reminderLastSentDate: today, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .run();
      sent += 1;
    } else {
      skipped += 1;
    }
  }

  return { considered, sent, skipped, removed };
}
