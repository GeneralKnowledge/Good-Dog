import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { getExerciseById } from "@/lib/domains/dog-training";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, exerciseVersions } from "@/lib/db/schema";

export default async function ExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ exerciseId: string }>;
  searchParams: Promise<{
    dogId?: string;
    planId?: string;
    itemId?: string;
    versionId?: string;
  }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const { exerciseId } = await params;
  const query = await searchParams;

  const exercise = getExerciseById(exerciseId);
  if (!exercise) notFound();

  const dogId = query.dogId;
  if (!dogId) redirect("/today");

  const dog = db
    .select()
    .from(dogs)
    .where(and(eq(dogs.id, dogId), eq(dogs.ownerId, user.id)))
    .get();

  if (!dog) redirect("/today");

  const versionId = query.versionId ?? `${exercise.id}-v${exercise.contentVersion}`;
  const version = db
    .select()
    .from(exerciseVersions)
    .where(eq(exerciseVersions.id, versionId))
    .get();

  if (!version) notFound();

  // Prefer historical snapshot when available
  let content = exercise;
  try {
    content = JSON.parse(version.snapshotJson);
  } catch {
    content = exercise;
  }

  return (
    <main className="pb-8">
      <header className="px-5 pt-6">
        <Link href="/today" className="text-sm font-semibold text-brand-deep">
          ← Back to today
        </Link>
        <h1 className="mt-4 font-display text-3xl leading-tight">{content.title}</h1>
        <p className="mt-2 text-muted">{content.summary}</p>
        {dog.preferredRewards ? (
          <p className="mt-3 text-sm text-brand-deep">
            Preferred rewards for {dog.name}: {dog.preferredRewards}
          </p>
        ) : null}
      </header>
      <ExerciseRunner
        exercise={content}
        dogId={dog.id}
        dogName={dog.name}
        planId={query.planId}
        planItemId={query.itemId}
        exerciseVersionId={version.id}
      />
    </main>
  );
}
