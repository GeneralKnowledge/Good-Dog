import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AskSearch } from "@/components/AskSearch";
import { getExerciseById, HELP_ARTICLES } from "@/lib/domains/dog-training";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ownerTermProgress } from "@/lib/db/schema";
import { getDogForOwner } from "@/lib/services/dogs";
import { ReferralsBlock } from "@/components/kb/ReferralsBlock";

export default async function AskPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = getDogForOwner(user.id);
  if (!dog) redirect("/onboarding");

  const aiConfigured = Boolean(process.env.OPENAI_API_KEY);

  const progressRows = db
    .select()
    .from(ownerTermProgress)
    .where(eq(ownerTermProgress.ownerId, user.id))
    .all();
  const termExposure: Record<string, "introduced" | "explored"> = {};
  for (const row of progressRows) {
    termExposure[row.termId] = row.state;
  }

  const articles = HELP_ARTICLES.map((article) => ({
    ...article,
    relatedExercises: (article.relatedExerciseIds ?? [])
      .map((id) => {
        const exercise = getExerciseById(id);
        if (!exercise) return null;
        return {
          id: exercise.id,
          title: exercise.title,
          versionId: `${exercise.id}-v${exercise.contentVersion}`,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null),
  }));

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Ask"
        subtitle={`Practical answers for ordinary training questions with ${dog.name}.`}
      />
      <div className="sheet flex flex-1 flex-col">
        <AskSearch
          dogId={dog.id}
          dogName={dog.name}
          initialArticles={articles}
          aiConfigured={aiConfigured}
          termExposure={termExposure}
        />
        <div className="mt-6">
          <ReferralsBlock compact />
        </div>
      </div>
    </main>
  );
}
