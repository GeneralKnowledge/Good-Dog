"use client";

import { useActionState } from "react";
import type { DogActionResult } from "@/lib/actions/dogs";

export function OnboardingForm({
  action,
}: {
  action: (prev: DogActionResult | null, formData: FormData) => Promise<DogActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="field">
        <label htmlFor="name">Dog’s name</label>
        <input id="name" name="name" required maxLength={40} placeholder="e.g. Moss" />
      </div>

      <div className="field">
        <label htmlFor="lifeStage">Life stage</label>
        <select id="lifeStage" name="lifeStage" required defaultValue="adult">
          <option value="young_puppy">Young puppy (under ~4 months)</option>
          <option value="older_puppy">Older puppy (~4–12 months)</option>
          <option value="adolescent">Adolescent</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="primaryReason">What would you most like help with?</label>
        <input
          id="primaryReason"
          name="primaryReason"
          required
          maxLength={200}
          placeholder="e.g. Everyday manners, recall, calmer walks"
        />
      </div>

      <div className="field">
        <label htmlFor="availableTime">How much time do you usually have?</label>
        <select id="availableTime" name="availableTime" required defaultValue="about_10">
          <option value="few_minutes">A few minutes</option>
          <option value="about_10">Around 10 minutes</option>
          <option value="more">A bit more than 10 minutes</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="trainingExperience">Your training experience</label>
        <select
          id="trainingExperience"
          name="trainingExperience"
          required
          defaultValue="new"
        >
          <option value="new">New to training</option>
          <option value="some">Some experience</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="preferredRewards">Preferred rewards (optional)</label>
        <input
          id="preferredRewards"
          name="preferredRewards"
          maxLength={120}
          placeholder="Food, toys, praise…"
        />
      </div>

      {state && !state.ok ? (
        <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Creating today’s plan…" : "Create my first plan"}
      </button>
    </form>
  );
}
