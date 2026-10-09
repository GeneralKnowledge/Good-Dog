"use client";

import { useActionState } from "react";
import { updateDogAction, type DogActionResult } from "@/lib/actions/dogs";
import type { Dog } from "@/lib/db/schema";

export function DogProfileEditor({ dog }: { dog: Dog }) {
  const [state, formAction, pending] = useActionState(updateDogAction, null as DogActionResult | null);

  return (
    <details className="card p-5">
      <summary className="cursor-pointer font-display text-xl">Edit profile</summary>
      <form action={formAction} className="mt-4 flex flex-col gap-4">
        <input type="hidden" name="dogId" value={dog.id} />
        <div className="field">
          <label htmlFor="edit-name">Name</label>
          <input id="edit-name" name="name" defaultValue={dog.name} required />
        </div>
        <div className="field">
          <label htmlFor="edit-lifeStage">Life stage</label>
          <select id="edit-lifeStage" name="lifeStage" defaultValue={dog.lifeStage}>
            <option value="young_puppy">Young puppy</option>
            <option value="older_puppy">Older puppy</option>
            <option value="adolescent">Adolescent</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="edit-primaryReason">Primary focus</label>
          <input
            id="edit-primaryReason"
            name="primaryReason"
            defaultValue={dog.primaryReason}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="edit-availableTime">Available time</label>
          <select
            id="edit-availableTime"
            name="availableTime"
            defaultValue={dog.availableTime}
          >
            <option value="few_minutes">A few minutes</option>
            <option value="about_10">Around 10 minutes</option>
            <option value="more">More than 10 minutes</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="edit-trainingExperience">Training experience</label>
          <select
            id="edit-trainingExperience"
            name="trainingExperience"
            defaultValue={dog.trainingExperience}
          >
            <option value="new">New to training</option>
            <option value="some">Some experience</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="edit-preferredRewards">Preferred rewards</label>
          <input
            id="edit-preferredRewards"
            name="preferredRewards"
            defaultValue={dog.preferredRewards ?? ""}
          />
        </div>
        {state && !state.ok ? (
          <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">{state.error}</p>
        ) : null}
        {state && state.ok ? (
          <p className="text-sm text-brand-deep">Profile updated.</p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </details>
  );
}
