import { describe, expect, it } from "vitest";
import { EXERCISE_LIBRARY } from "@/lib/content/exercises";
import { getGlossaryTerm } from "@/lib/content/glossary";
import {
  getPublishedShopItems,
  getShopItem,
  SHOP_ITEMS,
} from "@/lib/content/shop-items";

const exerciseIds = new Set(EXERCISE_LIBRARY.map((e) => e.id));

describe("shop catalogue", () => {
  it("publishes the three own-brand mockup SKUs plus an affiliate walk kit", () => {
    const published = getPublishedShopItems();
    expect(published.map((i) => i.id)).toEqual(
      expect.arrayContaining([
        "soft-training-bites",
        "natural-chicken-sticks",
        "rabbit-jerky",
        "affiliate-harness-lead",
      ]),
    );
    expect(published.filter((i) => i.saleType === "own_brand")).toHaveLength(3);
  });

  it("keeps Soft Training Bites detail aligned with the mockup", () => {
    const bites = getShopItem("soft-training-bites");
    expect(bites?.packLabel).toBe("100 g");
    expect(bites?.priceGbp).toBe(6.5);
    expect(bites?.detailLines?.some((l) => l.text.includes("110 × 160"))).toBe(
      true,
    );
    expect(bites?.fulfilmentNote.toLowerCase()).toMatch(/sold by good dog/);
  });

  it("resolves related exercises and glossary terms", () => {
    for (const item of SHOP_ITEMS) {
      for (const id of item.relatedExerciseIds) {
        expect(exerciseIds.has(id), `${item.id} → exercise ${id}`).toBe(true);
      }
      for (const id of item.relatedTermIds) {
        expect(getGlossaryTerm(id), `${item.id} → term ${id}`).toBeTruthy();
      }
      if (item.saleType === "affiliate") {
        expect(item.affiliateUrl?.startsWith("https://")).toBe(true);
      } else {
        expect(item.sku).toBeTruthy();
        expect(item.priceGbp).toBeGreaterThan(0);
      }
      expect(item.imageSrc.startsWith("/shop/")).toBe(true);
    }
  });
});
