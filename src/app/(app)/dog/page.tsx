import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DogProfileEditor } from "@/components/DogProfileEditor";
import { getExerciseById } from "@/lib/content/exercises";
import { getObjectiveLabel } from "@/lib/content/learning-objectives";
import { describeSkillState } from "@/lib/domain/progression";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogSkillProgress, dogs, trainingSessions } from "@/lib/db/schema";
import { deleteAccountAction, signOutAction } from "@/lib/actions/auth";

const LIFE_STAGE_LABELS: Record<string, string> = {
  young_puppy: "Young puppy",
  older_puppy: "Older puppy",
  adolescent: "Adolescent",
  adult: "Adult",
  senior: "Senior",
};

const TIME_LABELS: Record<string, string> = {
  few_minutes: "A few minutes",
  about_10: "Around 10 minutes",
  more: "A little more time",
};

export default async function DogPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  if (!dog) redirect("/onboarding");

  const progress = db
    .select()
    .from(dogSkillProgress)
    .where(eq(dogSkillProgress.dogId, dog.id))
    .all()
    .filter((p) => p.state !== "not_introduced");

  const history = db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.dogId, dog.id))
    .orderBy(desc(trainingSessions.completedAt))
    .limit(8)
    .all();

  const wins = history.filter((h) => h.outcome === "easy").slice(0, 3);

  return (
    <main>
      <AppHeader
        title={dog.name}
        emphasizeTitle
        subtitle={`${LIFE_STAGE_LABELS[dog.lifeStage] ?? dog.lifeStage} · usually ${TIME_LABELS[dog.availableTime]?.toLowerCase() ?? "a short session"}`}
      />

      <section className="mx-5 mb-6">
        <p className="section-label">Current focus</p>
        <p className="mt-2 leading-relaxed text-muted">{dog.primaryReason}</p>
        {dog.preferredRewards ? (
          <p className="mt-3 text-sm text-muted">Preferred rewards: {dog.preferredRewards}</p>
        ) : null}
      </section>

      <hr className="mx-5 hairline" />

      <section className="mx-5 my-6">
        <h2 className="font-display text-xl text-brand-deep">Skills in progress</h2>
        {progress.length === 0 ? (
          <p className="mt-2 text-muted leading-relaxed">
            No practised skills yet. Complete an activity from Today and we’ll summarise what you’re
            working on here.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {progress.map((item) => {
              const description = describeSkillState(item.state);
              if (!description) return null;
              return (
                <li key={item.id} className="rounded-xl bg-brand-soft/70 px-3 py-3">
                  <p className="font-semibold">{getObjectiveLabel(item.learningObjectiveId)}</p>
                  <p className="mt-1 text-sm text-muted">{description}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <hr className="mx-5 hairline" />

      <section className="mx-5 my-6">
        <h2 className="font-display text-xl text-brand-deep">Recent practice</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-muted">
            Nothing recorded yet — history appears after the first session.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col">
            {history.map((session, i) => {
              const exercise = getExerciseById(session.exerciseId);
              return (
                <li
                  key={session.id}
                  className={`py-3 ${i > 0 ? "border-t border-line" : ""}`}
                >
                  <p className="font-medium">{exercise?.title ?? "Exercise"}</p>
                  <p className="mt-1 text-sm text-muted">
                    {labelOutcome(session.outcome)}
                    {session.welfareConcern ? " · comfort noted" : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {wins.length > 0 ? (
          <p className="mt-4 text-sm text-brand-deep">
            Recent comfortable session
            {wins.length > 1 ? "s" : ""}:{" "}
            {wins
              .map((w) => getExerciseById(w.exerciseId)?.title)
              .filter(Boolean)
              .join(", ")}
            .
          </p>
        ) : null}
      </section>

      <section className="mx-5 mb-6">
        <Link
          href="/shop"
          className="plan-row block text-brand-deep"
        >
          <p className="font-display text-lg">Shop kit ideas</p>
          <p className="mt-1 text-sm text-muted">
            Session treats and walk gear — optional, never required for the plan.
          </p>
        </Link>
      </section>

      <section className="mx-5 mb-4">
        <DogProfileEditor dog={dog} />
      </section>

      <section className="mx-5 mb-8 flex flex-col gap-3">
        <form action={signOutAction}>
          <button type="submit" className="btn btn-secondary w-full">
            Sign out
          </button>
        </form>
        <form action={deleteAccountAction}>
          <button type="submit" className="btn btn-ghost w-full text-danger">
            Delete account and training data
          </button>
        </form>
        <Link href="/privacy" className="text-center text-sm text-muted underline">
          Privacy notice
        </Link>
      </section>
    </main>
  );
}

function labelOutcome(outcome: string | null) {
  switch (outcome) {
    case "easy":
      return "Felt comfortable";
    case "getting_there":
      return "Getting there";
    case "too_difficult":
      return "Felt too difficult";
    default:
      return "Recorded";
  }
}
