import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { AppHeader } from "@/components/AppHeader";
import { getExerciseById } from "@/lib/domains/dog-training";
import { getGlossaryTerm, getPublishedGlossary } from "@/lib/content/glossary";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ownerTermProgress } from "@/lib/db/schema";
import { getDogForOwner } from "@/lib/services/dogs";

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

  const dog = getDogForOwner(user.id);

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
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        backHref="/learn"
        backLabel="Learn"
        title={term.preferredTerm}
        subtitle={
          exposure?.state === "explored"
            ? "Training word · Explored further"
            : "Training word"
        }
      />

      <div className="sheet flex flex-1 flex-col gap-5">
        {term.alternativeTerms.length > 0 ? (
          <p className="text-sm text-muted">
            You may also hear: {term.alternativeTerms.join(", ")}
          </p>
        ) : null}

        <section>
          <h2 className="font-display text-xl text-brand-deep">In plain English</h2>
          <p className="mt-2 leading-relaxed">{term.shortDefinition}</p>
        </section>

        <hr className="hairline" />

        <section>
          <h2 className="font-display text-xl text-brand-deep">A little more depth</h2>
          <p className="mt-2 leading-relaxed text-muted">{term.deeperExplanation}</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-brand-deep">Example</h2>
          <p className="mt-2 leading-relaxed">{term.example}</p>
        </section>

        {term.commonMisunderstanding ? (
          <section className="rounded-2xl bg-accent-soft p-4 text-sm leading-relaxed">
            <strong>Common mix-up: </strong>
            {term.commonMisunderstanding}
          </section>
        ) : null}

        {term.needsQualifiedReview ? (
          <section className="rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm leading-relaxed">
            <strong>Careful use:</strong> This idea has important nuance and is flagged for qualified
            review. Good Dog offers literacy and gentle everyday practice ideas only — not a treatment
            plan for fear, aggression, or resource guarding. If {dog?.name ?? "your dog"} seems
            worried, stiff, or unsafe around a trigger, pause and seek suitably qualified,
            reward-based professional help (and a vet if pain or sudden change is possible).
          </section>
        ) : null}

        {related.length > 0 ? (
          <section>
            <h2 className="font-display text-xl text-brand-deep">Related words</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {related.map((r) => (
                <li key={r!.id}>
                  <Link
                    href={`/learn/glossary/${r!.id}`}
                    className="font-semibold text-brand-deep underline decoration-dashed underline-offset-2"
                  >
                    {r!.preferredTerm}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {exercises.length > 0 && dog ? (
          <section>
            <h2 className="font-display text-xl text-brand-deep">Try it in practice</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {exercises.map((ex) => (
                <li key={ex!.id} className="plan-row">
                  <div className="plan-row__body">
                    <p className="font-semibold">{ex!.title}</p>
                    <p className="mt-1 text-sm text-muted">{ex!.summary}</p>
                    <Link
                      href={`/exercise/${ex!.id}?dogId=${dog.id}&versionId=${ex!.id}-v${ex!.contentVersion}`}
                      className="btn btn-secondary mt-3 w-full"
                    >
                      Open exercise
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mb-2 text-xs leading-relaxed text-muted">
          Good Dog’s glossary is original educational content for owners. It is not an official
          dictionary from any training organisation, and it is not a substitute for individual
          professional advice. Browse{" "}
          <Link href="/learn" className="underline">
            all terms
          </Link>{" "}
          ({getPublishedGlossary().length} published).
        </p>
      </div>
    </main>
  );
}
