import type { PlanItem } from "@/lib/coaching";
import type { ExerciseContent } from "@/lib/domains/dog-training/types";
import { PlanItemActions } from "@/components/PlanItemActions";

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
          <h2 className="heading-subsection leading-snug">
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
        <PlanItemActions
          item={item}
          dogId={dogId}
          planId={planId}
          exerciseSlug={exercise.id}
        />
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
