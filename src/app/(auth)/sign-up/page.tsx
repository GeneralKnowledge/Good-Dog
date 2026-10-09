import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { GuestContinueButton } from "@/components/GuestContinueButton";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 flex-col px-5 py-8">
      <Link href="/" className="font-display text-2xl text-brand-deep">
        Good Dog
      </Link>
      <h1 className="mt-6 font-display text-3xl">Create your account</h1>
      <p className="mt-2 text-muted">
        We’ll keep your dog’s profile and training history private to you.
      </p>
      <div className="card mt-6 p-5">
        <AuthForm action={signUpAction} submitLabel="Create account" mode="sign-up" />
      </div>
      <div className="mt-4">
        <GuestContinueButton className="btn btn-secondary w-full" label="Continue as guest instead" />
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
