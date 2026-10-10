import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GuideProvenance } from "@/components/kb/GuideProvenance";
import { ReferralsBlock } from "@/components/kb/ReferralsBlock";
import { getAllGuides, getGuideByLessonId } from "@/lib/domains/dog-training/kb-import";
import { requireUser } from "@/lib/auth/session";

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ lessonId: g.lessonId }));
}

function renderMarkdownBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="heading-subsection mt-6 first:mt-0">
          {block.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i} className="mt-3 leading-relaxed text-muted">
        {block}
      </p>
    );
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  await requireUser();
  const { lessonId } = await params;
  const guide = getGuideByLessonId(lessonId);
  if (!guide) notFound();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader title={guide.title} subtitle="Learn · Guide" />
      <div className="sheet flex flex-1 flex-col gap-6">
        {guide.advisory && guide.advisoryMessage ? (
          <div
            className="rounded-xl border border-accent bg-accent-soft px-4 py-3 text-sm leading-relaxed"
            role="note"
          >
            {guide.advisoryMessage}
          </div>
        ) : null}

        <div className="fade-up">{renderMarkdownBody(guide.ownerBodyMarkdown)}</div>

        <GuideProvenance guide={guide} />

        <ReferralsBlock compact />

        <Link href="/learn" className="btn btn-secondary w-full">
          Back to Learn
        </Link>
      </div>
    </main>
  );
}
