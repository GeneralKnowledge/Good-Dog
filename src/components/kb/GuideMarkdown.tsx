function renderBlock(block: string, key: string) {
  const trimmed = block.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("# ")) {
    return (
      <h2 key={key} className="heading-subsection mt-6 first:mt-0">
        {trimmed.slice(2)}
      </h2>
    );
  }
  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={key} className="heading-subsection mt-6 first:mt-0">
        {trimmed.slice(3)}
      </h2>
    );
  }
  if (trimmed.startsWith("### ")) {
    return (
      <h3 key={key} className="mt-4 text-base font-semibold text-brand-deep">
        {trimmed.slice(4)}
      </h3>
    );
  }

  const lines = trimmed.split("\n");
  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul key={key} className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
        {lines.map((line, i) => (
          <li key={i}>{line.slice(2)}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={key} className="mt-3 leading-relaxed text-muted">
      {trimmed}
    </p>
  );
}

export function GuideMarkdown({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);
  return <div className="fade-up">{blocks.map((block, i) => renderBlock(block, String(i)))}</div>;
}
