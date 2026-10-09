"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  getGlossaryTerm,
  TERM_LINK_PATTERN,
  type GlossaryTerm,
} from "@/lib/content/glossary";
import { GlossaryPanel } from "./GlossaryPanel";

type Segment =
  | { type: "text"; value: string }
  | { type: "term"; termId: string; label: string };

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const re = new RegExp(TERM_LINK_PATTERN.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const termId = match[1]!;
    const term = getGlossaryTerm(termId);
    const label = match[2] ?? term?.preferredTerm ?? termId;
    segments.push({ type: "term", termId, label });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

export function TermRichText({
  text,
  className,
  onTermsPresented,
}: {
  text: string;
  className?: string;
  onTermsPresented?: (termIds: string[]) => void;
}) {
  const segments = useMemo(() => parseSegments(text), [text]);
  const [active, setActive] = useState<GlossaryTerm | null>(null);

  const termIds = useMemo(
    () =>
      segments
        .filter((s): s is Extract<Segment, { type: "term" }> => s.type === "term")
        .map((s) => s.termId)
        .filter((id, i, arr) => arr.indexOf(id) === i),
    [segments],
  );

  const presentedKey = useRef<string>("");
  useEffect(() => {
    if (termIds.length === 0 || !onTermsPresented) return;
    const key = termIds.join(",");
    if (presentedKey.current === key) return;
    presentedKey.current = key;
    onTermsPresented(termIds);
  }, [termIds, onTermsPresented]);

  if (termIds.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <>
      <span className={className}>
        {segments.map((segment, index) => {
          if (segment.type === "text") {
            return <Fragment key={`t-${index}`}>{segment.value}</Fragment>;
          }
          const term = getGlossaryTerm(segment.termId);
          if (!term) {
            return <Fragment key={`m-${index}`}>{segment.label}</Fragment>;
          }
          return (
            <button
              key={`m-${index}`}
              type="button"
              className="term-link"
              onClick={() => setActive(term)}
              aria-haspopup="dialog"
              aria-label={`Explain: ${term.preferredTerm}`}
            >
              {segment.label}
            </button>
          );
        })}
      </span>
      {active ? (
        <GlossaryPanel term={active} onClose={() => setActive(null)} />
      ) : null}
    </>
  );
}
