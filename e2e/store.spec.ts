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

  await expect(page.getByRole("link", { name: "Open profile" })).toBeVisible();
  await page.getByRole("link", { name: "Catalog" }).click();
  await page.getByRole("button", { name: "Add to Cart" }).first().click();

  const cartLink = page.getByRole("link", { name: "Shopping cart, 1 items" });
  await expect(cartLink).toBeVisible();
  await cartLink.click();
  await page.getByPlaceholder("Add promo code").fill("WELCOME10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByLabel("Applied promo code")).toContainText("WELCOME10");
  await expect(page.getByText("Discount", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Open profile" }).click();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("manages product quantity and a promo code in the cart", async ({ page }) => {
  await page.goto("/catalog");
  await page
    .getByRole("link", { name: /^View / })
    .first()
    .click();

  await expect(page).toHaveURL(/\/product\/[0-9a-f-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByRole("status", { name: "Quantity" })).toHaveText("3");

  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText(/3 × .+ added to your cart\./)).toBeVisible();

  const cartLink = page.getByRole("link", { name: "Shopping cart, 3 items" });
  await expect(cartLink).toBeVisible();
  await cartLink.click();

  await expect(page.getByRole("heading", { level: 1, name: "Your cart" })).toBeVisible();
  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(page.getByRole("status", { name: "Quantity" })).toHaveText("2");

  await page.getByPlaceholder("Add promo code").fill("welcome10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByLabel("Applied promo code")).toContainText("WELCOME10");
  await expect(page.getByText("Discount", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Remove promo code WELCOME10" }).click();
  await expect(page.getByLabel("Applied promo code")).toHaveCount(0);

  await page.getByRole("button", { name: /Remove .+ from cart/ }).click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("opens the team page from the storefront navigation", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "About" }).click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: "Meet our team" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByText("Team Lead & Full-Stack Developer")).toBeVisible();
  await expect(page.getByText("Full-Stack Developer", { exact: true })).toBeVisible();
  await expect(page.getByText("Frontend Developer & QA")).toBeVisible();
  await expect(page.getByRole("link", { name: "View Yevhen Ryhus's GitHub profile" })).toHaveAttribute(
    "href",
    "https://github.com/ryhus"
  );
});
