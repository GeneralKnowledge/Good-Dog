"use client";

import { useActionState, useState } from "react";
import type { DogActionResult } from "@/lib/actions/dogs";

export function OnboardingForm({
  action,
}: {
  action: (prev: DogActionResult | null, formData: FormData) => Promise<DogActionResult>;
}) {
  const [showOptional, setShowOptional] = useState(false);
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

      <button
        type="button"
        className="btn btn-ghost self-start px-0"
        onClick={() => setShowOptional((v) => !v)}
      >
        {showOptional ? "Hide optional questions" : "Add optional details"}
      </button>

      {showOptional ? (
        <div className="flex flex-col gap-4 fade-up">
          <div className="field">
            <label htmlFor="breedOrMix">Breed or mix (optional)</label>
            <input id="breedOrMix" name="breedOrMix" maxLength={80} />
          </div>
          <div className="field">
            <label htmlFor="householdContext">Household context (optional)</label>
            <input
              id="householdContext"
              name="householdContext"
              maxLength={200}
              placeholder="e.g. Busy flat, children, other pets"
            />
          </div>
          <div className="field">
            <label htmlFor="alreadyEasy">What already feels easy? (optional)</label>
            <input id="alreadyEasy" name="alreadyEasy" maxLength={200} />
          </div>
          <div className="field">
            <label htmlFor="knownTriggers">Situations to manage carefully (optional)</label>
            <input id="knownTriggers" name="knownTriggers" maxLength={200} />
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
        </div>
      ) : (
        <>
          <input type="hidden" name="breedOrMix" value="" />
          <input type="hidden" name="householdContext" value="" />
          <input type="hidden" name="alreadyEasy" value="" />
          <input type="hidden" name="knownTriggers" value="" />
          <input type="hidden" name="preferredRewards" value="" />
        </>
      )}

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
