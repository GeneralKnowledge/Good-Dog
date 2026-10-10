import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ShopBuyButton } from "@/components/shop/ShopBuyButton";
import { formatGbp, getShopItem } from "@/lib/content/shop-items";
import { getExerciseById } from "@/lib/domains/dog-training";
import { requireUser } from "@/lib/auth/session";

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const { itemId } = await params;
  const item = getShopItem(itemId);
  if (!item) notFound();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        backHref="/shop"
        backLabel="Shop"
        title={item.title}
        subtitle={item.packLabel}
      />

      <div className="sheet flex flex-1 flex-col">
        <div className="flex justify-center fade-up">
          <div className="relative h-64 w-48 overflow-hidden rounded-2xl bg-brand-soft/60 shadow-[var(--shadow)]">
            <Image
              src={item.imageSrc}
              alt=""
              fill
              className="object-contain p-2"
              sizes="192px"
              priority
            />
          </div>
        </div>

        <div className="mt-6 text-center fade-up fade-up-delay-1">
          <p className="mx-auto max-w-[34ch] leading-relaxed text-muted">
            {item.saleType === "own_brand"
              ? detailIntro(item.id) ?? item.blurb
              : item.blurb}
          </p>
          {item.priceGbp !== undefined ? (
            <p className="heading-section mt-3 text-accent">
              {formatGbp(item.priceGbp)}
            </p>
          ) : null}
        </div>

        <hr className="mt-6 hairline" />

        {item.detailLines && item.detailLines.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-4 fade-up fade-up-delay-2">
            {item.detailLines.map((line) => (
              <li key={line.label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep"
                  aria-hidden="true"
                >
                  {iconForLabel(line.label)}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">{line.label}:</span>{" "}
                  {line.text}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {item.relatedExerciseIds.length > 0 ? (
          <section className="mt-8 fade-up">
            <p className="section-label">Pairs with training</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
              {item.relatedExerciseIds.slice(0, 3).map((id) => {
                const exercise = getExerciseById(id);
                if (!exercise) return null;
                return <li key={id}>{exercise.title}</li>;
              })}
            </ul>
          </section>
        ) : null}

        <div className="mt-8 mb-2 flex flex-col gap-3 fade-up fade-up-delay-3">
          {item.saleType === "own_brand" ? (
            <ShopBuyButton priceGbp={item.priceGbp} saleType="own_brand" />
          ) : item.affiliateUrl ? (
            <a
              href={item.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn btn-primary w-full"
            >
              View partner listing
            </a>
          ) : null}
          <p className="text-center text-xs leading-relaxed text-muted">
            {item.saleType === "own_brand"
              ? "Ships from our UK supply partner when checkout is live. Not veterinary advice."
              : `${item.fulfilmentNote}. Not veterinary advice.`}
            {item.priceGbp !== undefined
              ? ` Illustrated price ${formatGbp(item.priceGbp)}.`
              : ""}
          </p>
        </div>
      </div>
    </main>
  );
}

function detailIntro(id: string): string | null {
  if (id === "soft-training-bites") {
    return "High-value rewards for short training sessions — soft enough to break into tiny pieces.";
  }
  return null;
}

function iconForLabel(label: string) {
  const common = {
    className: "h-4 w-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (label) {
    case "Pack":
      return (
        <svg {...common}>
          <path d="M7 7h10v12H7z" />
          <path d="M9 7V5h6v2" />
        </svg>
      );
    case "Approx pouch":
      return (
        <svg {...common}>
          <path d="M4 7h16M8 7v10M16 7v10M4 17h16" />
        </svg>
      );
    case "Style":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="5" height="5" rx="1" />
          <rect x="13" y="6" width="5" height="5" rx="1" />
          <rect x="6" y="13" width="5" height="5" rx="1" />
          <rect x="13" y="13" width="5" height="5" rx="1" />
        </svg>
      );
    case "Use with":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="10" cy="11" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="14" cy="11" r="0.8" fill="currentColor" stroke="none" />
          <path d="M9.5 14.5c1 1.2 4 1.2 5 0" />
        </svg>
      );
    case "Fulfilment":
      return (
        <svg {...common}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7V10z" />
          <circle cx="7" cy="18" r="1.5" />
          <circle cx="17" cy="18" r="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}
