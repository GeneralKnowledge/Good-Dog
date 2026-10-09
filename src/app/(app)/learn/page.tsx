import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { EXERCISE_LIBRARY, TOPIC_GROUPS } from "@/lib/content/exercises";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, ownerTermProgress } from "@/lib/db/schema";

export default async function LearnPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  if (!dog) redirect("/onboarding");

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
    <main>
      <AppHeader
        title="Learn"
        subtitle="Browse practical exercises, and look up training words when you want to understand them better."
      />

      <section className="mx-5 mb-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Training words</h2>
            <p className="mt-1 text-sm text-muted">
              Proper terminology with plain-English explanations. Today’s plan remains the main
              place to practise.
            </p>
          </div>
        </div>
        <GlossaryBrowser exposure={exposure} />
      </section>

      <div className="flex flex-col gap-5 px-5 pb-8">
        <h2 className="font-display text-2xl">Exercise topics</h2>
        {TOPIC_GROUPS.map((group) => {
          const exercises = EXERCISE_LIBRARY.filter(
            (e) =>
              e.topicGroup === group.id &&
              e.lifeStages.includes(dog.lifeStage),
          );
          if (exercises.length === 0) return null;
          return (
            <section key={group.id} className="fade-up">
              <h3 className="font-display text-xl">{group.title}</h3>
              <p className="mt-1 text-sm text-muted">{group.description}</p>
              <ul className="mt-3 flex flex-col gap-3">
                {exercises.map((exercise) => (
                  <li key={exercise.id} className="card p-4">
                    <h4 className="font-semibold leading-snug">{exercise.title}</h4>
                    <p className="mt-1 text-sm text-muted">{exercise.summary}</p>
                    <p className="mt-2 text-xs text-muted">
                      {exercise.estimatedMinutes} minutes
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
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
