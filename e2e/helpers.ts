import type { Page } from "@playwright/test";

/** Dismiss the optional PWA install dialog so it does not block primary actions. */
export async function dismissInstallSplashIfVisible(page: Page): Promise<void> {
  const notNow = page.getByRole("dialog", { name: "Install Good Dog" }).getByRole("button", {
    name: /Not now|Got it/i,
  });
  try {
    await notNow.click({ timeout: 5_000 });
  } catch {
    // Dialog not shown (already dismissed or standalone).
  }
}
