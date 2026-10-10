import Link from "next/link";

export function AppHeader({
  title,
  subtitle,
  brandHref = "/today",
  emphasizeTitle = false,
  backHref,
  backLabel,
}: {
  title?: string;
  subtitle?: string;
  brandHref?: string;
  /** When true, only brand shows in chrome — title lives in the sheet (e.g. My dog). */
  emphasizeTitle?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="chrome-header fade-up">
      {backHref ? (
        <Link
          href={backHref}
          className="chrome-back mb-3 inline-block text-sm font-semibold text-on-chrome-muted"
        >
          ← {backLabel ?? "Back"}
        </Link>
      ) : null}
      <Link href={brandHref} className="chrome-brand">
        Good Dog
      </Link>
      {!emphasizeTitle && title ? (
        <>
          <h1>{title}</h1>
          {subtitle ? <p className="chrome-sub">{subtitle}</p> : null}
        </>
      ) : null}
    </header>
  );
}
