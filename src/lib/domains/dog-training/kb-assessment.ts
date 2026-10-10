import safetyBundle from "./content/kb-import/good-dog-safety.json";
import type { ProgressSnapshot } from "@/lib/coaching";
import { isOffLeadRecallPromotionUnlocked, countRecentEasyRecallFoundation } from "./kb-safety";

export type KbAssessmentMetric = {
  id: string;
  title: string;
  observableCriteria: string;
  progressionGate: string | null;
  goodDogInferenceHints?: {
    learningObjectiveIds: string[];
    exerciseIds: string[];
  };
};

export type MetricProgressStatus = "building" | "on_track" | "met" | "gated";

export interface MetricProgressRow {
  metric: KbAssessmentMetric;
  status: MetricProgressStatus;
  detail: string;
}

export function getAssessmentMetrics(): KbAssessmentMetric[] {
  return safetyBundle.assessmentMetrics as KbAssessmentMetric[];
}

export function getOffLeadRequiredMetricIds(): string[] {
  const block = safetyBundle.blocksOffLeadPromotion as {
    requiredMetricIds?: string[];
  };
  return block.requiredMetricIds ?? [];
}

export function inferMetricProgress(
  progressByObjective: Record<string, ProgressSnapshot>,
  recentSessions: Array<{ exerciseId: string; outcome: string }>,
): MetricProgressRow[] {
  const easyRecallCount = countRecentEasyRecallFoundation(recentSessions);
  const recallUnlocked = isOffLeadRecallPromotionUnlocked(
    progressByObjective,
    easyRecallCount,
  );

  return getAssessmentMetrics().map((metric) => {
    const hints = metric.goodDogInferenceHints;
    const objectives = hints?.learningObjectiveIds ?? [];
    const snapshots = objectives
      .map((id) => progressByObjective[id])
      .filter(Boolean) as ProgressSnapshot[];

    if (metric.id === "metric-off-lead-not-unlocked") {
      return {
        metric,
        status: recallUnlocked ? ("gated" as const) : ("building" as const),
        detail: recallUnlocked
          ? "Long-line recall milestones look strong — still use secure areas and professional guidance before off-lead freedom."
          : "Off-lead freedom stays locked until long-line recall milestones are met.",
      };
    }

    if (metric.id === "metric-recall-long-line-10m" || metric.id === "metric-recall-long-line-5m") {
      const recall = progressByObjective.recall;
      if (!recall || recall.state === "not_introduced" || recall.state === "introduced") {
        return {
          metric,
          status: "building",
          detail: "Keep practising foundation recall on a long line in quiet places.",
        };
      }
      if (recall.state === "needs_easier") {
        return {
          metric,
          status: "building",
          detail: "We’re simplifying recall while confidence rebuilds.",
        };
      }
      if (metric.id === "metric-recall-long-line-5m") {
        const met =
          recall.state === "practising" ||
          recall.state === "becoming_consistent" ||
          recall.state === "ready_to_increase";
        return {
          metric,
          status: met ? "on_track" : "building",
          detail: met
            ? "Foundation recall practice is underway — keep sessions short and rewarding."
            : "Start with easy recall wins on a long line.",
        };
      }
      const met =
        recall.state === "becoming_consistent" || recall.state === "ready_to_increase";
      const needsMoreEasy = easyRecallCount < 3;
      return {
        metric,
        status: met && !needsMoreEasy ? "on_track" : "building",
        detail:
          met && !needsMoreEasy
            ? "Several comfortable recall sessions — continue on a long line with mild distraction."
            : "Build more easy recall sessions on a long line before stretching distance.",
      };
    }

    if (metric.id === "metric-name-latency-2s") {
      const name = progressByObjective["name-response"];
      if (!name || name.state === "not_introduced") {
        return { metric, status: "building", detail: "Introduce name games in quiet moments." };
      }
      const met =
        name.state === "becoming_consistent" || name.state === "ready_to_increase";
      return {
        metric,
        status: met ? "on_track" : "building",
        detail: met
          ? "Name response is becoming reliable — keep rewarding quick check-ins."
          : "Reward every glance when you say their name once.",
      };
    }

    if (metric.id === "metric-loose-lead-10-steps") {
      const lead = progressByObjective["loose-lead"] ?? progressByObjective.walking;
      if (!lead || lead.state === "not_introduced") {
        return {
          metric,
          status: "building",
          detail: "Start with short lead introductions and check-ins.",
        };
      }
      const met = lead.state === "practising" || lead.state === "becoming_consistent";
      return {
        metric,
        status: met ? "on_track" : "building",
        detail: met
          ? "Loose-lead practice is in progress — celebrate small stretches of slack."
          : "Keep sessions short and reward a looser lead.",
      };
    }

    const anyProgress = snapshots.some(
      (s) => s.state !== "not_introduced" && s.state !== "introduced",
    );
    return {
      metric,
      status: anyProgress ? "on_track" : "building",
      detail: "Keep practising related skills in short, successful sessions.",
    };
  });
}
