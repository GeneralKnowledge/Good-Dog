import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { LearnExerciseTopics } from "@/components/learn/LearnExerciseTopics";
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
          <div className="mt-4">
            <LearnExerciseTopics dogId={dog.id} subject={subject} />
          </div>
        </section>
      </div>
    </main>
  );
}
