import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="px-5 py-8">
      <Link href="/" className="font-display text-2xl text-brand-deep">
        Good Dog
      </Link>
      <h1 className="mt-6 font-display text-3xl">Privacy notice</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Good Dog stores your account email, dog profile details you provide, daily plans, and
          training session feedback so the app can suggest suitable practice and show your history.
        </p>
        <p>
          We do not sell personal data. Training notes are private to your account. Server-side
          access controls prevent other owners from reading your dogs or sessions.
        </p>
        <p>
          If optional AI help is enabled by an API key in the server environment, questions you
          submit to that helper may be sent to the configured provider. The core app works without
          AI.
        </p>
        <p>
          You can delete your account and associated dog, plan, and session data from the My dog
          screen.
        </p>
        <p>
          Good Dog provides general reward-based training guidance. It is not veterinary care,
          medical advice, or an individual behaviour assessment, and it is not affiliated with or
          endorsed by any training organisation unless explicitly documented.
        </p>
      </div>
      <Link href="/dog" className="btn btn-secondary mt-8 inline-flex">
        Back
      </Link>
    </main>
  );
}
