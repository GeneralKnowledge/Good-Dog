import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
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
    <div className="app-frame">
      <div className="app-frame__body">{children}</div>
      <BottomNav />
    </div>
  );
}
