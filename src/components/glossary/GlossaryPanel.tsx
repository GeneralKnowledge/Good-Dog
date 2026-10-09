"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { GlossaryTerm } from "@/lib/content/glossary";
import { markTermExploredAction } from "@/lib/actions/glossary";

export function GlossaryPanel({
  term,
  onClose,
}: {
  term: GlossaryTerm;
  onClose: () => void;
}) {
  const router = useRouter();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    void markTermExploredAction(term.id);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [term.id, onClose]);

  const panel = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="card fade-up max-h-[85dvh] w-full max-w-md overflow-y-auto p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Training word
            </p>
            <h2 id={titleId} className="font-display text-2xl leading-tight">
              {term.preferredTerm}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="btn btn-secondary min-h-10 px-3"
            onClick={onClose}
            aria-label="Close definition"
          >
            Close
          </button>
        </div>
        <p className="mt-3 leading-relaxed">{term.shortDefinition}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-semibold text-foreground">Example: </span>
          {term.example}
        </p>
        {term.commonMisunderstanding ? (
          <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-sm leading-relaxed">
            <span className="font-semibold">Common mix-up: </span>
            {term.commonMisunderstanding}
          </p>
        ) : null}
        <button
          type="button"
          className="btn btn-primary mt-5 w-full"
          onClick={() => {
            const href = `/learn/glossary/${term.id}`;
            onClose();
            router.push(href);
          }}
        >
          Learn more
        </button>
      </div>
    </div>
  );

  if (typeof document === "undefined") return panel;
  return createPortal(panel, document.body);
}
