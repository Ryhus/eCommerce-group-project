import { expect, test } from "@playwright/test";

test("switches and persists the interface language", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page).toHaveTitle("Sport Gear | Sportausrüstung");
  await expect(page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" })).toContainText("DE");
  await expect(page.getByRole("complementary", { name: "Aktionsankündigung" })).toContainText("20 % Rabatt");
  await expect(
    page.getByRole("navigation", { name: "Hauptnavigation" }).getByRole("link", { name: "Über uns" })
  ).toBeVisible();
  await expect(page.getByRole("search", { name: "Produktsuche" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Unternehmen" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "VERPASSE KEINE UNSERER NEUESTEN ANGEBOTE" })).toBeVisible();

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" })).toContainText("DE");
  await expect(page.getByRole("navigation", { name: "Hauptnavigation" })).toBeVisible();

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page).toHaveTitle("Sport Gear | Спортивные товары");
  await expect(page.getByRole("button", { name: "Текущий язык: Русский" })).toContainText("RU");
  await expect(page.getByRole("navigation", { name: "Основная навигация" })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "Поиск товаров" })).toHaveAttribute(
    "placeholder",
    "Найти товары..."
  );
  await expect(page.getByRole("navigation", { name: "Компания" })).toBeVisible();
  await expect(page.getByText("Демонстрационный магазин · Платежи не проводятся")).toBeVisible();
});

test("switches the language from mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByText("Language", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();

  await expect(page.getByRole("button", { name: "Закрыть меню" })).toBeVisible();
  await expect(page.getByText("Язык", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: "Магазин" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Текущий язык: Русский" })).toContainText("RU");
});

test("registers, shops with a promo code, opens profile and logs out", async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await page.getByPlaceholder("John").fill("Playwright");
  await page.getByPlaceholder("Doe").fill("User");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Create a password").fill("Strong!Pass1");
  await page.getByPlaceholder("Repeat your password").fill("Strong!Pass1");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Date of birth").fill("1990-01-01");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Street address").fill("Browser Street 1");
  await page.getByLabel("City").fill("Berlin");
  await page.getByLabel("Postal code").fill("10115");
  await page.getByLabel("Country").selectOption("DE");
  await page.getByRole("checkbox", { name: "Use as default billing and shipping address" }).check();
  await page.getByRole("button", { name: "Create account" }).click();

  const accountLink = page.getByRole("link", { name: "Open Playwright's account" });
  await expect(accountLink).toContainText("PU");
  await expect(accountLink).toContainText("Hi, Playwright");

  await page.goto("/login");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toHaveCount(0);

  await page.goto("/sign-up");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Create your account" })).toHaveCount(0);

  await page.getByRole("link", { name: "Catalog" }).click();
  await page.getByRole("button", { name: "Add to Cart" }).first().click();

  const cartLink = page.getByRole("link", { name: "Shopping cart, 1 item" });
  await expect(cartLink).toBeVisible();
  await cartLink.click();
  await page.getByPlaceholder("Add promo code").fill("WELCOME10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByLabel("Applied promo code")).toContainText("WELCOME10");
  await expect(page.getByText("Discount", { exact: true })).toBeVisible();

  await accountLink.click();
  await expect(page.getByRole("heading", { level: 1, name: "My account" })).toBeVisible();
  const personalDetailsRegion = page.getByRole("region", { name: "Personal details" });
  await expect(personalDetailsRegion).toBeVisible();
  await expect(personalDetailsRegion.getByText(email)).toBeVisible();
  await expect(page.getByRole("region", { name: "Security" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Saved addresses" })).toBeVisible();

  await page.getByRole("button", { name: "Edit profile" }).click();
  const editProfileRegion = page.getByRole("region", { name: "Edit personal details" });
  await expect(editProfileRegion).toBeVisible();
  await expect(editProfileRegion.getByLabel("Email address", { exact: true })).toHaveValue(email);
  await page.getByRole("button", { name: "Cancel" }).click();

  await page.getByRole("button", { name: "Delete Browser Street 1" }).click();
  await expect(page.getByRole("alertdialog", { name: "Delete address?" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  const signedOutAccountLink = page.getByLabel("Sign in", { exact: true });
  await expect(signedOutAccountLink).toContainText("Your account");

  const emptyCartLink = page.getByRole("link", { name: "Shopping cart, empty" });
  await expect(emptyCartLink).toBeVisible();
  await emptyCartLink.click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
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

test("hides stale catalog and product content while slow requests are pending", async ({ page }) => {
  let delayNextCatalogRequest = false;
  let catalogRequestBlocked = false;
  let releaseCatalogRequest = () => {};
  let delayNextProductRequest = false;
  let productRequestBlocked = false;
  let releaseProductRequest = () => {};

  await page.route(/\/api\/v1\/catalog\/products(?:\?.*)?$/, async (route) => {
    if (delayNextCatalogRequest) {
      delayNextCatalogRequest = false;
      catalogRequestBlocked = true;
      await new Promise<void>((resolve) => {
        releaseCatalogRequest = resolve;
      });
      catalogRequestBlocked = false;
    }
    await route.continue();
  });

  await page.route(/\/api\/v1\/catalog\/products\/[^/?]+(?:\?.*)?$/, async (route) => {
    if (delayNextProductRequest) {
      delayNextProductRequest = false;
      productRequestBlocked = true;
      await new Promise<void>((resolve) => {
        releaseProductRequest = resolve;
      });
      productRequestBlocked = false;
    }
    await route.continue();
  });

  await page.goto("/catalog");
  await expect(page.getByText("Showing 1-6 of 8 products")).toBeVisible();
  const previousCatalogProduct = await page
    .getByRole("link", { name: /^View / })
    .first()
    .getAttribute("aria-label");

  delayNextCatalogRequest = true;
  await page.getByRole("button", { name: "Next page" }).click();

  await expect(page.getByRole("status", { name: "Catalog loading" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect.poll(() => catalogRequestBlocked).toBe(true);
  if (previousCatalogProduct) {
    await expect(page.getByRole("link", { name: previousCatalogProduct })).toHaveCount(0);
  }

  releaseCatalogRequest();
  await expect(page.getByText("Showing 7-8 of 8 products")).toBeVisible();

  await page
    .getByRole("link", { name: /^View / })
    .first()
    .click();
  const currentProductHeading = page.locator(".product-page__main h1");
  await expect(currentProductHeading).toBeVisible();
  const previousProductName = await currentProductHeading.textContent();
  const relatedProductLink = page.locator(".related-products .product-card__link").first();
  await expect(relatedProductLink).toBeVisible();
  const nextProductLabel = await relatedProductLink.getAttribute("aria-label");
  if (!nextProductLabel) throw new Error("Related product link must have an accessible label.");

  delayNextProductRequest = true;
  await relatedProductLink.click();

  await expect(page.getByRole("status", { name: "Product loading" })).toBeVisible();
  await expect.poll(() => productRequestBlocked).toBe(true);
  if (previousProductName) {
    await expect(page.getByRole("heading", { name: previousProductName })).toHaveCount(0);
  }

  releaseProductRequest();
  await expect(page.getByRole("heading", { name: nextProductLabel.replace(/^View /, "") })).toBeVisible();
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
