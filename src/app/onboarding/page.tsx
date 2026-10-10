import { redirect } from "next/navigation";
import { createDogAction } from "@/lib/actions/dogs";
import { requireUser } from "@/lib/auth/session";
import { OnboardingForm } from "@/components/OnboardingForm";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function OnboardingPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const existing = getDogForOwner(user.id);
  if (existing?.onboardingComplete) {
    redirect("/today");
  }

  return (
    <main className="landing-shell flex flex-1 flex-col px-5 py-8">
      <p className="font-display text-2xl text-chrome">Good Dog</p>
      <h1 className="mt-5 font-display text-3xl leading-tight text-chrome">
        Tell us about your dog
      </h1>
      <p className="mt-2 text-muted leading-relaxed">
        Just the essentials — enough to suggest a useful first plan. You can edit this later.
      </p>
      <div className="card mt-6 p-5">
        <OnboardingForm action={createDogAction} />
      </div>
    </main>
  );
}
