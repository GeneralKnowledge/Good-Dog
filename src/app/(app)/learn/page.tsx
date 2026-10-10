import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import {
  dogTrainingPolicy,
  EXERCISE_LIBRARY,
  TOPIC_GROUPS,
} from "@/lib/domains/dog-training";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ownerTermProgress } from "@/lib/db/schema";
import { getDogForOwner, toDogSubject } from "@/lib/services/dogs";

export default async function LearnPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = getDogForOwner(user.id);
  if (!dog) redirect("/onboarding");

  const subject = toDogSubject(dog);

  const progressRows = db
    .select()
    .from(ownerTermProgress)
    .where(eq(ownerTermProgress.ownerId, user.id))
    .all();

  const exposure: Record<string, "introduced" | "explored"> = {};
  for (const row of progressRows) {
    exposure[row.termId] = row.state;
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Learn"
        subtitle="Browse practical exercises, and look up training words when you want to understand them better."
      />
      <div className="sheet flex flex-1 flex-col gap-8">
        <section className="fade-up">
          <h2 className="heading-section">Training words</h2>
          <p className="mt-1 text-sm text-muted">
            Proper terminology with plain-English explanations. Today’s plan remains the main place
            to practise.
          </p>
          <div className="mt-3">
            <GlossaryBrowser exposure={exposure} />
          </div>
        </section>

        <hr className="hairline" />

        <section>
          <h2 className="heading-section">Exercise topics</h2>
          <div className="mt-4 flex flex-col gap-8">
            {TOPIC_GROUPS.map((group) => {
              const exercises = EXERCISE_LIBRARY.filter(
                (e) =>
                  e.topicGroup === group.id &&
                  e.lifeStages.includes(subject.lifeStage),
              ).sort(
                (a, b) =>
                  dogTrainingPolicy.affinityScore(b, subject) -
                  dogTrainingPolicy.affinityScore(a, subject),
              );
              if (exercises.length === 0) return null;
              return (
                <section key={group.id} className="fade-up">
                  <h3 className="heading-subsection">{group.title}</h3>
                  <p className="mt-1 text-sm text-muted">{group.description}</p>
                  <ul className="grid-cards-2 mt-3">
                    {exercises.map((exercise) => {
                      const matchesFocus =
                        dogTrainingPolicy.affinityScore(exercise, subject) >= 3;
                      return (
                        <li key={exercise.id} className="plan-row">
                          <div className="plan-row__body w-full">
                            <h4 className="font-semibold leading-snug text-brand-deep">
                              {exercise.title}
                            </h4>
                            <p className="mt-1 text-sm text-muted">{exercise.summary}</p>
                            <p className="mt-2 text-xs text-muted">
                              {exercise.estimatedMinutes} minutes
                              {matchesFocus ? " · matches your focus" : ""}
                              {(exercise.glossaryTermIds?.length ?? 0) > 0
                                ? ` · ${exercise.glossaryTermIds!.length} training words`
                                : ""}
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
        </section>
      </div>
    </main>
  );
}
