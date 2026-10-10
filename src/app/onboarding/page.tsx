import { redirect } from "next/navigation";
import { createDogAction } from "@/lib/actions/dogs";
import { requireUser } from "@/lib/auth/session";
import { OnboardingForm } from "@/components/OnboardingForm";
import { SkipOnboardingButton } from "@/components/SkipOnboardingButton";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function OnboardingPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const existing = getDogForOwner(user.id);
  if (existing?.onboardingComplete) {
    redirect("/today");
  }

  return (
    <main className="marketing-shell flex flex-1 flex-col px-5 py-8">
      <p className="heading-subsection text-chrome">Good Dog</p>
      <h1 className="heading-section mt-5 text-chrome">Tell us about your dog</h1>
      <p className="mt-2 text-muted leading-relaxed">
        Just the essentials — enough to suggest a useful first plan. You can skip and edit later.
      </p>
      <div className="card mt-6 p-5">
        <OnboardingForm action={createDogAction} />
      </div>
      <div className="mt-4">
        <SkipOnboardingButton />
        <p className="mt-2 px-1 text-center text-xs leading-relaxed text-muted">
          We’ll use gentle defaults (adult dog, everyday manners, about 10 minutes). You can change
          this any time under My dog.
        </p>
      </div>
    </main>
  );
}
