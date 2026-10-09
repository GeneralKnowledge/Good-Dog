"use client";

import { useTransition } from "react";
import { requestShortPlanAction } from "@/lib/actions/dogs";

export function ShortPlanButton({ dogId }: { dogId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-secondary w-full"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await requestShortPlanAction(dogId);
        });
      }}
    >
      {pending ? "Updating plan…" : "Short on time? Try one activity"}
    </button>
  );
}
