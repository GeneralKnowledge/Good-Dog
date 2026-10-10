import type { KbGuide } from "@/lib/domains/dog-training/kb-import";

export function GuideProvenance({ guide }: { guide: KbGuide }) {
  const { provenance } = guide;
  return (
    <footer className="mt-8 rounded-xl border border-line bg-brand-soft/40 px-4 py-3 text-xs leading-relaxed text-muted">
      <p className="font-semibold text-brand-deep">Research basis</p>
      <p className="mt-1">
        Based on protocol{" "}
        <span className="font-mono text-[0.7rem]">{provenance.protocolId}</span>
        {provenance.reviewStatus ? ` · ${provenance.reviewStatus.replace(/_/g, " ")}` : null}
        {provenance.lastVerified ? ` · verified ${provenance.lastVerified}` : null}
      </p>
      <p className="mt-2">
        Good Dog paraphrases approved sources for owners — this is not a clinical treatment plan
        or professional endorsement.
      </p>
    </footer>
  );
}
