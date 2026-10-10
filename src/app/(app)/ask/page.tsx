import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AskSearch } from "@/components/AskSearch";
import { getExerciseById, HELP_ARTICLES } from "@/lib/domains/dog-training";
import { requireUser } from "@/lib/auth/session";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function AskPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = getDogForOwner(user.id);
  if (!dog) redirect("/onboarding");

  const aiConfigured = Boolean(process.env.OPENAI_API_KEY);

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
        />
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Good Dog provides general training guidance, not veterinary care or individual behaviour
          assessment. For pain, illness, sudden changes, biting, or serious fear, seek a vet or a
          suitably qualified reward-based professional.
        </p>
      </div>
    </main>
  );
}
