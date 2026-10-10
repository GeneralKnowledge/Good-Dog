import Link from "next/link";
import type { PlanItem } from "@/lib/coaching";
import type { ExerciseContent } from "@/lib/domains/dog-training/types";

export function PlanCard({
  item,
  exercise,
  dogId,
  planId,
  emphasize = false,
}: {
  item: PlanItem;
  exercise: ExerciseContent;
  dogId: string;
  planId: string;
  emphasize?: boolean;
}) {
  const done = Boolean(item.completedSessionId);

  return (
    <article
      className="plan-row fade-up"
      data-done={done ? "true" : "false"}
      data-emphasis={emphasize && !done ? "true" : "false"}
    >
      <div className="plan-row__body">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl leading-snug text-brand-deep">
            {exercise.title}
          </h2>
          {done ? (
            <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deep">
              Done
            </span>
          ) : null}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {exercise.estimatedMinutes} min · {placeHint(exercise)}
        </p>
        <p className="text-sm leading-relaxed text-muted">{exercise.summary}</p>
        <p className="text-sm leading-relaxed text-brand-deep">{item.whyToday}</p>
        {done ? (
          <p className="text-sm font-medium text-brand-deep">Nice work — done for today.</p>
        ) : null}
      </div>
      {!done ? (
        <Link
          href={`/exercise/${exercise.id}?dogId=${dogId}&planId=${planId}&itemId=${item.id}&versionId=${item.exerciseVersionId}`}
          className="btn btn-primary btn-compact shrink-0 self-center"
        >
          Start
        </Link>
      ) : null}
    </article>
  );
}

function placeHint(exercise: ExerciseContent): string {
  if (exercise.category === "walking" || exercise.category === "recall") {
    return "Quiet space";
  }
  return "Indoors";
}
