"use client";

import { useState } from "react";
import { formatGbp } from "@/lib/content/shop-items";

export function ShopBuyButton({
  priceGbp,
  saleType,
}: {
  priceGbp?: number;
  saleType: "own_brand" | "affiliate";
}) {
  const [shown, setShown] = useState(false);

  if (saleType === "affiliate") {
    return null;
  }

  const label =
    priceGbp !== undefined ? `Buy · ${formatGbp(priceGbp)}` : "Buy";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={() => setShown(true)}
      >
        {label}
      </button>
      {shown ? (
        <p
          className="rounded-xl bg-brand-soft px-3 py-3 text-sm leading-relaxed text-brand-deep"
          role="status"
        >
          Checkout is not live yet. When drop-ship is ready, this will be sold by
          Good Dog and fulfilled in the UK. Prices shown are illustrative.
        </p>
      ) : null}
    </div>
  );
}
