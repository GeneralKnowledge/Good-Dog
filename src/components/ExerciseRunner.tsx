"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { nanoid } from "nanoid";
import { submitFeedbackAction } from "@/lib/actions/training";
import type { ExerciseContent } from "@/lib/domains/dog-training/types";

export function ExerciseRunner({
  exercise,
  dogId,
  dogName,
  planId,
  planItemId,
  exerciseVersionId,
}: {
  exercise: ExerciseContent;
  dogId: string;
  dogName: string;
  planId?: string;
  planItemId?: string;
  exerciseVersionId: string;
}) {
  const router = useRouter();
  const noteId = useId();
  const [phase, setPhase] = useState<"guide" | "feedback" | "done">("guide");
  const [showHint, setShowHint] = useState(false);
  const [welfareConcern, setWelfareConcern] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [mutationId] = useState(() => nanoid());

  function sendFeedback(outcome: "easy" | "getting_there" | "too_difficult") {
    setError(null);
    startTransition(async () => {
      const result = await submitFeedbackAction({
        dogId,
        exerciseId: exercise.id,
        exerciseVersionId,
        dailyPlanId: planId,
        planItemId,
        outcome,
        welfareConcern,
        ownerNote: note || undefined,
        clientMutationId: mutationId,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setPhase("done");
      router.refresh();
    });
  }

  if (phase === "done") {
    return (
      <div className="card mx-5 my-4 p-5 fade-up">
        <h2 className="font-display text-2xl">That’s useful feedback</h2>
        <p className="mt-2 text-muted leading-relaxed">
          We’ll adjust the next step for {dogName}. A short session is enough for today if you
          want to stop here.
        </p>
        {welfareConcern ? (
          <p className="mt-4 rounded-xl bg-accent-soft px-3 py-3 text-sm leading-relaxed">
            Because {dogName} seemed uncomfortable, keep things easy and calm for now. If worry
            continues or you suspect pain, contact your vet.
          </p>
        ) : null}
        <Link href="/today" className="btn btn-primary mt-5 w-full">
          Back to today’s plan
        </Link>
      </div>
    );
  }

  if (phase === "feedback") {
    return (
      <div className="mx-5 my-4 flex flex-col gap-4 fade-up">
        <div className="card p-5">
          <h2 className="font-display text-2xl">How did that go?</h2>
          <p className="mt-2 text-muted">One tap is enough. Typing is optional.</p>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={pending}
              onClick={() => sendFeedback("easy")}
            >
              Easy — managed it comfortably
            </button>
            <button
              type="button"
              className="btn btn-secondary w-full"
              disabled={pending}
              onClick={() => sendFeedback("getting_there")}
            >
              Getting there — a bit tricky
            </button>
            <button
              type="button"
              className="btn btn-secondary w-full"
              disabled={pending}
              onClick={() => sendFeedback("too_difficult")}
            >
              Too difficult — we struggled
            </button>
          </div>

          <label className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-white p-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={welfareConcern}
              onChange={(e) => setWelfareConcern(e.target.checked)}
            />
            <span>
              {dogName} seemed worried, overwhelmed, or uncomfortable. We’ll simplify next time.
            </span>
          </label>

          <div className="field mt-4">
            <label htmlFor={noteId}>Optional note</label>
            <textarea
              id={noteId}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              placeholder="Anything useful to remember?"
            />
          </div>

          {error ? (
            <p className="mt-3 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setPhase("guide")}>
          Back to instructions
        </button>
      </div>
    );
  }

  return (
    <div className="mx-5 my-4 flex flex-col gap-4 pb-8 fade-up">
      <div className="card p-5">
        <p className="leading-relaxed">{exercise.purpose}</p>

        <h2 className="mt-6 font-display text-xl">Before you start</h2>
        <p className="mt-2 leading-relaxed text-muted">{exercise.preparation}</p>

        <h2 className="mt-6 font-display text-xl">Let’s practise</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-5 leading-relaxed">
          {exercise.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h2 className="mt-6 font-display text-xl">What to look for</h2>
        <p className="mt-2 leading-relaxed text-muted">{exercise.lookFor}</p>

        <h2 className="mt-6 font-display text-xl">If it feels difficult</h2>
        <p className="mt-2 leading-relaxed text-muted">{exercise.ifDifficult}</p>
      </div>

      {exercise.safetyNote ? (
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm leading-relaxed">
          <strong>Safety note:</strong> {exercise.safetyNote}
        </div>
      ) : null}

      {showHint ? (
        <div className="rounded-2xl bg-brand-soft px-4 py-3 text-sm leading-relaxed text-brand-deep fade-up">
          <strong>Hint:</strong> {exercise.hint}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button type="button" className="btn btn-primary w-full" onClick={() => setPhase("feedback")}>
          Finish and tell us how it went
        </button>
        <button
          type="button"
          className="btn btn-secondary w-full"
          onClick={() => setShowHint(true)}
        >
          Get a hint
        </button>
        <Link href="/today" className="btn btn-ghost w-full">
          Leave for now
        </Link>
      </div>
    </div>
  );
}
