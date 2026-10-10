"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { HelpArticle } from "@/lib/domains/dog-training/content/help";
import { searchHelp } from "@/lib/domains/dog-training/content/help";
import { searchGlossary, type GlossaryTerm } from "@/lib/content/glossary";
import { askOptionalAiAction } from "@/lib/actions/ask";

export type AskArticle = HelpArticle & {
  relatedExercises: Array<{ id: string; title: string; versionId: string }>;
};

export function AskSearch({
  dogId,
  dogName,
  initialArticles,
  aiConfigured,
}: {
  dogId: string;
  dogName: string;
  initialArticles: AskArticle[];
  aiConfigured: boolean;
}) {
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"glossary" | "help" | "ai" | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return initialArticles;
    const matched = searchHelp(query);
    const byId = new Map(initialArticles.map((a) => [a.id, a]));
    return matched.map((article) => byId.get(article.id) ?? { ...article, relatedExercises: [] });
  }, [query, initialArticles]);

  const glossaryMatches = useMemo(() => {
    if (!query.trim()) return [];
    return searchGlossary(query).slice(0, 3);
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="field">
        <label htmlFor="ask-query">Search for help</label>
        <input
          id="ask-query"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setAiAnswer(null);
            setAiSource(null);
            setAiError(null);
            setExpandedTermId(null);
          }}
          placeholder={`e.g. What if ${dogName} gets distracted?`}
        />
      </div>

      {glossaryMatches.length > 0 ? (
        <section aria-label="Training words">
          <h2 className="heading-subsection mb-2">Training words</h2>
          <ul className="flex flex-col gap-3">
            {glossaryMatches.map((term) => (
              <GlossaryMatchCard
                key={term.id}
                term={term}
                dogName={dogName}
                expanded={expandedTermId === term.id}
                onToggle={() =>
                  setExpandedTermId((current) => (current === term.id ? null : term.id))
                }
              />
            ))}
          </ul>
        </section>
      ) : null}

      <ul className="flex flex-col gap-3">
        {results.map((article) => (
          <li key={article.id} className="card p-4 fade-up">
            <h2 className="font-semibold leading-snug">{article.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {personalise(article.answer, dogName)}
            </p>
            {article.escalate ? (
              <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-xs leading-relaxed">
                This may need professional support beyond the app.
              </p>
            ) : null}
            {article.relatedExercises.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Try a related exercise
                </p>
                {article.relatedExercises.map((exercise) => (
                  <Link
                    key={exercise.id}
                    href={`/exercise/${exercise.id}?dogId=${dogId}&versionId=${exercise.versionId}`}
                    className="btn btn-secondary w-full text-sm"
                  >
                    {exercise.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        ))}
        {results.length === 0 && glossaryMatches.length === 0 ? (
          <li className="card p-4 text-sm text-muted">
            No exact match in the approved library. Try another phrase, browse training words in
            Learn, or clear the search.
          </li>
        ) : null}
      </ul>

      <div className="card p-4">
        <h2 className="heading-subsection">Ask with approved guidance</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Terminology answers use Good Dog’s reviewed glossary. Optional AI (when configured) stays
          grounded on the same approved text.
          {!aiConfigured
            ? " No AI key is configured — glossary and help answers still work."
            : ""}
        </p>
        <button
          type="button"
          className="btn btn-secondary mt-3 w-full"
          disabled={pending || !query.trim()}
          onClick={() => {
            startTransition(async () => {
              setAiError(null);
              const result = await askOptionalAiAction({
                question: query,
                dogName,
              });
              if (!result.ok) {
                setAiError(result.error);
                setAiAnswer(null);
                setAiSource(null);
                return;
              }
              setAiAnswer(result.answer);
              setAiSource(result.source);
            });
          }}
        >
          {pending ? "Thinking…" : "Explain using approved answers"}
        </button>
        {aiAnswer ? (
          <div className="mt-3">
            {aiSource ? (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">
                {aiSource === "glossary"
                  ? "From the glossary"
                  : aiSource === "ai"
                    ? "AI using approved guidance"
                    : "From help articles"}
              </p>
            ) : null}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-deep">
              {aiAnswer}
            </p>
          </div>
        ) : null}
        {aiError ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {aiError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function GlossaryMatchCard({
  term,
  dogName,
  expanded,
  onToggle,
}: {
  term: GlossaryTerm;
  dogName: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="card p-4 fade-up">
      <h3 className="heading-subsection leading-snug">{term.preferredTerm}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{term.shortDefinition}</p>
      {expanded ? (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          <p>
            <span className="font-semibold text-foreground">Example: </span>
            {term.example.replace(/\byour dog\b/gi, dogName)}
          </p>
          <p>{term.deeperExplanation}</p>
          {term.commonMisunderstanding ? (
            <p className="rounded-xl bg-accent-soft px-3 py-2">
              <span className="font-semibold text-foreground">Common mix-up: </span>
              {term.commonMisunderstanding}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="mt-3 flex flex-col gap-2">
        <button type="button" className="btn btn-secondary w-full" onClick={onToggle}>
          {expanded ? "Show less" : "Show a little more"}
        </button>
        <Link href={`/learn/glossary/${term.id}`} className="btn btn-ghost w-full">
          Open in Learn
        </Link>
      </div>
    </li>
  );
}

function personalise(answer: string, dogName: string) {
  return answer.replace(/\byour dog\b/gi, dogName);
}
