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
  kind: "management" | "education";
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

export function getAllGuides(): KbGuide[] {
  return guidesBundle.guides as KbGuide[];
}

export function getManagementGuides(): KbGuide[] {
  return getAllGuides().filter((g) => g.kind === "management");
}

export function getEducationModules(): KbGuide[] {
  return getAllGuides().filter((g) => g.kind === "education");
}

export function getGuideByLessonId(lessonId: string): KbGuide | undefined {
  return getAllGuides().find((g) => g.lessonId === lessonId);
}

export function getReferrals(): KbReferral[] {
  return referralsBundle.referrals as KbReferral[];
}

export function getEthicsDisclaimer(): string {
  return referralsBundle.ethicsDisclaimer as string;
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

export function findGuidesForHelpArticle(helpArticleId: string): KbGuide[] {
  const crosswalk = askPatternsBundle.ownerQuestionCrosswalk as Array<{
    helpArticleId: string;
    guideLessonIds: string[];
  }>;
  const entry = crosswalk.find((c) => c.helpArticleId === helpArticleId);
  if (!entry) return [];
  return entry.guideLessonIds
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
