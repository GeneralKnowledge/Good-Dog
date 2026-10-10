import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ShopAddButton } from "@/components/shop/ShopAddButton";
import {
  formatGbp,
  getPublishedShopItems,
} from "@/lib/content/shop-items";
import { requireUser } from "@/lib/auth/session";

export default async function ShopPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const items = getPublishedShopItems();
  const ownBrand = items.filter((i) => i.saleType === "own_brand");
  const affiliates = items.filter((i) => i.saleType === "affiliate");

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Shop"
        subtitle="Training treats, sold by us and drop-shipped in the UK."
      />

      <div className="sheet flex flex-1 flex-col">
        <section className="fade-up fade-up-delay-1">
          <h2 className="heading-subsection">Own brand · Session kit</h2>

          <ul className="grid-cards-2 mt-4">
            {ownBrand.map((item) => (
              <li key={item.id} className="card flex items-start gap-3 p-4">
                <Link
                  href={`/shop/${item.id}`}
                  className="relative h-[4.5rem] w-[3.5rem] shrink-0 overflow-hidden rounded-lg bg-brand-soft"
                >
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/shop/${item.id}`} className="block">
                    <h3 className="heading-subsection leading-snug">{item.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{item.packLabel}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.blurb}
                    </p>
                    {item.priceGbp !== undefined ? (
                      <p className="heading-subsection mt-2 text-accent">
                        {formatGbp(item.priceGbp)}
                      </p>
                    ) : null}
                  </Link>
                </div>
                <ShopAddButton />
              </li>
            ))}
          </ul>

          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-brand-deep">
            <TruckIcon />
            <span>Sold by Good Dog · Fulfilled via UK drop-ship partner</span>
          </p>
        </section>

        <hr className="my-8 hairline" />

        <section className="pb-2 fade-up">
          <h2 className="heading-subsection">Also useful (affiliate)</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {affiliates.map((item) => (
              <li key={item.id} className="plan-row">
                <div className="flex items-start gap-3 w-full">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-brand-soft">
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-brand-deep">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.blurb}
                    </p>
                    <p className="mt-2 text-xs text-muted">{item.fulfilmentNote}</p>
                    {item.affiliateUrl ? (
                      <a
                        href={item.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="btn btn-secondary mt-3 w-full"
                      >
                        View on Amazon UK
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Affiliate links may earn Good Dog a commission. Own-brand treats are sold
            by us when checkout goes live — prices shown are illustrative until then.
          </p>
        </section>
      </div>
    </main>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7V10z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}
