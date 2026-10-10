/**
 * Curated shop catalogue — exploration UI.
 * Own-brand rows mirror the Pero Signature–style mockup SKUs.
 * Affiliate rows are outbound kit ideas; tags/URLs are placeholders until programmes are approved.
 */

export type ShopSaleType = "own_brand" | "affiliate";
export type ShopSupplier = "pero_trade" | "amazon" | "zooplus";
export type ShopCategory = "session_kit" | "walk_kit" | "calm_enrichment" | "puppy_basics";

export interface ShopItem {
  id: string;
  title: string;
  blurb: string;
  /** Short line under the title on list rows (e.g. pack size). */
  packLabel: string;
  category: ShopCategory;
  saleType: ShopSaleType;
  supplier: ShopSupplier;
  published: boolean;
  priceGbp?: number;
  sku?: string;
  imageSrc: string;
  relatedExerciseIds: string[];
  relatedTermIds: string[];
  /** Own-brand detail facts */
  detailLines?: Array<{ label: string; text: string }>;
  /** Affiliate outbound URL */
  affiliateUrl?: string;
  fulfilmentNote: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "soft-training-bites",
    title: "Soft Training Bites",
    blurb: "Soft high-value rewards for short sessions.",
    packLabel: "100 g",
    category: "session_kit",
    saleType: "own_brand",
    supplier: "pero_trade",
    published: true,
    priceGbp: 6.5,
    sku: "GD-BITES-CHICKEN-CHIA-100",
    imageSrc: "/shop/soft-training-bites.svg",
    relatedExerciseIds: ["ex-name-response", "ex-reward-marker", "ex-sit-comfort"],
    relatedTermIds: ["reward", "positive-reinforcement", "marker-word"],
    detailLines: [
      { label: "Pack", text: "100 g recyclable stand-up pouch" },
      {
        label: "Approx pouch",
        text: "110 × 160 mm (typical UK 100 g treat doypack)",
      },
      {
        label: "Style",
        text: "Air-dried Meaty Bites–style cubes (Chicken & Chia)",
      },
      {
        label: "Use with",
        text: "Name response, sit, marker practice",
      },
      {
        label: "Fulfilment",
        text: "Sold by Good Dog · UK drop-ship",
      },
    ],
    fulfilmentNote: "Sold by Good Dog · Fulfilled via UK drop-ship partner",
  },
  {
    id: "natural-chicken-sticks",
    title: "Natural Chicken Sticks",
    blurb: "Longer-lasting stick for garden recall games.",
    packLabel: "200 g",
    category: "session_kit",
    saleType: "own_brand",
    supplier: "pero_trade",
    published: true,
    priceGbp: 7.95,
    sku: "GD-STICKS-CHICKEN-200",
    imageSrc: "/shop/natural-chicken-sticks.svg",
    relatedExerciseIds: ["ex-recall-foundation", "ex-recall-mild-distract"],
    relatedTermIds: ["reward", "recall"],
    detailLines: [
      { label: "Pack", text: "200 g recyclable stand-up pouch" },
      {
        label: "Approx pouch",
        text: "100 × 200 mm (typical UK stick bag)",
      },
      { label: "Style", text: "100% meat chicken sticks" },
      {
        label: "Use with",
        text: "Recall and outdoor check-ins",
      },
      {
        label: "Fulfilment",
        text: "Sold by Good Dog · UK drop-ship",
      },
    ],
    fulfilmentNote: "Sold by Good Dog · Fulfilled via UK drop-ship partner",
  },
  {
    id: "rabbit-jerky",
    title: "Rabbit Jerky",
    blurb: "Breakable jerky for name practice.",
    packLabel: "150 g",
    category: "session_kit",
    saleType: "own_brand",
    supplier: "pero_trade",
    published: true,
    priceGbp: 8.5,
    sku: "GD-JERKY-RABBIT-150",
    imageSrc: "/shop/rabbit-jerky.svg",
    relatedExerciseIds: ["ex-name-response", "ex-name-mild-distract"],
    relatedTermIds: ["reward", "marker-word"],
    detailLines: [
      { label: "Pack", text: "150 g recyclable stand-up pouch" },
      {
        label: "Approx pouch",
        text: "110 × 170 mm (typical UK jerky pouch)",
      },
      { label: "Style", text: "Novel-protein rabbit jerky strips" },
      {
        label: "Use with",
        text: "Name response and engagement games",
      },
      {
        label: "Fulfilment",
        text: "Sold by Good Dog · UK drop-ship",
      },
    ],
    fulfilmentNote: "Sold by Good Dog · Fulfilled via UK drop-ship partner",
  },
  {
    id: "affiliate-harness-lead",
    title: "Harnesses & leads",
    blurb: "Well-fitting harness and soft lead ideas for loose-lead practice.",
    packLabel: "Via Amazon / Zooplus",
    category: "walk_kit",
    saleType: "affiliate",
    supplier: "amazon",
    published: true,
    imageSrc: "/shop/affiliate-kit.svg",
    relatedExerciseIds: ["ex-lead-intro", "ex-lead-loose"],
    relatedTermIds: ["loose-lead-walking", "management"],
    affiliateUrl:
      "https://www.amazon.co.uk/s?k=dog+harness+and+lead",
    fulfilmentNote: "We may earn a commission",
  },
];

export function getPublishedShopItems(): ShopItem[] {
  return SHOP_ITEMS.filter((item) => item.published);
}

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === id && item.published);
}

export function formatGbp(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
