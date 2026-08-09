import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { NestFactory } from "@nestjs/core";
import request from "supertest";
import { AppModule } from "../../dist/app.module.js";
import { configureApp } from "../../dist/app.setup.js";

let app;

before(async () => {
  process.env.NODE_ENV = "test";
  process.env.FRONTEND_ORIGIN = "http://localhost:5173";
  process.env.JWT_ACCESS_SECRET ??= "test-access-secret-000000000000000000";
  process.env.COOKIE_SECRET ??= "test-cookie-secret-000000000000000000";

  app = await NestFactory.create(AppModule, { logger: false });
  configureApp(app);
  await app.init();
});

after(async () => app?.close());

test("merges an anonymous cart on registration and protects profile data", async () => {
  const agent = request.agent(app.getHttpServer());
  const csrfResponse = await agent.get("/api/v1/auth/csrf").expect(200);
  const csrf = csrfResponse.body.csrfToken;
  const products = await agent
    .get("/api/v1/catalog/products")
    .query({ limit: 1, offset: 0, sort: "PRICE_DESC" })
    .expect(200);
  assert.equal(products.body.items.length, 1);
  assert.ok(products.body.total >= 3);
  const productId = products.body.items[0].id;
  await agent
    .get("/api/v1/catalog/products")
    .query({ limit: 1, offset: 1, sort: "NAME_ASC" })
    .expect(200)
    .expect(({ body }) => assert.equal(body.offset, 1));
  await agent
    .get("/api/v1/catalog/categories")
    .expect(200)
    .expect(({ body }) => assert.ok(body[0].children.length > 0));
  await agent
    .get("/api/v1/catalog/filters")
    .expect(200)
    .expect(({ body }) => {
      assert.equal(body.price.min, 2499);
      assert.equal(body.price.max, 8999);
      assert.ok(body.colors.some((option) => option.value === "navy" && option.count === 1));
      assert.ok(body.sizes.some((option) => option.value === "25-l" && option.count === 1));
    });
  await agent
    .get("/api/v1/catalog/products")
    .query({ colors: "navy", sizes: "25-l", limit: 100 })
    .expect(200)
    .expect(({ body }) => {
      assert.equal(body.total, 1);
      assert.equal(body.items[0].name, "Training Backpack");
    });
  await agent.get("/api/v1/catalog/products").query({ minPrice: 9000, maxPrice: 2000 }).expect(400);
  await agent
    .get("/api/v1/promotions/public")
    .expect(200)
    .expect(({ body }) => assert.ok(body.some((promotion) => promotion.code === "WELCOME10")));

  await agent.get("/api/v1/cart").expect(200);
  const anonymousCart = await agent
    .post("/api/v1/cart/items")
    .set("X-CSRF-Token", csrf)
    .send({ productId, quantity: 2 })
    .expect(201);
  assert.equal(anonymousCart.body.totalQuantity, 2);

  const email = `e2e-${Date.now()}@example.com`;
  const registration = await agent
    .post("/api/v1/auth/register")
    .set("X-CSRF-Token", csrf)
    .send({
      email,
      password: "Strong!Pass1",
      firstName: "Test",
      lastName: "User",
      dateOfBirth: "1990-01-01",
      address: { streetName: "Test Street 1", city: "Berlin", postalCode: "10115", country: "DE" },
      useAsDefaultAddress: true,
    })
    .expect(201);
  assert.equal(registration.body.cart.totalQuantity, 2);

  const me = await agent.get("/api/v1/auth/me").expect(200);
  assert.equal(me.body.email, email);

  const duplicateAgent = request.agent(app.getHttpServer());
  const duplicateCsrf = (await duplicateAgent.get("/api/v1/auth/csrf").expect(200)).body.csrfToken;
  const duplicate = await duplicateAgent
    .post("/api/v1/auth/register")
    .set("X-CSRF-Token", duplicateCsrf)
    .send({
      email: email.toUpperCase(),
      password: "Strong!Pass1",
      firstName: "Duplicate",
      lastName: "User",
      dateOfBirth: "1990-01-01",
      address: { streetName: "Other Street 1", city: "Berlin", postalCode: "10115", country: "DE" },
      useAsDefaultAddress: false,
    })
    .expect(409);
  assert.equal(duplicate.body.statusCode, 409);
  assert.ok(duplicate.body.requestId);

  const updatedProfile = await agent
    .patch("/api/v1/users/me")
    .set("X-CSRF-Token", csrf)
    .send({ firstName: "Updated" })
    .expect(200);
  assert.equal(updatedProfile.body.firstName, "Updated");

  const addresses = await agent
    .post("/api/v1/users/me/addresses")
    .set("X-CSRF-Token", csrf)
    .send({
      streetName: "Default Street 2",
      city: "Berlin",
      postalCode: "10117",
      country: "DE",
      isShipping: true,
      isDefaultShipping: true,
    })
    .expect(201);
  assert.equal(addresses.body.addresses.filter((address) => address.isDefaultShipping).length, 1);
  assert.equal(
    addresses.body.addresses.find((address) => address.streetName === "Default Street 2").isDefaultShipping,
    true
  );

  const passwordChange = await agent
    .post("/api/v1/users/me/password")
    .set("X-CSRF-Token", csrf)
    .send({ currentPassword: "Strong!Pass1", newPassword: "NewStrong!Pass2" })
    .expect(201);
  const refreshBeforeRotation = cookieValue(passwordChange.headers["set-cookie"], "REFRESH_TOKEN");
  assert.ok(refreshBeforeRotation);

  await agent.post("/api/v1/auth/refresh").set("X-CSRF-Token", csrf).expect(204);
  await request(app.getHttpServer())
    .post("/api/v1/auth/refresh")
    .set("Cookie", `REFRESH_TOKEN=${refreshBeforeRotation}; XSRF-TOKEN=${csrf}`)
    .set("X-CSRF-Token", csrf)
    .expect(401);

  await agent.post("/api/v1/auth/logout").set("X-CSRF-Token", csrf).expect(204);
  await agent.get("/api/v1/auth/me").expect(401);

  const login = await agent
    .post("/api/v1/auth/login")
    .set("X-CSRF-Token", csrf)
    .send({ email, password: "NewStrong!Pass2" })
    .expect(200);
  assert.equal(login.body.cart.totalQuantity, 2);

  await Promise.all([
    agent.post("/api/v1/cart/items").set("X-CSRF-Token", csrf).send({ productId, quantity: 1 }).expect(201),
    agent.post("/api/v1/cart/items").set("X-CSRF-Token", csrf).send({ productId, quantity: 2 }).expect(201),
  ]);
  const concurrentCart = await agent.get("/api/v1/cart").expect(200);
  assert.equal(concurrentCart.body.totalQuantity, 5);

  const discountedCart = await agent
    .put("/api/v1/cart/discount-code")
    .set("X-CSRF-Token", csrf)
    .send({ code: "WELCOME10" })
    .expect(200);
  assert.ok(discountedCart.body.discount.amount > 0);

  const withoutDiscount = await agent.delete("/api/v1/cart/discount-code").set("X-CSRF-Token", csrf).expect(200);
  assert.equal(withoutDiscount.body.discount.amount, 0);

  const isolatedCart = await duplicateAgent.get("/api/v1/cart").expect(200);
  assert.equal(isolatedCart.body.totalQuantity, 0);

  const clearedCart = await agent.delete("/api/v1/cart/items").set("X-CSRF-Token", csrf).expect(200);
  assert.equal(clearedCart.body.items.length, 0);

  await agent.post("/api/v1/auth/logout").set("X-CSRF-Token", csrf).expect(204);
  await agent.get("/api/v1/auth/me").expect(401);
});

function cookieValue(setCookieHeader, name) {
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader].filter(Boolean);
  const cookie = cookies.find((value) => value.startsWith(`${name}=`));
  return cookie?.slice(name.length + 1).split(";", 1)[0];
}
