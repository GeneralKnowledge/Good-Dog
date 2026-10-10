import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { getExerciseById } from "@/lib/domains/dog-training";
import type { TermExposureState } from "@/lib/domains/dog-training/types";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, exerciseVersions, ownerTermProgress } from "@/lib/db/schema";

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
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        backHref="/today"
        backLabel="Today"
        title={content.title}
        subtitle={content.summary}
      />
      <div className="sheet flex flex-1 flex-col">
        {dog.preferredRewards ? (
          <p className="mb-2 text-sm text-brand-deep">
            Preferred rewards for {dog.name}: {dog.preferredRewards}
          </p>
        ) : null}
        <ExerciseRunner
          exercise={content}
          dogId={dog.id}
          dogName={dog.name}
          planId={query.planId}
          planItemId={query.itemId}
          exerciseVersionId={version.id}
          termExposure={termExposure}
        />
      </div>
    </main>
  );
}
