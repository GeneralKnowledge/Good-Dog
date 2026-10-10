import Link from "next/link";

export function AppHeader({
  title,
  subtitle,
  brandHref = "/today",
  emphasizeTitle = false,
}: {
  title: string;
  subtitle?: string;
  brandHref?: string;
  /** When true, title is the hero (e.g. dog name on My dog). */
  emphasizeTitle?: boolean;
}) {
  return (
    <header className="px-5 pt-6 pb-4">
      <Link
        href={brandHref}
        className="font-display text-xl tracking-tight text-brand-deep fade-up"
      >
        Good Dog
      </Link>
      <h1
        className={`mt-3 font-display leading-[1.12] text-foreground fade-up fade-up-delay-1 ${
          emphasizeTitle ? "text-4xl" : "text-3xl"
        }`}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-[36ch] text-[0.98rem] leading-relaxed text-muted fade-up fade-up-delay-2">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
