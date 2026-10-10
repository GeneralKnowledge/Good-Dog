import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { InstallSplash } from "@/components/InstallSplash";
import { requireUser } from "@/lib/auth/session";
import { getDogForOwner } from "@/lib/services/dogs";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const dog = getDogForOwner(user.id);
  if (!dog?.onboardingComplete) redirect("/onboarding");

  return (
    <div className="app-frame">
      <div className="app-frame__body">{children}</div>
      <InstallSplash mode="in-app" />
      <BottomNav />
    </div>
  );
}
