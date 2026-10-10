import Link from "next/link";
import { getAllGuides } from "@/lib/domains/dog-training/kb-import";

export function LearnGuides() {
  const guides = getAllGuides();

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {guides.map((guide) => (
        <li key={guide.lessonId}>
          <Link
            href={`/learn/guides/${guide.lessonId}`}
            className="plan-row block"
            data-testid={`guide-link-${guide.lessonId}`}
          >
            <div className="plan-row__body">
              <p className="font-semibold">{guide.title}</p>
              <p className="mt-1 text-sm text-muted">{guide.summary}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand">
                {guide.kind === "management" ? "Management guide" : "Education"}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
