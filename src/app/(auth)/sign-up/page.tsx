import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <main className="auth-shell flex min-h-dvh flex-1 flex-col px-5 py-8">
      <Link href="/" className="font-display text-3xl tracking-tight text-chrome fade-up">
        Good Dog
      </Link>
      <h1 className="mt-8 font-display text-3xl text-chrome fade-up fade-up-delay-1">
        Create your account
      </h1>
      <p className="mt-2 text-muted fade-up fade-up-delay-2">
        We’ll keep your dog’s profile and training history private to you.
      </p>
      <div className="panel mt-6 p-5 fade-up fade-up-delay-3">
        <AuthForm action={signUpAction} submitLabel="Create account" mode="sign-up" />
      </div>
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand-deep">
          Sign in
        </Link>
      </p>
    </main>
  );
}
