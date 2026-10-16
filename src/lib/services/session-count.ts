import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trainingSessions } from "@/lib/db/schema";

/** Completed practice sessions with feedback (used for guest save nudges). */
export const SESSIONS_BEFORE_GUEST_SAVE_NUDGE = 3;

export function countCompletedTrainingSessions(dogId: string): number {
  return db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.dogId, dogId))
    .all()
    .filter((session) => session.completedAt && session.outcome).length;
}
