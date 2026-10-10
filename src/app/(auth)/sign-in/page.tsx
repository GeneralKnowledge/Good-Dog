import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <main className="landing-shell flex flex-1 flex-col px-5 py-8">
      <Link href="/" className="font-display text-2xl text-chrome">
        Good Dog
      </Link>
      <h1 className="mt-6 font-display text-3xl text-chrome">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to continue with today’s plan.</p>
      <div className="card mt-6 p-5">
        <AuthForm action={signInAction} submitLabel="Sign in" mode="sign-in" />
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
