import {
  getGlossaryTerm,
  searchGlossary,
  type GlossaryTerm,
} from "@/lib/content/glossary";

/** Build a Layer 1–3 style answer from an approved glossary term. */
export function formatGlossaryAnswer(term: GlossaryTerm, dogName: string): string {
  const name = dogName || "your dog";
  let answer = `${term.preferredTerm}: ${term.shortDefinition}\n\n`;
  answer += `Example: ${term.example.replace(/\byour dog\b/gi, name)}\n\n`;
  answer += term.deeperExplanation;
  if (term.commonMisunderstanding) {
    answer += `\n\nCommon mix-up: ${term.commonMisunderstanding}`;
  }
  answer += `\n\nYou can open “${term.preferredTerm}” in Learn for related words and practice ideas.`;
  return answer;
}

/**
 * Prefer exact glossary matches for terminology questions.
 * Returns null when the question is not clearly about a term.
 */
export function answerFromGlossary(
  question: string,
  dogName: string,
): { term: GlossaryTerm; answer: string } | null {
  const q = question.trim().toLowerCase();
  if (!q) return null;

  const looksTerminological =
    /\b(what (is|does)|mean|meaning|define|definition|called|term|marker|reinforc|lur|shaping|threshold|cue|generalisation|generalization|desensit|countercondition|arousal|enrichment|fluency|criteria|capturing|proofing)\b/i.test(
      q,
    ) ||
    /\bwhy do i say yes\b/i.test(q) ||
    /\bthe word i say\b/i.test(q);

  const matches = searchGlossary(question);
  if (matches.length === 0) return null;

  // Strong path: user asked about terminology or search is a clear term hit
  const top = matches[0]!;
  const preferred = top.preferredTerm.toLowerCase();
  const strongHit =
    looksTerminological ||
    q.includes(preferred) ||
    top.alternativeTerms.some((a) => q.includes(a.toLowerCase())) ||
    top.searchPhrases.some((p) => q.includes(p));

  if (!strongHit && !looksTerminological) return null;

  // Prefer canonical ids for classic questions
  if (/\byes\b/.test(q) && /\b(treat|reward|before|say|word|mark)/.test(q)) {
    const marker = getGlossaryTerm("marker-word");
    if (marker) {
      return { term: marker, answer: formatGlossaryAnswer(marker, dogName) };
    }
  }

  return { term: top, answer: formatGlossaryAnswer(top, dogName) };
}
