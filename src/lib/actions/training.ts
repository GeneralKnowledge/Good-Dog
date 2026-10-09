"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { submitSessionFeedback } from "@/lib/services/sessions";
import { feedbackSchema } from "@/lib/validation";

export type FeedbackResult =
  | { ok: true; sessionId: string }
  | { ok: false; error: string };

export async function submitFeedbackAction(
  input: unknown,
): Promise<FeedbackResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Please sign in first" };
  }

  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid feedback" };
  }

  try {
    const session = submitSessionFeedback({
      ownerId: user.id,
      ...parsed.data,
    });
    revalidatePath("/today");
    revalidatePath("/dog");
    revalidatePath(`/exercise/${parsed.data.exerciseId}`);
    return { ok: true, sessionId: session.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save feedback";
    return { ok: false, error: message };
  }
}
