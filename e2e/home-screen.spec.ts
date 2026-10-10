import { expect, test } from "@playwright/test";

test.describe("home screen metadata", () => {
  test("landing page advertises manifest, icons and app-like viewport", async ({ page, request }) => {
    await page.goto("/");

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(manifestHref).toBeTruthy();
    const manifestRes = await request.get(manifestHref!);
    expect(manifestRes.ok()).toBe(true);
    const manifest = await manifestRes.json();
    expect(manifest.display).toBe("standalone");

    for (const icon of manifest.icons as { src: string }[]) {
      const res = await request.get(icon.src);
      expect(res.status(), icon.src).toBe(200);
      expect(res.headers()["content-type"], icon.src).toContain("image/png");
    }

    const touchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
    expect(touchIcon).toBeTruthy();
    expect((await request.get(touchIcon!)).status()).toBe(200);

    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute("content");
    expect(themeColor).toBe(manifest.theme_color);

    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toContain("viewport-fit=cover");

    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute(
      "content",
      "yes",
    );
  });
});
