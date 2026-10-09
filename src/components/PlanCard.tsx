import Link from "next/link";
import type { ExerciseContent, PlanItem } from "@/lib/types";

export function PlanCard({
  item,
  exercise,
  dogId,
  planId,
}: {
  item: PlanItem;
  exercise: ExerciseContent;
  dogId: string;
  planId: string;
}) {
  const done = Boolean(item.completedSessionId);

  return (
    <article className={`card p-5 fade-up ${done ? "opacity-80" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl leading-snug">{exercise.title}</h2>
          <p className="mt-2 text-muted leading-relaxed">{exercise.summary}</p>
        </div>
        {done ? (
          <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deep">
            Done
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-muted">
        {exercise.estimatedMinutes} minutes · {placeHint(exercise)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-brand-deep">{item.whyToday}</p>
      {!done ? (
        <Link
          href={`/exercise/${exercise.id}?dogId=${dogId}&planId=${planId}&itemId=${item.id}&versionId=${item.exerciseVersionId}`}
          className="btn btn-primary mt-4 w-full"
        >
          Start exercise
        </Link>
      ) : (
        <p className="mt-4 text-sm font-medium text-brand-deep">Nice work — this one’s done for today.</p>
      )}
    </article>
  );
}

function placeHint(exercise: ExerciseContent): string {
  if (exercise.category === "walking" || exercise.category === "recall") {
    return "Quiet space";
  }
  return "Indoors";
}
