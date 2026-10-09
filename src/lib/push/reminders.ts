import { and, eq } from "drizzle-orm";
import { localDateString, localTimeHm } from "@/lib/dates";
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
    // Due once the local clock reaches the chosen time (works with 5–15 min cron).
    if (hm < user.reminderLocalTime) {
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

    const subs = db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, user.id))
      .all();

    if (subs.length === 0) {
      skipped += 1;
      continue;
    }

    const dogName = dog.name;
    const payload = JSON.stringify({
      title: "Good Dog",
      body: `A few quiet minutes with ${dogName}? Today’s plan is ready.`,
      url: "/today",
    });

    let delivered = false;
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        );
        delivered = true;
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
            userId: user.id,
            statusCode,
          });
        }
      }
    }

    if (delivered) {
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
