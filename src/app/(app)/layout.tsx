import { redirect } from "next/navigation";
import { PrimaryNav } from "@/components/PrimaryNav";
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
    <div className="app-frame app-frame--responsive">
      <PrimaryNav variant="sidebar" />
      <div className="app-frame__main">
        <div className="app-frame__body">{children}</div>
        <InstallSplash mode="in-app" />
        <PrimaryNav variant="bottom" />
      </div>
    </div>
  );
}
