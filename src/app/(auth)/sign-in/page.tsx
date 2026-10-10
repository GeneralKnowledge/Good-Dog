import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { GuestContinueButton } from "@/components/GuestContinueButton";

export default function SignInPage() {
  return (
    <main className="marketing-shell flex flex-1 flex-col px-5 py-8">
      <Link href="/" className="heading-subsection text-chrome">
        Good Dog
      </Link>
      <h1 className="heading-section mt-6 text-chrome">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to continue with today’s plan.</p>
      <div className="marketing-form-wrap card mt-6 p-5">
        <AuthForm action={signInAction} submitLabel="Sign in" mode="sign-in" />
      </div>
      <div className="mt-4">
        <GuestContinueButton className="btn btn-secondary w-full" />
      </div>
      <p className="mt-5 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/sign-up" className="font-semibold text-brand-deep">
          Create an account
        </Link>
      </p>
    </main>
  );
}
