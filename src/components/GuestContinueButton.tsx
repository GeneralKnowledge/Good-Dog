"use client";

import { useTransition } from "react";
import { continueAsGuestAction } from "@/lib/actions/auth";

export function GuestContinueButton({
  className = "btn btn-ghost w-full",
  label = "Continue as guest",
}: {
  className?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void continueAsGuestAction();
        });
      }}
    >
      {pending ? "Starting…" : label}
    </button>
  );
}
