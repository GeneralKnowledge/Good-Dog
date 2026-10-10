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
    <main>
      <AppHeader
        title="Learn"
        subtitle="A small library of practical topics. Today’s plan remains the easiest place to start."
      />
      <div className="flex flex-col gap-5 px-5 pb-8">
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
              <h2 className="font-display text-2xl">{group.title}</h2>
              <p className="mt-1 text-sm text-muted">{group.description}</p>
              <ul className="mt-3 flex flex-col gap-3">
                {exercises.map((exercise) => {
                  const matchesFocus =
                    dogTrainingPolicy.affinityScore(exercise, subject) >= 3;
                  return (
                    <li key={exercise.id} className="card p-4">
                      <h3 className="font-semibold leading-snug">{exercise.title}</h3>
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
