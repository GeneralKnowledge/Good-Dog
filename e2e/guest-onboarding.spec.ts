import { expect, test } from "@playwright/test";
import { dismissInstallSplashIfVisible } from "./helpers";

test("guest can start today and finish outcome-led onboarding", async ({ page }) => {
  await page.goto("/");
  await dismissInstallSplashIfVisible(page);
  await expect(page.getByRole("heading", { name: /few quiet minutes/i })).toBeVisible();

  await page.getByRole("button", { name: "Start today" }).click();
  await expect(page.getByRole("heading", { name: /what would feel like a win/i })).toBeVisible();

  await page.getByRole("button", { name: "Calmer walks" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: /shared stroll/i })).toBeVisible();

  await page.getByRole("button", { name: /tell us about your dog/i }).click();
  await page.getByLabel("Dog’s name").fill("River");
  await page.getByRole("button", { name: "Create my first plan" }).click();

  await expect(page.getByRole("heading", { name: /today with river/i })).toBeVisible();
});
