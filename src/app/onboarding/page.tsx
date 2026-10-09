import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createDogAction } from "@/lib/actions/dogs";
import { requireUser } from "@/lib/auth/session";
import { OnboardingForm } from "@/components/OnboardingForm";
import { db } from "@/lib/db";
import { dogs } from "@/lib/db/schema";

export default async function OnboardingPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const existing = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  if (existing?.onboardingComplete) {
    redirect("/today");
  }

  return (
    <main className="flex flex-1 flex-col px-5 py-8">
      <p className="font-display text-2xl text-brand-deep">Good Dog</p>
      <h1 className="mt-5 font-display text-3xl leading-tight">Tell us about your dog</h1>
      <p className="mt-2 text-muted leading-relaxed">
        Just the essentials — enough to suggest a useful first plan. You can edit this later.
      </p>
      <div className="card mt-6 p-5">
        <OnboardingForm action={createDogAction} />
      </div>
    </main>
  );
}
