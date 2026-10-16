import Link from "next/link";
import { redirect } from "next/navigation";
import { GuestContinueButton } from "@/components/GuestContinueButton";
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
      <div className="landing-layout px-5 pb-8 pt-10">
        <div className="landing-layout__copy flex flex-col">
          <p className="text-display-brand fade-up">Good Dog</p>
          <h1 className="heading-marketing mt-5 max-w-[16ch] fade-up fade-up-delay-1">
            A few quiet minutes together, every day.
          </h1>
          <p className="text-marketing-lead mt-4 max-w-[32ch] text-base leading-relaxed fade-up fade-up-delay-2">
            Open the app. Find out what to practise today. Follow simple steps.
          </p>

          <div className="mt-8 flex flex-col gap-3 fade-up fade-up-delay-3 md:mt-10">
            <GuestContinueButton className="btn btn-primary w-full" label="Start today" />
            <Link href="/sign-up" className="btn btn-secondary w-full">
              Create account
            </Link>
            <Link href="/sign-in" className="btn btn-ghost w-full">
              Sign in
            </Link>
            <p className="px-1 pt-1 text-center text-xs leading-relaxed text-muted md:text-left">
              Start today works on this device with no email. Save progress anytime from My dog.
            </p>
            <p className="px-1 pt-1 text-center text-xs leading-relaxed text-muted md:text-left">
              General reward-based training guidance for everyday life — not veterinary care or
              individual behaviour assessment.
            </p>
          </div>
        </div>

        <div
          className="landing-photo landing-layout__visual mt-8 flex-1 fade-up fade-up-delay-2 md:flex-none"
          style={{ backgroundImage: "url(/hero-dog.jpg)" }}
          role="img"
          aria-label="A person spending calm time with their dog at home"
        />
      </div>
    </main>
  );
}
