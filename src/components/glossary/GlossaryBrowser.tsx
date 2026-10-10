"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  GLOSSARY_CATEGORIES,
  searchGlossary,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/lib/content/glossary";

export function GlossaryBrowser({
  exposure,
}: {
  exposure: Record<string, "introduced" | "explored">;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");

  const results = useMemo(() => {
    let terms = searchGlossary(query);
    if (category !== "all") {
      terms = terms.filter((t) => t.category === category);
    }
    return terms;
  }, [query, category]);

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
        <CategoryChip
          label="All"
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {GLOSSARY_CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.title}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

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
          <li className="py-4 text-sm text-muted">
            No matching terms. Try “marker”, “reward”, “threshold”, or describe what you’re looking
            for in everyday words.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
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
    state === "explored"
      ? "Explored"
      : state === "introduced"
        ? "Seen"
        : null;

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
