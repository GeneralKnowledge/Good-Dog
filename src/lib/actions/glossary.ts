"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getGlossaryTerm } from "@/lib/content/glossary";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ownerTermProgress } from "@/lib/db/schema";

export type GlossaryActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function markTermsIntroducedAction(
  termIds: string[],
): Promise<GlossaryActionResult> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Please sign in first" };

  const unique = [...new Set(termIds)].filter((id) => getGlossaryTerm(id));
  if (unique.length === 0) return { ok: true };

  const now = new Date();
  for (const termId of unique) {
    const existing = db
      .select()
      .from(ownerTermProgress)
      .where(
        and(
          eq(ownerTermProgress.ownerId, user.id),
          eq(ownerTermProgress.termId, termId),
        ),
      )
      .get();

    if (existing) continue;

    db.insert(ownerTermProgress)
      .values({
        id: nanoid(),
        ownerId: user.id,
        termId,
        state: "introduced",
        introducedAt: now,
        updatedAt: now,
      })
      .run();
  }

  revalidatePath("/learn");
  return { ok: true };
}

export async function markTermExploredAction(
  termId: string,
): Promise<GlossaryActionResult> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Please sign in first" };
  if (!getGlossaryTerm(termId)) {
    return { ok: false, error: "Unknown term" };
  }

  const now = new Date();
  const existing = db
    .select()
    .from(ownerTermProgress)
    .where(
      and(
        eq(ownerTermProgress.ownerId, user.id),
        eq(ownerTermProgress.termId, termId),
      ),
    )
    .get();

  if (existing) {
    db.update(ownerTermProgress)
      .set({
        state: "explored",
        exploredAt: now,
        updatedAt: now,
      })
      .where(eq(ownerTermProgress.id, existing.id))
      .run();
  } else {
    db.insert(ownerTermProgress)
      .values({
        id: nanoid(),
        ownerId: user.id,
        termId,
        state: "explored",
        introducedAt: now,
        exploredAt: now,
        updatedAt: now,
      })
      .run();
  }

  revalidatePath("/learn");
  revalidatePath(`/learn/glossary/${termId}`);
  return { ok: true };
}
