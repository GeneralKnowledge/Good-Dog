import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PlanCard } from "@/components/PlanCard";
import { ShortPlanButton } from "@/components/ShortPlanButton";
import { getExerciseById } from "@/lib/domains/dog-training";
import {
  countPractisedDaysInLastWeek,
  greetingForHour,
  localDateString,
} from "@/lib/dates";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { trainingSessions } from "@/lib/db/schema";
import { getDogForOwner } from "@/lib/services/dogs";
import { getOrCreateDailyPlan } from "@/lib/services/plans";
import type { PlanItem } from "@/lib/coaching";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = getDogForOwner(user.id);
  if (!dog) redirect("/onboarding");

  const params = await searchParams;
  const plan = getOrCreateDailyPlan({ dogId: dog.id, ownerId: user.id });
  const items = JSON.parse(plan.itemsJson) as PlanItem[];
  const completedCount = items.filter((i) => i.completedSessionId).length;
  const allDone = plan.completionState === "completed" || completedCount === items.length;

  const recentSessions = db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.dogId, dog.id))
    .orderBy(desc(trainingSessions.completedAt))
    .limit(40)
    .all();

  const timezone = user.timezone;
  const recentDateKeys = new Set(
    recentSessions
      .filter((s) => s.completedAt)
      .map((s) => localDateString(s.completedAt!, timezone)),
  );
  const practisedDays = countPractisedDaysInLastWeek(recentDateKeys, timezone);

  const recentWin = db
    .select()
    .from(trainingSessions)
    .where(
      and(eq(trainingSessions.dogId, dog.id), eq(trainingSessions.outcome, "easy")),
    )
    .orderBy(desc(trainingSessions.completedAt))
    .limit(1)
    .get();

  return (
    <main>
      <AppHeader
        title={`Today’s plan for ${dog.name}`}
        subtitle={`${greetingForHour()}. Just a few minutes together is a good start.`}
      />

      {params.welcome === "1" ? (
        <div className="mx-5 mb-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm leading-relaxed text-brand-deep fade-up">
          Welcome — you and {dog.name} are ready. We’ll suggest a few small activities each day.
          Start with whichever feels easiest.
        </div>
      ) : null}

      <div className="px-5 pb-2 text-sm text-muted">
        {allDone
          ? "Today’s plan is complete"
          : `${completedCount} of ${items.length} activities done`}
        {practisedDays > 0 ? (
          <span>
            {" "}
            · practised {practisedDays} of the last 7 days
          </span>
        ) : null}
      </div>

      {allDone ? (
        <section className="mx-5 mb-4 card p-5 fade-up">
          <h2 className="font-display text-2xl">That’s enough for today</h2>
          <p className="mt-2 leading-relaxed text-muted">
            You and {dog.name} put in a little practice today. That’s how skills grow.
          </p>
          {recentWin ? (
            <p className="mt-3 text-sm text-brand-deep">
              Recent win: an exercise felt comfortable — we’ll keep building from there.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="flex flex-col gap-4 px-5 pb-4">
        {items.map((item) => {
          const exercise = getExerciseById(item.exerciseId);
          if (!exercise) return null;
          return (
            <PlanCard
              key={item.id}
              item={item}
              exercise={exercise}
              dogId={dog.id}
              planId={plan.id}
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
