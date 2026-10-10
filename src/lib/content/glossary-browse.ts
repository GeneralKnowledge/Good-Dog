import type { GlossaryTerm } from "./glossary";

export type TermExposureState = "new" | "introduced" | "explored";
export type TermExposureFilter = "all" | "new" | "introduced" | "explored";
export type GlossaryBrowseSort = "alpha" | "newFirst";

export type TermExposureMap = Record<string, "introduced" | "explored">;

export function getTermExposureState(
  termId: string,
  exposure: TermExposureMap,
): TermExposureState {
  const state = exposure[termId];
  if (state === "explored") return "explored";
  if (state === "introduced") return "introduced";
  return "new";
}

export function filterGlossaryByExposure(
  terms: GlossaryTerm[],
  exposure: TermExposureMap,
  filter: TermExposureFilter,
): GlossaryTerm[] {
  if (filter === "all") return terms;
  return terms.filter((term) => getTermExposureState(term.id, exposure) === filter);
}

function exposureRank(state: TermExposureState): number {
  if (state === "new") return 0;
  if (state === "introduced") return 1;
  return 2;
}

export function sortGlossaryForBrowse(
  terms: GlossaryTerm[],
  mode: GlossaryBrowseSort,
  exposure: TermExposureMap,
): GlossaryTerm[] {
  const copy = [...terms];
  if (mode === "newFirst") {
    copy.sort((a, b) => {
      const rankDiff =
        exposureRank(getTermExposureState(a.id, exposure)) -
        exposureRank(getTermExposureState(b.id, exposure));
      if (rankDiff !== 0) return rankDiff;
      return a.preferredTerm.localeCompare(b.preferredTerm, "en-GB");
    });
    return copy;
  }
  copy.sort((a, b) => a.preferredTerm.localeCompare(b.preferredTerm, "en-GB"));
  return copy;
}

export function countTermsByExposure(
  terms: GlossaryTerm[],
  exposure: TermExposureMap,
): { new: number; introduced: number; explored: number } {
  let newCount = 0;
  let introduced = 0;
  let explored = 0;
  for (const term of terms) {
    const state = getTermExposureState(term.id, exposure);
    if (state === "new") newCount += 1;
    else if (state === "introduced") introduced += 1;
    else explored += 1;
  }
  return { new: newCount, introduced, explored };
}
