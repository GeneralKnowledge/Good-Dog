"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { replaceOpenPlanItem } from "@/lib/services/plans";

export type ReplacePlanItemResult =
  | { ok: true; exerciseId: string }
  | { ok: false; error: string };

export async function replacePlanItemAction(
  planId: string,
  planItemId: string,
): Promise<ReplacePlanItemResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, error: "Please sign in first" };
  }

  const result = replaceOpenPlanItem({
    planId,
    planItemId,
    ownerId: user.id,
  });

  if (result.ok) {
    revalidatePath("/today");
  }

  return result;
}
