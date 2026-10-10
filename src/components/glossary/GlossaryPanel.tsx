"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { GlossaryTerm } from "@/lib/content/glossary";
import { markTermExploredAction } from "@/lib/actions/glossary";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function GlossaryPanel({
  term,
  onClose,
  returnFocusRef,
}: {
  term: GlossaryTerm;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const focusTarget = returnFocusRef?.current ?? null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    void markTermExploredAction(term.id);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      focusTarget?.focus();
    };
  }, [term.id, onClose, returnFocusRef]);

  const panel = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
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
        {term.needsQualifiedReview ? (
          <p className="mt-3 text-xs leading-relaxed text-muted">
            This idea has important nuance. Good Dog offers a careful beginner explanation, not a
            treatment plan. Serious worry, fear, or aggression needs suitably qualified,
            reward-based professional help.
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
