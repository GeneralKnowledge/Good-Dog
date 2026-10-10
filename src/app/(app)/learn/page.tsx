import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import {
  dogTrainingPolicy,
  EXERCISE_LIBRARY,
  TOPIC_GROUPS,
  type DogSubject,
} from "@/lib/domains/dog-training";
import { requireUser } from "@/lib/auth/session";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function LearnPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = getDogForOwner(user.id);
  if (!dog) redirect("/onboarding");

  const subject: DogSubject = {
    id: dog.id,
    name: dog.name,
    lifeStage: dog.lifeStage as DogSubject["lifeStage"],
    availableTime: dog.availableTime as DogSubject["availableTime"],
    primaryReason: dog.primaryReason,
    trainingExperience: dog.trainingExperience as DogSubject["trainingExperience"],
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Learn"
        subtitle="A small library of practical topics. Today’s plan remains the easiest place to start."
      />
      <div className="sheet flex flex-1 flex-col gap-8">
        {TOPIC_GROUPS.map((group) => {
          const exercises = EXERCISE_LIBRARY.filter(
            (e) =>
              e.topicGroup === group.id &&
              e.lifeStages.includes(dog.lifeStage as DogSubject["lifeStage"]),
          ).sort(
            (a, b) =>
              dogTrainingPolicy.affinityScore(b, subject) -
              dogTrainingPolicy.affinityScore(a, subject),
          );
          if (exercises.length === 0) return null;
          return (
            <section key={group.id} className="fade-up">
              <h2 className="font-display text-2xl text-brand-deep">{group.title}</h2>
              <p className="mt-1 text-sm text-muted">{group.description}</p>
              <ul className="mt-3 flex flex-col gap-3">
                {exercises.map((exercise) => {
                  const matchesFocus =
                    dogTrainingPolicy.affinityScore(exercise, subject) >= 3;
                  return (
                    <li key={exercise.id} className="plan-row">
                      <div className="plan-row__body w-full">
                        <h3 className="font-semibold leading-snug text-brand-deep">
                          {exercise.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted">{exercise.summary}</p>
                        <p className="mt-2 text-xs text-muted">
                          {exercise.estimatedMinutes} minutes
                          {matchesFocus ? " · matches your focus" : ""}
                        </p>
                        <Link
                          href={`/exercise/${exercise.id}?dogId=${dog.id}&versionId=${exercise.id}-v${exercise.contentVersion}`}
                          className="btn btn-secondary mt-3 w-full"
                        >
                          Try this exercise
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
