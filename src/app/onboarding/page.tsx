import { redirect } from "next/navigation";
import { createDogAction } from "@/lib/actions/dogs";
import { requireUser } from "@/lib/auth/session";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function OnboardingPage() {
  const user = await requireUser();
  if (!user) redirect("/");

  const existing = getDogForOwner(user.id);
  if (existing?.onboardingComplete) {
    redirect("/today");
  }

  return (
    <main className="marketing-shell flex flex-1 flex-col px-5 py-8">
      <OnboardingWizard createDogAction={createDogAction} />
    </main>
  );
}
