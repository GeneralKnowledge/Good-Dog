import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { getExerciseById } from "@/lib/content/exercises";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, exerciseVersions, ownerTermProgress } from "@/lib/db/schema";
import type { TermExposureState } from "@/lib/types";

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

  const progressRows = db
    .select()
    .from(ownerTermProgress)
    .where(eq(ownerTermProgress.ownerId, user.id))
    .all();

  const termExposure: Record<string, TermExposureState> = {};
  for (const row of progressRows) {
    termExposure[row.termId] = row.state;
  }

  return (
    <main className="pb-8">
      <header className="px-5 pt-6">
        <Link href="/today" className="text-sm font-semibold text-brand-deep">
          ← Today
        </Link>
        <p className="mt-4 font-display text-lg text-brand-deep">Good Dog</p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-foreground">
          {content.title}
        </h1>
        <p className="mt-2 max-w-[36ch] text-muted leading-relaxed">{content.summary}</p>
      </header>
      <ExerciseRunner
        exercise={content}
        dogId={dog.id}
        dogName={dog.name}
        planId={query.planId}
        planItemId={query.itemId}
        exerciseVersionId={version.id}
        termExposure={termExposure}
      />
    </main>
  );
}
