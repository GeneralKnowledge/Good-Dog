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
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Learn"
        subtitle="Training words and short exercises you can browse anytime."
      />

      <div className="sheet flex flex-1 flex-col gap-8">
        <section>
          <h2 className="font-display text-2xl text-brand-deep">Training words</h2>
          <p className="mt-1 text-sm text-muted">
            Plain-English explanations. Today remains the main place to practise.
          </p>
          <div className="mt-4">
            <GlossaryBrowser exposure={exposure} />
          </div>
        </section>

        <hr className="hairline" />

        <div className="flex flex-col gap-8 pb-2">
          <div>
            <h2 className="font-display text-2xl text-brand-deep">Topics</h2>
            <p className="mt-1 text-sm text-muted">Pick something that fits the moment.</p>
          </div>
          {TOPIC_GROUPS.map((group) => {
            const exercises = EXERCISE_LIBRARY.filter(
              (e) =>
                e.topicGroup === group.id &&
                e.lifeStages.includes(dog.lifeStage),
            );
            if (exercises.length === 0) return null;
            return (
              <section key={group.id} className="fade-up">
                <h3 className="font-display text-xl text-brand-deep">{group.title}</h3>
                <p className="mt-1 text-sm text-muted">{group.description}</p>
                <ul className="mt-4 flex flex-col">
                  {exercises.map((exercise, i) => (
                    <li
                      key={exercise.id}
                      className={`py-4 ${i > 0 ? "border-t border-line" : ""}`}
                    >
                      <h4 className="font-semibold leading-snug text-brand-deep">
                        {exercise.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted">{exercise.summary}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
                        {exercise.estimatedMinutes} min
                        {(exercise.glossaryTermIds?.length ?? 0) > 0
                          ? ` · ${exercise.glossaryTermIds!.length} words`
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
      </div>
    </main>
  );
}
