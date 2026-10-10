"use client";

import { useMemo, useState, useTransition } from "react";
import type { HelpArticle } from "@/lib/domains/dog-training/content/help";
import { searchHelp } from "@/lib/domains/dog-training/content/help";
import { askOptionalAiAction } from "@/lib/actions/ask";

export function AskSearch({
  dogName,
  initialArticles,
  aiConfigured,
}: {
  dogName: string;
  initialArticles: HelpArticle[];
  aiConfigured: boolean;
}) {
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const results = useMemo(() => {
    if (!query.trim()) return initialArticles;
    return searchHelp(query);
  }, [query, initialArticles]);

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
            setAiError(null);
          }}
          placeholder={`e.g. What if ${dogName} gets distracted?`}
        />
      </div>

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
          </li>
        ))}
        {results.length === 0 ? (
          <li className="card p-4 text-sm text-muted">
            No exact match in the approved library. Try another phrase, or browse the suggestions
            above by clearing the search.
          </li>
        ) : null}
      </ul>

      {aiConfigured ? (
        <div className="card p-4">
          <h2 className="font-display text-xl">Optional AI helper</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Uses approved Good Dog guidance as its source. Disabled automatically if no API key is
            configured.
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
                  return;
                }
                setAiAnswer(result.answer);
              });
            }}
          >
            {pending ? "Thinking…" : "Ask with approved guidance"}
          </button>
          {aiAnswer ? (
            <p className="mt-3 text-sm leading-relaxed text-brand-deep">{aiAnswer}</p>
          ) : null}
          {aiError ? (
            <p className="mt-3 text-sm text-danger" role="alert">
              {aiError}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Optional AI help is not configured. The approved answers above work without an API key.
        </p>
      )}
    </div>
  );
}

function personalise(answer: string, dogName: string) {
  return answer.replace(/\byour dog\b/gi, dogName);
}
