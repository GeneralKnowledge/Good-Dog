import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { BottomNav } from "@/components/BottomNav";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dogs } from "@/lib/db/schema";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = db.select().from(dogs).where(eq(dogs.ownerId, user.id)).get();
  if (!dog?.onboardingComplete) redirect("/onboarding");

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 pb-4">{children}</div>
      <AddToHomeScreen />
      <BottomNav />
    </div>
  );
}
