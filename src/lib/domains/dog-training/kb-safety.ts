import safetyBundle from "./content/kb-import/good-dog-safety.json";
import domainBundle from "./content/kb-import/good-dog-domain.json";
import type { ProgressSnapshot } from "@/lib/coaching";

export type KbSafetyRule = {
  id: string;
  title: string;
  rule: string;
  severity: string;
  referralText?: string | null;
};

type AversivePattern = { source: string; flags?: string };

const aversivePatterns: RegExp[] = (
  safetyBundle.violatesNoAversivePatterns as AversivePattern[]
).map((p) => new RegExp(p.source, p.flags ?? "i"));

/** Exercise ids the KB export must not overwrite (e.g. P1-1 loose lead). */
export function getKbHeldExerciseIds(): Set<string> {
  const held = domainBundle.held as Array<{ goodDogExerciseId?: string }>;
  return new Set(
    held.map((h) => h.goodDogExerciseId).filter((id): id is string => Boolean(id)),
  );
}

export function getKbSafetyRules(): KbSafetyRule[] {
  return safetyBundle.safetyRules as KbSafetyRule[];
}

export function violatesNoAversiveRule(text: string): boolean {
  return aversivePatterns.some((re) => re.test(text));
}

const ESCALATE_QUESTION =
  /\b(bite|biting|aggress|attack|blood|severe fear|panic|separation distress|self.?harm|suicid|cannot eat|not eating|sudden(?:ly)? chang(?:e|ed)|in pain|limping|growl(?:s|ing)? at (?:me|child|children)|resource guard(?:ing)?)\b/i;

export function questionNeedsEscalateReferral(question: string): boolean {
  return ESCALATE_QUESTION.test(question);
}

export function escalateReferralParagraph(): string {
  const scope = getKbSafetyRules().find((r) => r.id === "safe-004-scope-referral");
  if (scope?.referralText) {
    return `${scope.rule}\n\n${scope.referralText}`;
  }
  return (
    "Aggression, severe fear, sudden unexplained behaviour change, or suspected pain or illness " +
    "need a vet and/or qualified reward-based behaviour professional — not app training alone."
  );
}

export function aversiveBlockedFallback(dogName: string): string {
  const rule = getKbSafetyRules().find((r) => r.id === "safe-001-no-aversive-routine");
  const base =
    rule?.rule ??
    "Good Dog only supports kind, reward-based training — not pain, fear, or coercion.";
  const referral = rule?.referralText;
  const personalised = base.replace(/\byour dog\b/gi, dogName);
  return referral ? `${personalised}\n\n${referral}` : personalised;
}

/**
 * Proxy for KB metrics metric-recall-long-line-5m / 10m until explicit metric tracking exists.
 * Unlocks promotion to harder outdoor recall (ex-recall-mild-distract) via plan variation.
 */
export function isOffLeadRecallPromotionUnlocked(
  progressByObjective: Record<string, ProgressSnapshot>,
  recentFoundationEasyCount: number,
): boolean {
  const recall = progressByObjective.recall;
  if (!recall) return false;

  const tier1 =
    recall.state === "practising" ||
    recall.state === "becoming_consistent" ||
    recall.state === "ready_to_increase";
  const tier2EasySessions = recentFoundationEasyCount >= 3;
  const tier2State =
    recall.state === "becoming_consistent" || recall.state === "ready_to_increase";

  return tier1 && tier2EasySessions && tier2State;
}

export function countRecentEasyRecallFoundation(
  sessions: Array<{ exerciseId: string; outcome: string }>,
  limit = 30,
): number {
  return sessions
    .slice(0, limit)
    .filter((s) => s.exerciseId === "ex-recall-foundation" && s.outcome === "easy")
    .length;
}

/** Strip harder recall variation when KB safe-002 gate is not met. */
export function exercisesWithRecallPromotionGate<
  T extends { id: string; harderVariationId?: string },
>(
  exercises: T[],
  progressByObjective: Record<string, ProgressSnapshot>,
  recentSessions: Array<{ exerciseId: string; outcome: string }>,
): T[] {
  if (
    isOffLeadRecallPromotionUnlocked(
      progressByObjective,
      countRecentEasyRecallFoundation(recentSessions),
    )
  ) {
    return exercises;
  }

  return exercises.map((exercise) =>
    exercise.id === "ex-recall-foundation"
      ? { ...exercise, harderVariationId: undefined }
      : exercise,
  );
}

export function sanitizeAskAnswer(answer: string, dogName: string, question: string): string {
  let text = answer.trim();
  if (questionNeedsEscalateReferral(question)) {
    const referral = escalateReferralParagraph();
    if (!text.includes(referral.slice(0, 40))) {
      text = `${referral}\n\n${text}`;
    }
  }
  if (violatesNoAversiveRule(text)) {
    return aversiveBlockedFallback(dogName);
  }
  return text;
}

export const kbImportMeta = {
  domainSchemaVersion: domainBundle.schemaVersion as string,
  safetySchemaVersion: safetyBundle.schemaVersion as string,
  generatedAt: safetyBundle.generatedAt as string,
};
