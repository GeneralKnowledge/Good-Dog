import Link from "next/link";

export function AppHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-5 pt-6 pb-3">
      <Link href="/today" className="font-display text-2xl tracking-tight text-brand-deep">
        Good Dog
      </Link>
      <h1 className="mt-3 font-display text-3xl leading-tight text-foreground">{title}</h1>
      {subtitle ? <p className="mt-2 text-muted leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}
