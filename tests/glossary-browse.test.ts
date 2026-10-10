import { describe, expect, it } from "vitest";
import { getGlossaryTerm, getPublishedGlossary } from "@/lib/content/glossary";
import {
  countTermsByExposure,
  filterGlossaryByExposure,
  getTermExposureState,
  sortGlossaryForBrowse,
} from "@/lib/content/glossary-browse";

describe("glossary browse helpers", () => {
  const exposure = {
    "marker-word": "explored" as const,
    reward: "introduced" as const,
  };

  it("resolves exposure state", () => {
    expect(getTermExposureState("marker-word", exposure)).toBe("explored");
    expect(getTermExposureState("reward", exposure)).toBe("introduced");
    expect(getTermExposureState("luring", exposure)).toBe("new");
  });

  it("filters by exposure", () => {
    const published = getPublishedGlossary();
    const explored = filterGlossaryByExposure(published, exposure, "explored");
    expect(explored.every((t) => exposure[t.id as keyof typeof exposure] === "explored")).toBe(
      true,
    );
    expect(explored.some((t) => t.id === "marker-word")).toBe(true);

    const newOnly = filterGlossaryByExposure(published, exposure, "new");
    expect(newOnly.some((t) => t.id === "marker-word")).toBe(false);
  });

  it("sorts alphabetically", () => {
    const terms = [
      getGlossaryTerm("reward")!,
      getGlossaryTerm("marker-word")!,
      getGlossaryTerm("luring")!,
    ];
    const sorted = sortGlossaryForBrowse(terms, "alpha", exposure);
    const titles = sorted.map((t) => t.preferredTerm);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, "en-GB")));
  });

  it("sorts new-first before seen and explored", () => {
    const terms = [
      getGlossaryTerm("marker-word")!,
      getGlossaryTerm("reward")!,
      getGlossaryTerm("luring")!,
    ];
    const sorted = sortGlossaryForBrowse(terms, "newFirst", exposure);
    expect(sorted[0]?.id).toBe("luring");
    expect(sorted.map((t) => t.id)).toContain("marker-word");
    expect(sorted.map((t) => t.id)).toContain("reward");
  });

  it("counts exposure in a term set", () => {
    const subset = [
      getGlossaryTerm("marker-word")!,
      getGlossaryTerm("reward")!,
      getGlossaryTerm("luring")!,
    ];
    expect(countTermsByExposure(subset, exposure)).toEqual({
      new: 1,
      introduced: 1,
      explored: 1,
    });
  });
});
