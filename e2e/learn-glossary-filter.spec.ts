import { expect, test } from "@playwright/test";

test("Learn glossary exposure filter", async ({ page }) => {
  const email = `learn-${Date.now()}@example.com`;
  const password = "password123";

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await page.getByLabel("Dog’s name").fill("Pip");
  await page.getByLabel("What would you most like help with?").fill("Everyday manners");
  await page.getByRole("button", { name: "Create my first plan" }).click();

  await page.getByRole("link", { name: "Learn" }).click();
  await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();

  await page.getByTestId("glossary-filter-explored").click();
  await expect(page.getByTestId("glossary-filter-explored")).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  const summary = page.locator('[aria-live="polite"]');
  await expect(summary).toContainText("0 terms");

  await page.getByTestId("glossary-filter-all").click();
  await expect(summary).toContainText("terms");
});
