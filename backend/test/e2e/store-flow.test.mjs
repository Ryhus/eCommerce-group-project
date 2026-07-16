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
  const products = await agent.get("/api/v1/catalog/products").expect(200);
  const productId = products.body.items[0].id;

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

  const discountedCart = await agent
    .put("/api/v1/cart/discount-code")
    .set("X-CSRF-Token", csrf)
    .send({ code: "WELCOME10" })
    .expect(200);
  assert.ok(discountedCart.body.discount.amount > 0);

  await agent.post("/api/v1/auth/logout").set("X-CSRF-Token", csrf).expect(204);
  await agent.get("/api/v1/auth/me").expect(401);
});
