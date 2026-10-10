"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  dogTrainingPolicy,
  EXERCISE_LIBRARY,
  TOPIC_GROUPS,
  type ExerciseContent,
} from "@/lib/domains/dog-training";
import type { DogSubject } from "@/lib/domains/dog-training/types";

const FOCUS_AFFINITY_MIN = 3;

export function LearnExerciseTopics({
  dogId,
  subject,
}: {
  dogId: string;
  subject: DogSubject;
}) {
  const [focusOnly, setFocusOnly] = useState(false);

  const groups = useMemo(() => {
    return TOPIC_GROUPS.map((group) => {
      let exercises = EXERCISE_LIBRARY.filter(
        (e) => e.topicGroup === group.id && e.lifeStages.includes(subject.lifeStage),
      ).sort(
        (a, b) =>
          dogTrainingPolicy.affinityScore(b, subject) -
          dogTrainingPolicy.affinityScore(a, subject),
      );
      if (focusOnly) {
        exercises = exercises.filter(
          (e) => dogTrainingPolicy.affinityScore(e, subject) >= FOCUS_AFFINITY_MIN,
        );
      }
      return { group, exercises };
    }).filter((entry) => entry.exercises.length > 0);
  }, [subject, focusOnly]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Exercise filters">
        <button
          type="button"
          className={`chip ${!focusOnly ? "chip--active" : ""}`}
          aria-pressed={!focusOnly}
          onClick={() => setFocusOnly(false)}
        >
          All exercises
        </button>
        <button
          type="button"
          className={`chip ${focusOnly ? "chip--active" : ""}`}
          aria-pressed={focusOnly}
          onClick={() => setFocusOnly(true)}
        >
          Matches your focus
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-muted">
          No exercises match your focus right now. Turn off the filter to browse everything for{" "}
          {subject.name}&apos;s life stage.
        </p>
      ) : null}

      {groups.map(({ group, exercises }) => (
        <section key={group.id} className="fade-up">
          <h3 className="heading-subsection">{group.title}</h3>
          <p className="mt-1 text-sm text-muted">{group.description}</p>
          <ul className="grid-cards-2 mt-3">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} dogId={dogId} subject={subject} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ExerciseCard({
  exercise,
  dogId,
  subject,
}: {
  exercise: ExerciseContent;
  dogId: string;
  subject: DogSubject;
}) {
  const matchesFocus =
    dogTrainingPolicy.affinityScore(exercise, subject) >= FOCUS_AFFINITY_MIN;

  return (
    <li className="plan-row">
      <div className="plan-row__body w-full">
        <h4 className="font-semibold leading-snug text-brand-deep">{exercise.title}</h4>
        <p className="mt-1 text-sm text-muted">{exercise.summary}</p>
        <p className="mt-2 text-xs text-muted">
          {exercise.estimatedMinutes} minutes
          {matchesFocus ? " · matches your focus" : ""}
          {(exercise.glossaryTermIds?.length ?? 0) > 0
            ? ` · ${exercise.glossaryTermIds!.length} training words`
            : ""}
        </p>
        <Link
          href={`/exercise/${exercise.id}?dogId=${dogId}&versionId=${exercise.id}-v${exercise.contentVersion}`}
          className="btn btn-secondary mt-3 w-full"
        >
          Try this exercise
        </Link>
      </div>
    </li>
  );
}
