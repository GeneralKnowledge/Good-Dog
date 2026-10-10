import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PlanCard } from "@/components/PlanCard";
import { ShortPlanButton } from "@/components/ShortPlanButton";
import { getExerciseById } from "@/lib/content/exercises";
import { greetingForHour } from "@/lib/dates";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs, trainingSessions } from "@/lib/db/schema";
import { getOrCreateDailyPlan } from "@/lib/services/plans";
import type { PlanItem } from "@/lib/types";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  if (!dog) redirect("/onboarding");

  const params = await searchParams;
  const plan = getOrCreateDailyPlan({ dogId: dog.id, ownerId: user.id });
  const items = JSON.parse(plan.itemsJson) as PlanItem[];
  const completedCount = items.filter((i) => i.completedSessionId).length;
  const allDone = plan.completionState === "completed" || completedCount === items.length;
  const progressPct = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const recentWin = db
    .select()
    .from(trainingSessions)
    .where(
      and(eq(trainingSessions.dogId, dog.id), eq(trainingSessions.outcome, "easy")),
    )
    .orderBy(desc(trainingSessions.completedAt))
    .limit(1)
    .get();

  const firstOpenIndex = items.findIndex((i) => !i.completedSessionId);

  return (
    <main>
      <AppHeader
        title={`Today with ${dog.name}`}
        subtitle={`${greetingForHour()} — two or three quiet minutes is enough.`}
      />

      {params.welcome === "1" ? (
        <div className="mx-5 mb-4 why-band text-sm leading-relaxed text-brand-deep fade-up">
          Welcome — you and {dog.name} are ready. We’ll suggest a few small activities each day.
          Start with whichever feels easiest.
        </div>
      ) : null}

      <div className="mx-5 mb-5 fade-up fade-up-delay-1">
        <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold text-brand-deep">
            {allDone
              ? "Today’s plan is complete"
              : `${completedCount} of ${items.length} done`}
          </span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {allDone ? (
        <section className="mx-5 mb-5 panel p-5 fade-up">
          <h2 className="font-display text-2xl text-brand-deep">That’s enough for today</h2>
          <p className="mt-2 leading-relaxed text-muted">
            You and {dog.name} put in a little practice. That’s how skills grow.
          </p>
          {recentWin ? (
            <p className="mt-3 text-sm text-brand-deep">
              Recent win: an exercise felt comfortable — we’ll keep building from there.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="flex flex-col gap-3 px-5 pb-4">
        {items.map((item, index) => {
          const exercise = getExerciseById(item.exerciseId);
          if (!exercise) return null;
          return (
            <PlanCard
              key={item.id}
              item={item}
              exercise={exercise}
              dogId={dog.id}
              planId={plan.id}
              emphasize={index === firstOpenIndex}
            />
          );
        })}
      </section>

      {!allDone && !plan.isShortPlan ? (
        <div className="px-5 pb-6">
          <ShortPlanButton dogId={dog.id} />
        </div>
      ) : null}
    </main>
  );
}
