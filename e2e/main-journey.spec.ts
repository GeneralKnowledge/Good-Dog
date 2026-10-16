import { expect, test } from "@playwright/test";
import { dismissInstallSplashIfVisible } from "./helpers";

test("main owner journey", async ({ page }) => {
  const email = `owner-${Date.now()}@example.com`;
  const password = "password123";

  await page.goto("/");
  await dismissInstallSplashIfVisible(page);
  await expect(page.getByRole("heading", { name: /few quiet minutes/i })).toBeVisible();
  await page.getByRole("link", { name: "Create account" }).click();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: /what would feel like a win/i })).toBeVisible();
  await page.getByRole("button", { name: "Everyday manners" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /tell us about your dog/i }).click();
  await page.getByLabel("Dog’s name").fill("Pip");
  await page.getByRole("button", { name: "Create my first plan" }).click();

  await expect(page.getByRole("heading", { name: /today with pip/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start" }).first()).toBeVisible();

  await page.getByRole("link", { name: "Start" }).first().click();
  await expect(page.getByText("Let’s practise")).toBeVisible();
  await page.getByRole("button", { name: "Finish and tell us how it went" }).click();
  await page.getByRole("button", { name: /Easy/i }).click();
  await expect(page.getByText(/useful feedback/i)).toBeVisible();

  await page.getByRole("link", { name: "Back to today’s plan" }).click();
  await expect(page.getByText(/done/i).first()).toBeVisible();

  await page.goto("/today");
  await expect(page.getByRole("heading", { name: /today with pip/i })).toBeVisible();

  await page.getByRole("link", { name: "Shop" }).click();
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
  await expect(page.getByText(/Soft Training Bites/i)).toBeVisible();

  await page.getByRole("link", { name: "My dog" }).click();
  await expect(page.getByRole("heading", { name: "Pip" })).toBeVisible();
  await expect(page.getByText(/skills in progress|recent practice|we’ve started|in progress/i).first()).toBeVisible();
});

