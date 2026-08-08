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
  await expect(
    page.getByRole("heading", { level: 1, name: "FINDE AUSRÜSTUNG, DIE ZU DEINEN ZIELEN PASST" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Jetzt shoppen" })).toHaveAttribute("href", "/catalog");
  await expect(page.getByRole("group", { name: "Sportarten bei Sport Gear" })).toContainText("Regenerieren");
  await expect(page.getByRole("region", { name: "Neu eingetroffen" })).toBeVisible();
  await expect(page.getByRole("region", { name: "NACH SPORTART ENTDECKEN" })).toContainText("Krafttraining");
  await expect(page.getByRole("region", { name: "WARUM SPORT GEAR" })).toContainText("Preise direkt vom Server");

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
  await expect(page.getByRole("heading", { level: 1, name: "НАЙДИ ЭКИПИРОВКУ ДЛЯ СВОИХ ЦЕЛЕЙ" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Перейти в магазин" })).toHaveAttribute("href", "/catalog");
  await expect(page.getByRole("region", { name: "Новинки" })).toBeVisible();
  await expect(page.getByRole("region", { name: "ВЫБЕРИТЕ ВИД СПОРТА" })).toContainText("Силовые тренировки");
  await expect(page.getByRole("region", { name: "ПОЧЕМУ SPORT GEAR" })).toContainText("Безопасные сессии");
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

test("localizes catalog controls across desktop and mobile layouts", async ({ page }) => {
  await page.goto("/catalog");

  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Alle Produkte" })).toBeVisible();
  await expect(page.getByText("1-6 von 8 Produkten")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb-Navigation" })).toContainText("StartseiteKatalog");
  await expect(page.getByRole("region", { name: "Kategorien" })).toContainText("Alle Produkte");
  await expect(page.getByRole("combobox", { name: "Produkte sortieren" })).toHaveValue("default");
  await expect(page.getByRole("button", { name: "In den Warenkorb" }).first()).toBeVisible();
  await expect(page.locator(".product-card__current-price").first()).toContainText(/\d+,\d{2}\s€/);
  await expect(page.getByRole("navigation", { name: "Katalogseiten" })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Katalogoptionen öffnen" }).click();

  const drawer = page.getByRole("dialog", { name: "Katalogoptionen" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("combobox", { name: "Produkte sortieren" })).toBeVisible();
  await expect(drawer.getByRole("region", { name: "Kategorien" })).toContainText("Alle Produkte");

  await drawer.getByRole("button", { name: "Katalogoptionen schließen" }).click();
  await expect(drawer).toHaveCount(0);
});

test("localizes product purchase and gallery controls", async ({ page }) => {
  await page.goto("/catalog");

  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();
  await page.getByRole("link", { name: "Control Tennis Racket ansehen" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Control Tennis Racket" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb-Navigation" })).toContainText("StartseiteKatalog");
  await expect(page.getByRole("region", { name: "Bilder von Control Tennis Racket" })).toBeVisible();
  await expect(page.getByLabel("Produktpreis")).toContainText("89,99 €");
  await expect(page.getByLabel(/Vorheriger Preis 109,99\s€/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Das könnte dir auch gefallen" })).toBeVisible();

  await page.getByRole("button", { name: "Menge erhöhen" }).click();
  await page.getByRole("button", { name: "In den Warenkorb" }).click();
  await expect(page.getByText("2 × Control Tennis Racket zum Warenkorb hinzugefügt.")).toBeVisible();

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();
  await page.setViewportSize({ width: 390, height: 844 });

  await expect(page.getByLabel("Цена товара")).toContainText("89,99 €");
  await expect(page.getByRole("group", { name: "Количество товара" })).toBeVisible();
  await page.getByRole("button", { name: "Увеличить Control Tennis Racket, изображение 1 из 1" }).click();

  const galleryDialog = page.getByRole("dialog", { name: "Увеличенное изображение Control Tennis Racket" });
  await expect(galleryDialog).toBeVisible();
  await galleryDialog.getByRole("button", { name: "Закрыть увеличенное изображение" }).click();
  await expect(galleryDialog).toHaveCount(0);
});

test("localizes basket items, promo code and order summary", async ({ page }) => {
  await page.goto("/catalog");

  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();
  await page.getByRole("button", { name: "In den Warenkorb" }).first().click();
  await page.getByRole("link", { name: "Warenkorb, 1 Artikel" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Dein Warenkorb" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb-Navigation" })).toContainText("StartseiteWarenkorb");
  await expect(page.getByRole("region", { name: "Artikel im Warenkorb" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bestellübersicht" })).toBeVisible();
  await expect(page.getByText("Gesamtsumme").locator("..")).toContainText(/\d+,\d{2}\s€/);

  await page.getByPlaceholder("Aktionscode hinzufügen").fill("welcome10");
  await page.getByRole("button", { name: "Anwenden" }).click();
  await expect(page.getByLabel("Angewendeter Aktionscode")).toContainText("WELCOME10");
  await expect(page.getByText("Rabatt", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Ваша корзина" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Сумма заказа" })).toBeVisible();
  await expect(page.getByLabel("Применённый промокод")).toContainText("Промокод применён");
  await expect(page.getByRole("button", { name: "Удалить промокод WELCOME10" })).toBeVisible();
});

test("localizes login validation and authentication states", async ({ page }) => {
  await page.route("**/api/v1/auth/login", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "Email or password is incorrect",
        requestId: "playwright-login",
      }),
      contentType: "application/json",
      status: 401,
    });
  });

  await page.goto("/login");
  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Willkommen zurück" })).toBeVisible();
  const loginForm = page.getByRole("form", { exact: true, name: "Anmeldung" });
  await loginForm.getByRole("button", { name: "Anmelden" }).click();
  await expect(
    page.getByText("Die E-Mail-Adresse muss genau ein '@' zwischen lokalem Teil und Domain enthalten.")
  ).toBeVisible();
  await expect(page.getByText("Gib dein Passwort ein.")).toBeVisible();

  await loginForm.getByRole("textbox", { name: "E-Mail-Adresse" }).fill("shopper@example.com");
  const passwordInput = loginForm.getByRole("textbox", { exact: true, name: "Passwort" });
  await passwordInput.fill("wrong-password");
  await loginForm.getByRole("button", { name: "Passwort anzeigen" }).click();
  await expect(passwordInput).toHaveAttribute("type", "text");
  await loginForm.getByRole("button", { name: "Anmelden" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "E-Mail-Adresse oder Passwort ist falsch. Bitte versuche es erneut."
  );

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "С возвращением" })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveText("Неверная электронная почта или пароль. Попробуйте ещё раз.");
  await expect(page.getByRole("button", { name: "Скрыть пароль" })).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("form", { exact: true, name: "Вход в аккаунт" }).getByRole("link", { name: "Создать аккаунт" })
  ).toHaveAttribute("href", "/sign-up");
});

test("localizes the three-step signup flow and API error", async ({ page }) => {
  await page.route("**/api/v1/auth/register", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        statusCode: 409,
        code: "EMAIL_EXISTS",
        message: "Email is already registered",
        requestId: "playwright-signup",
      }),
      contentType: "application/json",
      status: 409,
    });
  });

  await page.goto("/sign-up");
  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();

  const signupForm = page.getByRole("form", { exact: true, name: "Dein Sport Gear Konto erstellen" });
  await expect(page.getByRole("heading", { level: 1, name: "Erstelle dein Konto" })).toBeVisible();
  await expect(signupForm.getByRole("navigation", { name: "Registrierungsfortschritt" })).toContainText("Konto");

  await signupForm.getByRole("textbox", { name: "Vorname" }).fill("Max");
  await signupForm.getByRole("textbox", { name: "Nachname" }).fill("Mustermann");
  await signupForm.getByRole("textbox", { name: "E-Mail-Adresse" }).fill("max@example.com");
  await signupForm.getByPlaceholder("Passwort erstellen").fill("Password1!");
  await signupForm.getByPlaceholder("Passwort wiederholen").fill("Password1!");
  await signupForm.getByRole("button", { name: "Weiter" }).click();

  await expect(signupForm.getByRole("heading", { name: "Ein bisschen über dich" })).toBeVisible();
  await signupForm.getByLabel("Geburtsdatum").fill("1990-01-01");
  await signupForm.getByRole("button", { name: "Weiter" }).click();

  await expect(signupForm.getByRole("heading", { name: "Deine Adresse" })).toBeVisible();
  await signupForm.getByRole("textbox", { name: "Straße und Hausnummer" }).fill("Hauptstraße 10");
  await signupForm.getByRole("textbox", { name: "Ort" }).fill("Berlin");
  await signupForm.getByRole("textbox", { name: "Postleitzahl" }).fill("10115");
  await signupForm.getByRole("combobox", { name: "Land" }).selectOption("DE");
  await signupForm
    .getByRole("checkbox", { name: "Als Standardadresse für Rechnungen und Lieferungen verwenden" })
    .check();
  await signupForm.getByRole("button", { name: "Konto erstellen" }).click();

  await expect(signupForm.getByRole("alert")).toHaveText(
    "Dein Konto konnte nicht erstellt werden. Bitte prüfe deine Angaben und versuche es erneut."
  );
  await expect(signupForm.getByRole("heading", { name: "Deine Adresse" })).toBeVisible();

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();

  const russianSignupForm = page.getByRole("form", { exact: true, name: "Создание аккаунта Sport Gear" });
  await expect(russianSignupForm.getByRole("heading", { name: "Ваш адрес" })).toBeVisible();
  await expect(russianSignupForm.getByRole("alert")).toHaveText(
    "Не удалось создать аккаунт. Проверьте данные и попробуйте ещё раз."
  );
  await expect(russianSignupForm.getByRole("button", { name: "Создать аккаунт" })).toBeVisible();
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

  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Mein Konto" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Persönliche Daten" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Sicherheit" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Gespeicherte Adressen" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Abmelden" })).toBeVisible();

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Мой аккаунт" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Личные данные" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Выйти" })).toBeVisible();

  await page.getByRole("button", { name: "Текущий язык: Русский" }).click();
  await page.getByRole("menuitemradio", { name: "EN English" }).click();
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

test("localizes the team page across supported languages", async ({ page }) => {
  await page.goto("/about");

  await page.getByRole("button", { name: "Current language: English" }).click();
  await page.getByRole("menuitemradio", { name: "DE Deutsch" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Unser Team" })).toBeVisible();
  await expect(page.getByText("Teamleitung & Full-Stack-Entwicklung")).toBeVisible();
  await expect(page.getByRole("list", { name: "Beiträge von Yevhen Ryhus" })).toBeVisible();
  await expect(page.getByRole("link", { name: "GitHub-Profil von Yevhen Ryhus ansehen" })).toHaveAttribute(
    "href",
    "https://github.com/ryhus"
  );

  await page.getByRole("button", { name: "Aktuelle Sprache: Deutsch" }).click();
  await page.getByRole("menuitemradio", { name: "RU Русский" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Наша команда" })).toBeVisible();
  await expect(page.getByText("Frontend-разработчик и QA")).toBeVisible();
  await expect(page.getByRole("list", { name: "Вклад Yevhen Ryhus" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Открыть GitHub-профиль Yevhen Ryhus" })).toBeVisible();
});
