import { expect, test } from "@playwright/test";

test("desktop layout uses sidebar navigation", async ({ page }) => {
  const email = `desktop-${Date.now()}@example.com`;
  const password = "password123";

  await page.goto("/");
  await page.getByRole("link", { name: "Get started" }).click();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: /tell us about your dog/i })).toBeVisible();
  await page.getByLabel("Dog’s name").fill("River");
  await page.getByLabel("What would you most like help with?").fill("Calm greetings");
  await page.getByRole("button", { name: "Create my first plan" }).click();

  await expect(page.getByRole("heading", { name: /today with river/i })).toBeVisible();

  const sidebar = page.locator(".app-sidebar");
  const bottomNav = page.locator(".nav-bar");

  await expect(sidebar).toBeVisible();
  await expect(bottomNav).toBeHidden();

  await sidebar.getByRole("link", { name: "Shop" }).click();
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
});
