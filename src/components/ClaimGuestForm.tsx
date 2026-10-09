"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { claimGuestAccountAction, type ActionResult } from "@/lib/actions/auth";

export function ClaimGuestForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (prev: ActionResult | null, formData: FormData) => {
      const result = await claimGuestAccountAction(prev, formData);
      if (result.ok) {
        router.refresh();
      }
      return result;
    },
    null,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-4">
      <div className="field">
        <label htmlFor="claim-email">Email</label>
        <input
          id="claim-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <div className="field">
        <label htmlFor="claim-password">Password</label>
        <input
          id="claim-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>
      {state && !state.ok ? (
        <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand-deep" role="status">
          Account saved. You can sign in with this email on any device.
        </p>
      ) : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save my progress"}
      </button>
    </form>
  );
}
