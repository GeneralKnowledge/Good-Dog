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
import { toDogSubject, getDogForOwner } from "@/lib/services/dogs";
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

  const subject = toDogSubject(dog);
  const params = await searchParams;

  let plan: ReturnType<typeof getOrCreateDailyPlan> | null = null;
  let planError: string | null = null;
  try {
    plan = getOrCreateDailyPlan({ dogId: dog.id, ownerId: user.id });
  } catch (error) {
    console.error("Today plan generation failed", error);
    planError =
      "We couldn’t build today’s plan just now. Refresh the page, or try again in a moment.";
  }

  const items = plan ? (JSON.parse(plan.itemsJson) as PlanItem[]) : [];
  const completedCount = items.filter((i) => i.completedSessionId).length;
  const allDone =
    Boolean(plan) &&
    (plan!.completionState === "completed" ||
      (items.length > 0 && completedCount === items.length));
  const progressPct = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);
  const firstOpenIndex = items.findIndex((i) => !i.completedSessionId);

  const recentSessions = db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.dogId, dog.id))
    .orderBy(desc(trainingSessions.completedAt))
    .limit(40)
    .all();

  const timezone = user.timezone || "Europe/London";
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
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title={`Today with ${subject.name}`}
        subtitle={`${greetingForHour()} — two or three quiet minutes is enough.`}
      />

      <div className="sheet flex flex-1 flex-col gap-4">
        {params.welcome === "1" ? (
          <div className="why-band text-sm leading-relaxed text-brand-deep fade-up">
            Welcome — you and {subject.name} are ready. We’ll suggest a few small activities each
            day. Start with whichever feels easiest.
          </div>
        ) : null}

        {planError ? (
          <section className="card p-5 fade-up" role="alert">
            <h2 className="heading-subsection">Plan unavailable</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{planError}</p>
            <a href="/today" className="btn btn-primary mt-4 w-full">
              Try again
            </a>
          </section>
        ) : null}

        {!planError ? (
          <div className="fade-up fade-up-delay-1">
            <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-brand-deep">
                {allDone
                  ? "Today’s plan is complete"
                  : `${completedCount} of ${items.length} done`}
              </span>
              {practisedDays > 0 ? (
                <span className="text-muted">{practisedDays} of last 7 days</span>
              ) : null}
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        ) : null}

        {allDone ? (
          <section className="panel p-5 fade-up">
            <h2 className="heading-section">That’s enough for today</h2>
            <p className="mt-2 leading-relaxed text-muted">
              You and {subject.name} put in a little practice. That’s how skills grow.
            </p>
            {recentWin ? (
              <p className="mt-3 text-sm text-brand-deep">
                Recent win: an exercise felt comfortable — we’ll keep building from there.
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          {items.map((item, index) => {
            const exercise = getExerciseById(item.exerciseId);
            if (!exercise || !plan) return null;
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

        {!planError && !allDone && plan && !plan.isShortPlan ? (
          <div className="pb-2">
            <ShortPlanButton dogId={dog.id} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
