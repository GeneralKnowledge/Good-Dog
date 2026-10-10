"use client";

import { useTransition } from "react";
import { skipOnboardingWithDefaultsAction } from "@/lib/actions/dogs";

export function SkipOnboardingButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-ghost w-full"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void skipOnboardingWithDefaultsAction();
        });
      }}
    >
      {pending ? "Opening today’s plan…" : "Skip for now — show a starter plan"}
    </button>
  );
}
