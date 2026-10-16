"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { replacePlanItemAction } from "@/lib/actions/plans";
import {
  clearExerciseProgress,
  readExerciseProgress,
} from "@/lib/exercise-progress-storage";
import type { PlanItem } from "@/lib/coaching";

export function PlanItemActions({
  item,
  dogId,
  planId,
  exerciseSlug,
}: {
  item: PlanItem;
  dogId: string;
  planId: string;
  exerciseSlug: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [swapError, setSwapError] = useState<string | null>(null);
  const [canContinue, setCanContinue] = useState(false);

  const refreshProgress = useCallback(() => {
    const progress = readExerciseProgress(item.id);
    setCanContinue(
      Boolean(
        progress &&
          progress.planItemId === item.id &&
          progress.exerciseId === item.exerciseId &&
          progress.planId === planId,
      ),
    );
  }, [item.id, item.exerciseId, planId]);

  useEffect(() => {
    refreshProgress();
    const onUpdate = () => refreshProgress();
    window.addEventListener("storage", onUpdate);
    window.addEventListener("good-dog-exercise-progress", onUpdate);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("good-dog-exercise-progress", onUpdate);
    };
  }, [refreshProgress]);

  const href = `/exercise/${exerciseSlug}?dogId=${dogId}&planId=${planId}&itemId=${item.id}&versionId=${item.exerciseVersionId}`;

  const replaceLimit = 2;
  const swapsLeft = replaceLimit - (item.replaceCount ?? 0);
  const canSwap = swapsLeft > 0;

  function onSwap() {
    setSwapError(null);
    startTransition(async () => {
      const result = await replacePlanItemAction(planId, item.id);
      if (!result.ok) {
        setSwapError(result.error);
        return;
      }
      clearExerciseProgress(item.id);
      window.dispatchEvent(new Event("good-dog-exercise-progress"));
      router.refresh();
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-stretch gap-2 self-center">
      <Link href={href} className="btn btn-primary btn-compact">
        {canContinue ? "Continue" : "Start"}
      </Link>
      {canSwap ? (
        <button
          type="button"
          className="btn btn-ghost btn-compact text-xs"
          disabled={pending}
          onClick={onSwap}
        >
          {pending ? "Swapping…" : "Swap activity"}
        </button>
      ) : null}
      {swapError ? (
        <p className="max-w-[10rem] text-center text-xs leading-snug text-danger" role="alert">
          {swapError}
        </p>
      ) : null}
    </div>
  );
}
