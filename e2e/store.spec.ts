import { expect, test } from "@playwright/test";

test("registers, shops with a promo code, opens profile and logs out", async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await page.getByPlaceholder("John").fill("Playwright");
  await page.getByPlaceholder("Doe").fill("User");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Enter your password", { exact: true }).fill("Strong!Pass1");
  await page.getByPlaceholder("Re-enter your password").fill("Strong!Pass1");
  await page.locator('input[type="date"]').fill("1990-01-01");
  await page.getByPlaceholder("Enter street address").fill("Browser Street 1");
  await page.getByPlaceholder("Brussels").fill("Berlin");
  await page.getByPlaceholder(/Enter postal code/).fill("10115");
  await page.locator("select").selectOption("DE");
  await page.locator('input[type="checkbox"]').check();
  await page.locator(".register-btn").click();

  await expect(page.getByRole("button", { name: "Profile" })).toBeVisible();
  await page.getByRole("link", { name: "Catalog" }).click();
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
  await expect(page.locator(".nav-basket")).toContainText("(1)");

  await page.locator(".nav-basket").click();
  await page.getByPlaceholder("Add promo code").fill("WELCOME10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator(".discount-field .order-field-price")).not.toHaveText("€0.00");

  await page.getByRole("button", { name: "Profile" }).click();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});
