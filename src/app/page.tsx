import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs } from "@/lib/db/schema";

export default async function HomePage() {
  const user = await requireUser();
  if (user) {
    const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
    redirect(dog?.onboardingComplete ? "/today" : "/onboarding");
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 pb-10 pt-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at 20% 10%, rgba(47,111,94,0.18), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(196,122,44,0.16), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.2), transparent 50%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 soft-pulse"
          aria-hidden="true"
          style={{
            background:
              "url(\"data:image/svg+xml,%3Csvg width='160' height='80' viewBox='0 0 160 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60c20-20 40-20 60 0s40 20 60 0 40-20 60 0v20H0z' fill='%232f6f5e' fill-opacity='0.08'/%3E%3C/svg%3E\") repeat-x bottom",
            backgroundSize: "160px 80px",
          }}
        />

        <p className="relative font-display text-4xl tracking-tight text-brand-deep fade-up">
          Good Dog
        </p>
        <h1 className="relative mt-8 max-w-[16ch] font-display text-4xl leading-[1.1] text-foreground fade-up">
          A few quiet minutes together, every day.
        </h1>
        <p className="relative mt-4 max-w-[32ch] text-lg leading-relaxed text-muted fade-up">
          Open the app. Find out what to practise today. Follow simple steps. Tell us how it went.
        </p>

        <div className="relative mt-auto flex flex-col gap-3 pt-12 fade-up">
          <Link href="/sign-up" className="btn btn-primary w-full">
            Get started
          </Link>
          <Link href="/sign-in" className="btn btn-secondary w-full">
            Sign in
          </Link>
          <p className="px-1 pt-2 text-center text-xs leading-relaxed text-muted">
            General reward-based training guidance for everyday life — not veterinary care or
            individual behaviour assessment.
          </p>
        </div>
      </section>
    </main>
  );
}
