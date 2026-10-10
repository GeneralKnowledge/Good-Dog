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
    <main className="landing-shell flex min-h-dvh flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pb-8 pt-10">
        <p className="font-display text-5xl tracking-tight text-chrome fade-up">Good Dog</p>
        <h1 className="mt-5 max-w-[16ch] font-display text-[1.85rem] leading-[1.15] text-chrome fade-up fade-up-delay-1">
          A few quiet minutes together, every day.
        </h1>
        <p className="mt-4 max-w-[32ch] text-base leading-relaxed text-[rgba(27,48,34,0.78)] fade-up fade-up-delay-2">
          Open the app. Find out what to practise today. Follow simple steps.
        </p>

        <div
          className="landing-photo mt-8 flex-1 fade-up fade-up-delay-2"
          style={{ backgroundImage: "url(/hero-dog.jpg)" }}
          role="img"
          aria-label="A person spending calm time with their dog at home"
        />

        <div className="mt-8 flex flex-col gap-3 fade-up fade-up-delay-3">
          <Link href="/sign-up" className="btn btn-primary w-full">
            Get started
          </Link>
          <Link href="/sign-in" className="btn btn-secondary w-full">
            Sign in
          </Link>
          <p className="px-1 pt-1 text-center text-xs leading-relaxed text-muted">
            General reward-based training guidance for everyday life — not veterinary care or
            individual behaviour assessment.
          </p>
        </div>
      </div>
    </main>
  );
}
