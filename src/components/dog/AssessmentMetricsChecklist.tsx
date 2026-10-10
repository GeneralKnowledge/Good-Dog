import { inferMetricProgress } from "@/lib/domains/dog-training/kb-assessment";
import type { ProgressSnapshot } from "@/lib/coaching";

const STATUS_LABEL: Record<string, string> = {
  building: "Building toward",
  on_track: "On track",
  met: "Met",
  gated: "Important",
};

export function AssessmentMetricsChecklist({
  progressByObjective,
  recentSessions,
}: {
  progressByObjective: Record<string, ProgressSnapshot>;
  recentSessions: Array<{ exerciseId: string; outcome: string }>;
}) {
  const rows = inferMetricProgress(progressByObjective, recentSessions);

  return (
    <ul className="mt-3 flex flex-col gap-3">
      {rows.map(({ metric, status, detail }) => (
        <li key={metric.id} className="rounded-xl border border-line px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {STATUS_LABEL[status] ?? status}
          </p>
          <p className="mt-1 font-semibold">{metric.title}</p>
          <p className="mt-1 text-sm text-muted">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
