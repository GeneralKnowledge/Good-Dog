import { getEthicsDisclaimer, getReferrals } from "@/lib/domains/dog-training/kb-import";

export function ReferralsBlock({ compact = false }: { compact?: boolean }) {
  const referrals = getReferrals();
  const ethics = getEthicsDisclaimer();

  return (
    <section
      className={compact ? "text-sm" : "card p-4"}
      aria-label="When to get professional help"
    >
      {!compact ? (
        <h2 className="heading-subsection">When to get more help</h2>
      ) : (
        <p className="font-semibold text-brand-deep">When to get more help</p>
      )}
      <p className={`leading-relaxed text-muted ${compact ? "mt-2" : "mt-2"}`}>{ethics}</p>
      <ul className={`flex flex-col gap-3 ${compact ? "mt-3" : "mt-4"}`}>
        {referrals.map((ref) => (
          <li key={ref.id} className="rounded-xl bg-accent-soft px-3 py-3">
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-deep underline"
            >
              {ref.title}
            </a>
            <p className="mt-1 text-sm leading-relaxed text-muted">{ref.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
