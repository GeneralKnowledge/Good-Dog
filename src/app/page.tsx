import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function HomePage() {
  const user = await requireUser();
  if (user) {
    const dog = getDogForOwner(user.id);
    redirect(dog?.onboardingComplete ? "/today" : "/onboarding");
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at 18% 8%, rgba(47,111,94,0.2), transparent 42%), radial-gradient(ellipse at 88% 4%, rgba(196,122,44,0.14), transparent 38%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] soft-pulse"
          aria-hidden="true"
          style={{
            backgroundImage: "url(/hero-dog.svg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            backgroundSize: "min(100%, 28rem) auto",
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col px-5 pb-10 pt-8">
          <p className="font-display text-4xl tracking-tight text-brand-deep fade-up">
            Good Dog
          </p>
          <h1 className="mt-8 max-w-[16ch] font-display text-4xl leading-[1.1] text-foreground fade-up">
            A few quiet minutes together, every day.
          </h1>
          <p className="mt-4 max-w-[32ch] text-lg leading-relaxed text-muted fade-up">
            Open the app. Find out what to practise today. Follow simple steps. Tell us how it went.
          </p>

          <div className="mt-auto flex flex-col gap-3 pt-12 fade-up">
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
        </div>
      </section>
    </main>
  );
}
