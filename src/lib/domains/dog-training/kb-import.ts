import guidesBundle from "./content/kb-import/good-dog-guides.json";
import referralsBundle from "./content/kb-import/good-dog-referrals.json";
import askPatternsBundle from "./content/kb-import/good-dog-ask-patterns.json";
import domainBundle from "./content/kb-import/good-dog-domain.json";
import safetyBundle from "./content/kb-import/good-dog-safety.json";

export type KbGuide = {
  lessonId: string;
  title: string;
  summary: string;
  advisory: boolean;
  advisoryMessage: string | null;
  protocolId: string;
  kind?: "management" | "education";
  ownerBodyMarkdown: string;
  provenance: {
    protocolId: string;
    claimIds: string[];
    sourceIds: string[];
    reviewStatus: string;
    lastVerified: string;
  };
  suggestedAskKeywords: string[];
};

export type KbReferral = {
  id: string;
  title: string;
  body: string;
  url: string;
  rationaleClaimIds: string[];
};

export function getKbImportMeta() {
  return {
    domainSchemaVersion: domainBundle.schemaVersion as string,
    safetySchemaVersion: safetyBundle.schemaVersion as string,
    guidesSchemaVersion: guidesBundle.schemaVersion as string,
    generatedAt: guidesBundle.generatedAt as string,
  };
}

const educationLessonIds = new Set(
  ((domainBundle.educationOnly ?? []) as Array<{ lessonId: string }>).map(
    (entry) => entry.lessonId,
  ),
);

export function getGuideKind(guide: KbGuide): "management" | "education" {
  if (guide.kind) return guide.kind;
  return educationLessonIds.has(guide.lessonId) ? "education" : "management";
}

export function getAllGuides(): KbGuide[] {
  return guidesBundle.guides as KbGuide[];
}

export function getManagementGuides(): KbGuide[] {
  return getAllGuides().filter((g) => getGuideKind(g) === "management");
}

export function getEducationModules(): KbGuide[] {
  return getAllGuides().filter((g) => getGuideKind(g) === "education");
}

export function getGuideByLessonId(lessonId: string): KbGuide | undefined {
  return getAllGuides().find((g) => g.lessonId === lessonId);
}

type ReferralsRecord = Record<
  string,
  {
    title: string;
    body: string;
    url?: string;
    rationaleClaimIds: string[];
  }
>;

export function getReferrals(): KbReferral[] {
  const raw = referralsBundle.referrals as ReferralsRecord;
  return Object.entries(raw).map(([id, ref]) => ({
    id,
    title: ref.title,
    body: ref.body,
    url: ref.url ?? "",
    rationaleClaimIds: ref.rationaleClaimIds,
  }));
}

export function getEthicsDisclaimer(): string {
  const fromBundle = referralsBundle as { ethicsDisclaimer?: string };
  if (fromBundle.ethicsDisclaimer) return fromBundle.ethicsDisclaimer;
  return (
    "Good Dog offers general reward-based training education. It is not veterinary care, " +
    "clinical behaviour treatment, or a substitute for hands-on professional assessment."
  );
}

export function getAskPatternsBundle() {
  return askPatternsBundle;
}

export function findGuidesForQuestion(question: string): KbGuide[] {
  const q = question.trim().toLowerCase();
  if (!q) return [];
  const scored = getAllGuides()
    .map((guide) => {
      let score = 0;
      for (const kw of guide.suggestedAskKeywords) {
        if (q.includes(kw.toLowerCase())) score += 3;
      }
      if (guide.title.toLowerCase().includes(q)) score += 2;
      return { guide, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((r) => r.guide);
}

const HELP_ARTICLE_GUIDE_IDS: Record<string, string[]> = {
  "help-aggression": ["lesson-reactive-management"],
  "help-worried": ["lesson-read-your-dog-stress"],
  "help-pain": ["lesson-read-your-dog-stress", "lesson-vet-handling-prep"],
};

export function findGuidesForHelpArticle(helpArticleId: string): KbGuide[] {
  const lessonIds = HELP_ARTICLE_GUIDE_IDS[helpArticleId] ?? [];
  return lessonIds
    .map((id) => getGuideByLessonId(id))
    .filter((g): g is KbGuide => Boolean(g));
}

export {
  getKbHeldExerciseIds,
  getKbSafetyRules,
  violatesNoAversiveRule,
  questionNeedsEscalateReferral,
  getEscalateGuideLessonIds,
  escalateReferralParagraph,
  sanitizeAskAnswer,
  isOffLeadRecallPromotionUnlocked,
  exercisesWithRecallPromotionGate,
  kbImportMeta,
} from "./kb-safety";
