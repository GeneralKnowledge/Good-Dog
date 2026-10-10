import Link from "next/link";
import { redirect } from "next/navigation";
import { GuestContinueButton } from "@/components/GuestContinueButton";
import { InstallSplash } from "@/components/InstallSplash";
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
      <InstallSplash mode="landing" />
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
            <Link href="/sign-up" className="btn btn-primary w-full">
              Get started
            </Link>
            <Link href="/sign-in" className="btn btn-secondary w-full">
              Sign in
            </Link>
            <GuestContinueButton />
            <p className="px-1 pt-1 text-center text-xs leading-relaxed text-muted md:text-left">
              Guests can try the full app. Create an account later from My dog to keep progress
              across devices.
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
