import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AskSearch } from "@/components/AskSearch";
import { HELP_ARTICLES } from "@/lib/content/help";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs } from "@/lib/db/schema";

export default async function AskPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  if (!dog) redirect("/onboarding");

  const aiConfigured = Boolean(process.env.OPENAI_API_KEY);

  return (
    <main>
      <AppHeader
        title="Ask"
        subtitle={`Short answers about training with ${dog.name} — grounded in our glossary when we can.`}
      />
      <div className="px-5 pb-8">
        <AskSearch
          dogName={dog.name}
          initialArticles={HELP_ARTICLES}
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
