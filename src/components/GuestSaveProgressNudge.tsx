import Link from "next/link";

export function GuestSaveProgressNudge({
  dogName,
  sessionCount,
  prominent,
}: {
  dogName: string;
  sessionCount: number;
  prominent?: boolean;
}) {
  if (prominent) {
    return (
      <section className="why-band fade-up" aria-labelledby="save-progress-heading">
        <h2 id="save-progress-heading" className="heading-subsection text-brand-deep">
          Worth saving {dogName}&apos;s progress
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          You&apos;ve logged {sessionCount} practice session
          {sessionCount === 1 ? "" : "s"} on this device. Add an email and password so you can sign
          in again without losing today&apos;s plan and history.
        </p>
        <Link
          href="#keep-progress"
          className="btn btn-primary mt-4 w-full sm:w-auto sm:min-w-[12rem]"
        >
          Create account
        </Link>
      </section>
    );
  }

  return null;
}
