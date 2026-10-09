import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { getExerciseById } from "@/lib/content/exercises";
import { getGlossaryTerm, getPublishedGlossary } from "@/lib/content/glossary";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, ownerTermProgress } from "@/lib/db/schema";

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const { termId } = await params;
  const term = getGlossaryTerm(termId);
  if (!term) notFound();

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();

  const now = new Date();
  const existing = db
    .select()
    .from(ownerTermProgress)
    .where(
      and(
        eq(ownerTermProgress.ownerId, user.id),
        eq(ownerTermProgress.termId, term.id),
      ),
    )
    .get();

  if (existing) {
    if (existing.state !== "explored") {
      db.update(ownerTermProgress)
        .set({ state: "explored", exploredAt: now, updatedAt: now })
        .where(eq(ownerTermProgress.id, existing.id))
        .run();
    }
  } else {
    db.insert(ownerTermProgress)
      .values({
        id: nanoid(),
        ownerId: user.id,
        termId: term.id,
        state: "explored",
        introducedAt: now,
        exploredAt: now,
        updatedAt: now,
      })
      .run();
  }

  const exposure = db
    .select()
    .from(ownerTermProgress)
    .where(
      and(
        eq(ownerTermProgress.ownerId, user.id),
        eq(ownerTermProgress.termId, term.id),
      ),
    )
    .get();

  const related = term.relatedTermIds
    .map((id) => getGlossaryTerm(id))
    .filter(Boolean);
  const exercises = term.relevantExerciseIds
    .map((id) => getExerciseById(id))
    .filter(Boolean);

  return (
    <main className="px-5 py-6 pb-10">
      <Link href="/learn" className="text-sm font-semibold text-brand-deep">
        ← Back to Learn
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">
        Training word
        {exposure?.state === "explored" ? " · Explored further" : ""}
      </p>
      <h1 className="mt-1 font-display text-3xl leading-tight">{term.preferredTerm}</h1>
      {term.alternativeTerms.length > 0 ? (
        <p className="mt-2 text-sm text-muted">
          You may also hear: {term.alternativeTerms.join(", ")}
        </p>
      ) : null}

      <section className="card mt-5 p-5">
        <h2 className="font-display text-xl">In plain English</h2>
        <p className="mt-2 leading-relaxed">{term.shortDefinition}</p>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="font-display text-xl">A little more depth</h2>
        <p className="mt-2 leading-relaxed text-muted">{term.deeperExplanation}</p>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="font-display text-xl">Example</h2>
        <p className="mt-2 leading-relaxed">{term.example}</p>
      </section>

      {term.commonMisunderstanding ? (
        <section className="mt-4 rounded-2xl bg-accent-soft p-4 text-sm leading-relaxed">
          <strong>Common mix-up: </strong>
          {term.commonMisunderstanding}
        </section>
      ) : null}

      {term.needsQualifiedReview ? (
        <section className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm leading-relaxed">
          <strong>Careful use:</strong> This idea has important nuance and is flagged for qualified
          review. Good Dog offers literacy and gentle everyday practice ideas only — not a treatment
          plan for fear, aggression, or resource guarding. If {dog?.name ?? "your dog"} seems
          worried, stiff, or unsafe around a trigger, pause and seek suitably qualified,
          reward-based professional help (and a vet if pain or sudden change is possible).
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-6">
          <h2 className="font-display text-xl">Related words</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {related.map((r) => (
              <li key={r!.id}>
                <Link
                  href={`/learn/glossary/${r!.id}`}
                  className="font-semibold text-brand-deep underline"
                >
                  {r!.preferredTerm}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {exercises.length > 0 && dog ? (
        <section className="mt-6">
          <h2 className="font-display text-xl">Try it in practice</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {exercises.map((ex) => (
              <li key={ex!.id} className="card p-4">
                <p className="font-semibold">{ex!.title}</p>
                <p className="mt-1 text-sm text-muted">{ex!.summary}</p>
                <Link
                  href={`/exercise/${ex!.id}?dogId=${dog.id}&versionId=${ex!.id}-v${ex!.contentVersion}`}
                  className="btn btn-secondary mt-3 w-full"
                >
                  Open exercise
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Good Dog’s glossary is original educational content for owners. It is not an official
        dictionary from any training organisation, and it is not a substitute for individual
        professional advice. Browse{" "}
        <Link href="/learn" className="underline">
          all terms
        </Link>{" "}
        ({getPublishedGlossary().length} published).
      </p>
    </main>
  );
}
