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
      <section className="hero-bleed">
        <div
          className="hero-bleed__media"
          style={{ backgroundImage: "url(/hero-dog.jpg)" }}
          aria-hidden="true"
        />
        <div className="hero-bleed__veil" aria-hidden="true" />
        <div className="hero-bleed__content">
          <p className="font-display text-5xl tracking-tight fade-up">Good Dog</p>
          <h1 className="mt-6 max-w-[14ch] font-display text-[2rem] leading-[1.15] fade-up fade-up-delay-1">
            A few quiet minutes together, every day.
          </h1>
          <p className="mt-4 max-w-[30ch] text-base leading-relaxed text-white/85 fade-up fade-up-delay-2">
            Open the app. Find out what to practise today. Follow simple steps.
          </p>

          <div className="mt-auto flex flex-col gap-3 pt-14 fade-up fade-up-delay-3">
            <Link href="/sign-up" className="btn btn-primary w-full">
              Get started
            </Link>
            <Link
              href="/sign-in"
              className="btn w-full border border-white/35 bg-white/10 text-white backdrop-blur-sm"
            >
              Sign in
            </Link>
            <p className="px-1 pt-2 text-center text-xs leading-relaxed text-white/70">
              General reward-based training guidance for everyday life — not veterinary care or
              individual behaviour assessment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
