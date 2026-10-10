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
    <main className="auth-shell flex min-h-dvh flex-1 flex-col px-5 py-8">
      <p className="font-display text-3xl tracking-tight text-chrome fade-up">Good Dog</p>
      <h1 className="mt-8 font-display text-3xl leading-tight text-chrome fade-up fade-up-delay-1">
        Tell us about your dog
      </h1>
      <p className="mt-2 leading-relaxed text-muted fade-up fade-up-delay-2">
        Just the essentials — enough to suggest a useful first plan. You can edit this later.
      </p>
      <div className="panel mt-6 p-5 fade-up fade-up-delay-3">
        <OnboardingForm action={createDogAction} />
      </div>
    </main>
  );
}
