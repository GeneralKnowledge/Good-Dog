"use client";

import { useState } from "react";
import type { DogActionResult } from "@/lib/actions/dogs";
import {
  ONBOARDING_GOALS,
  type OnboardingGoal,
  type OnboardingGoalId,
} from "@/lib/onboarding/goals";
import { OnboardingForm } from "@/components/OnboardingForm";
import { SkipOnboardingButton } from "@/components/SkipOnboardingButton";

type Step = "goals" | "dream" | "profile";

export function OnboardingWizard({
  createDogAction,
}: {
  createDogAction: (
    prev: DogActionResult | null,
    formData: FormData,
  ) => Promise<DogActionResult>;
}) {
  const [step, setStep] = useState<Step>("goals");
  const [selectedGoalId, setSelectedGoalId] = useState<OnboardingGoalId | null>(null);

  const selectedGoal: OnboardingGoal | undefined = selectedGoalId
    ? ONBOARDING_GOALS.find((g) => g.id === selectedGoalId)
    : undefined;

  if (step === "goals") {
    return (
      <div key="goals" className="fade-up">
        <p className="heading-subsection text-chrome">Good Dog</p>
        <h1 className="heading-section mt-5 text-chrome">What would feel like a win?</h1>
        <p className="mt-2 leading-relaxed text-muted">
          Pick the result that matters most right now. We’ll shape your first plan around it.
        </p>

        <ul className="mt-6 flex flex-col gap-2" role="list">
          {ONBOARDING_GOALS.map((goal) => {
            const active = selectedGoalId === goal.id;
            return (
              <li key={goal.id}>
                <button
                  type="button"
                  className={`plan-row w-full text-left transition-[box-shadow,background] duration-200 ${
                    active ? "ring-2 ring-brand/40" : ""
                  }`}
                  data-emphasis={active ? "true" : undefined}
                  aria-pressed={active}
                  onClick={() => setSelectedGoalId(goal.id)}
                >
                  <span className="plan-row__body block">
                    <span className="font-semibold text-ink">{goal.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{goal.subtitle}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="btn btn-primary mt-8 w-full"
          disabled={!selectedGoalId}
          onClick={() => setStep("dream")}
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === "dream" && selectedGoal) {
    return (
      <div key="dream" className="fade-up">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Your focus</p>
        <h1 className="heading-section mt-3 text-chrome">{selectedGoal.dreamHeadline}</h1>
        <p className="mt-4 leading-relaxed text-muted">{selectedGoal.dreamBody}</p>

        <div className="why-band mt-6">
          <p className="text-sm leading-relaxed text-ink">
            Good Dog gives you a few quiet minutes of practice each day — clear steps, honest
            feedback, and a plan that adjusts when life gets messy.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button type="button" className="btn btn-primary w-full" onClick={() => setStep("profile")}>
            Almost there — tell us about your dog
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full"
            onClick={() => setStep("goals")}
          >
            Choose a different focus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key="profile" className="fade-up">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">Almost done</p>
      <h1 className="heading-section mt-3 text-chrome">Tell us about your dog</h1>
      <p className="mt-2 leading-relaxed text-muted">
        Just the essentials — enough to suggest a useful first plan. You can skip and edit later.
      </p>
      {selectedGoal ? (
        <p className="mt-3 text-sm text-muted">
          Focus: <span className="font-medium text-ink">{selectedGoal.title}</span>
        </p>
      ) : null}

      <div className="marketing-form-wrap card mt-6 p-5">
        <OnboardingForm
          action={createDogAction}
          defaultPrimaryReason={selectedGoal?.primaryReason ?? ""}
          showPrimaryReasonField={false}
        />
      </div>
      <div className="mt-4">
        <SkipOnboardingButton />
        <p className="mt-2 px-1 text-center text-xs leading-relaxed text-muted">
          We’ll use gentle defaults (adult dog, everyday manners, about 10 minutes). You can change
          this any time under My dog.
        </p>
      </div>
      <button
        type="button"
        className="btn btn-ghost mt-4 w-full"
        onClick={() => setStep("dream")}
      >
        Back
      </button>
    </div>
  );
}
