"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GLOSSARY_CATEGORIES,
  searchGlossary,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/lib/content/glossary";
import {
  countTermsByExposure,
  filterGlossaryByExposure,
  sortGlossaryForBrowse,
  type GlossaryBrowseSort,
  type TermExposureFilter,
  type TermExposureMap,
} from "@/lib/content/glossary-browse";

const STORAGE_KEY = "good-dog-learn-glossary";

type StoredPrefs = {
  exposureFilter: TermExposureFilter;
  sort: GlossaryBrowseSort;
};

function loadPrefs(): StoredPrefs {
  if (typeof window === "undefined") {
    return { exposureFilter: "all", sort: "alpha" };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { exposureFilter: "all", sort: "alpha" };
    const parsed = JSON.parse(raw) as Partial<StoredPrefs>;
    const exposureFilter = parsed.exposureFilter ?? "all";
    const sort = parsed.sort === "newFirst" ? "newFirst" : "alpha";
    if (!["all", "new", "introduced", "explored"].includes(exposureFilter)) {
      return { exposureFilter: "all", sort };
    }
    return { exposureFilter: exposureFilter as TermExposureFilter, sort };
  } catch {
    return { exposureFilter: "all", sort: "alpha" };
  }
}

function savePrefs(prefs: StoredPrefs) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota / private mode
  }
}

export function GlossaryBrowser({ exposure }: { exposure: TermExposureMap }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");
  const [exposureFilter, setExposureFilter] = useState<TermExposureFilter>(
    () => loadPrefs().exposureFilter,
  );
  const [sort, setSort] = useState<GlossaryBrowseSort>(() => loadPrefs().sort);
  const skipSavePrefs = useRef(true);

  useEffect(() => {
    if (skipSavePrefs.current) {
      skipSavePrefs.current = false;
      return;
    }
    savePrefs({ exposureFilter, sort });
  }, [exposureFilter, sort]);

  const isSearching = query.trim().length > 0;

  const categoryScoped = useMemo(() => {
    let terms = searchGlossary(query);
    if (category !== "all") {
      terms = terms.filter((t) => t.category === category);
    }
    return terms;
  }, [query, category]);

  const results = useMemo(() => {
    let terms = filterGlossaryByExposure(categoryScoped, exposure, exposureFilter);
    if (!isSearching) {
      terms = sortGlossaryForBrowse(terms, sort, exposure);
    }
    return terms;
  }, [categoryScoped, exposure, exposureFilter, sort, isSearching]);

  const countsInView = useMemo(
    () => countTermsByExposure(categoryScoped, exposure),
    [categoryScoped, exposure],
  );

  const emptyMessage = useMemo(() => {
    if (isSearching && results.length === 0) {
      return (
        <>
          No matching terms. Try “marker”, “reward”, “threshold”, or describe what you’re looking
          for in everyday words.
        </>
      );
    }
    if (exposureFilter === "new" && categoryScoped.length > 0) {
      return (
        <>
          You’ve opened all terms in this view — try <strong>All</strong> or{" "}
          <strong>Explored</strong>.
        </>
      );
    }
    if (exposureFilter !== "all" && results.length === 0) {
      return <>Nothing in this filter for the current category. Try another filter or All.</>;
    }
    return <>No terms to show.</>;
  }, [isSearching, results.length, exposureFilter, categoryScoped.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="field">
        <label htmlFor="glossary-search">Search training words</label>
        <input
          id="glossary-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. the word I say when my dog does something right"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Glossary categories">
        <FilterChip
          label="All topics"
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {GLOSSARY_CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            label={c.title}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Your progress">
        <FilterChip
          label="All"
          testId="glossary-filter-all"
          active={exposureFilter === "all"}
          onClick={() => setExposureFilter("all")}
        />
        <FilterChip
          label="New to you"
          testId="glossary-filter-new"
          active={exposureFilter === "new"}
          onClick={() => setExposureFilter("new")}
        />
        <FilterChip
          label="Seen"
          testId="glossary-filter-seen"
          active={exposureFilter === "introduced"}
          onClick={() => setExposureFilter("introduced")}
        />
        <FilterChip
          label="Explored"
          testId="glossary-filter-explored"
          active={exposureFilter === "explored"}
          onClick={() => setExposureFilter("explored")}
        />
      </div>

      {!isSearching ? (
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label="A–Z"
            active={sort === "alpha"}
            onClick={() => setSort("alpha")}
          />
          <FilterChip
            label="New first"
            active={sort === "newFirst"}
            onClick={() => setSort("newFirst")}
          />
        </div>
      ) : null}

      <p className="text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "term" : "terms"}
        {exposureFilter === "all" && countsInView.new > 0
          ? ` · ${countsInView.new} new to you`
          : ""}
      </p>

      <ul className="flex flex-col">
        {results.map((term, index) => (
          <TermCard
            key={term.id}
            term={term}
            state={exposure[term.id]}
            bordered={index > 0}
          />
        ))}
        {results.length === 0 ? (
          <li className="py-4 text-sm text-muted">{emptyMessage}</li>
        ) : null}
      </ul>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  testId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={`chip ${active ? "chip--active" : ""}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function TermCard({
  term,
  state,
  bordered,
}: {
  term: GlossaryTerm;
  state?: "introduced" | "explored";
  bordered?: boolean;
}) {
  const badge =
    state === "explored" ? "Explored" : state === "introduced" ? "Seen" : null;

  return (
    <li className={`fade-up ${bordered ? "border-t border-line" : ""}`}>
      <Link href={`/learn/glossary/${term.id}`} className="block py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug text-brand-deep">
            {term.preferredTerm}
          </h3>
          {badge ? (
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted">{term.shortDefinition}</p>
      </Link>
    </li>
  );
}
