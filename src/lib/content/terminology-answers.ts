import {
  getGlossaryTerm,
  getPublishedGlossary,
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
  if (term.needsQualifiedReview) {
    answer +=
      "\n\nThis idea has important nuance. Serious worry, fear, or aggression needs suitably qualified, reward-based professional help — not an app treatment plan.";
  }
  answer += `\n\nYou can open “${term.preferredTerm}” in Learn for related words and practice ideas.`;
  return answer;
}

function findPreferredTermInQuestion(q: string): GlossaryTerm | undefined {
  const published = getPublishedGlossary();
  // Longest preferred/alternative name wins (avoids “reinforcement” stealing “positive reinforcement”)
  const named = published
    .flatMap((term) => [
      { term, name: term.preferredTerm.toLowerCase() },
      ...term.alternativeTerms.map((alt) => ({
        term,
        name: alt.toLowerCase(),
      })),
    ])
    .filter((entry) => entry.name.length >= 3)
    .sort((a, b) => b.name.length - a.name.length);

  for (const entry of named) {
    if (q.includes(entry.name)) return entry.term;
  }
  return undefined;
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

  if (/\byes\b/.test(q) && /\b(treat|reward|before|say|word|mark)/.test(q)) {
    const marker = getGlossaryTerm("marker-word");
    if (marker) {
      return { term: marker, answer: formatGlossaryAnswer(marker, dogName) };
    }
  }

  const named = findPreferredTermInQuestion(q);
  if (named) {
    return { term: named, answer: formatGlossaryAnswer(named, dogName) };
  }

  const looksTerminological =
    /\b(what (is|does)|mean|meaning|define|definition|called|term|marker|reinforc|lur|shaping|threshold|cue|generalisation|generalization|desensit|countercondition|arousal|enrichment|fluency|criteria|capturing|proofing|management|schedule|chain|stay|swap|drop)\b/i.test(
      q,
    ) ||
    /\bwhy do i say yes\b/i.test(q) ||
    /\bthe word i say\b/i.test(q);

  const matches = searchGlossary(question);
  if (matches.length === 0) return null;

  const top = matches[0]!;
  const preferred = top.preferredTerm.toLowerCase();
  const strongHit =
    looksTerminological ||
    q.includes(preferred) ||
    top.alternativeTerms.some((a) => q.includes(a.toLowerCase())) ||
    top.searchPhrases.some((p) => q.includes(p));

  if (!strongHit && !looksTerminological) return null;

  return { term: top, answer: formatGlossaryAnswer(top, dogName) };
}

/**
 * If AI text appears to define a known glossary term, prefer the approved answer.
 */
export function preferApprovedGlossaryOverAi(
  question: string,
  dogName: string,
  aiText: string,
): { answer: string; term: GlossaryTerm } | null {
  const glossaryHit = answerFromGlossary(question, dogName);
  if (glossaryHit) {
    return { answer: glossaryHit.answer, term: glossaryHit.term };
  }

  const q = question.toLowerCase();
  const namedInQuestion = findPreferredTermInQuestion(q);
  if (namedInQuestion) {
    return {
      answer: formatGlossaryAnswer(namedInQuestion, dogName),
      term: namedInQuestion,
    };
  }

  const lower = aiText.toLowerCase();
  const mentioned = getPublishedGlossary()
    .map((term) => ({ term, name: term.preferredTerm.toLowerCase() }))
    .filter(
      ({ name }) =>
        name.length >= 4 &&
        lower.includes(name) &&
        /\b(means|is when|refers to|definition|called)\b/i.test(aiText),
    )
    .sort((a, b) => b.name.length - a.name.length);

  const best = mentioned[0];
  if (best) {
    return { answer: formatGlossaryAnswer(best.term, dogName), term: best.term };
  }
  return null;
}
