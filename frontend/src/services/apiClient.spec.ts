import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { apiClient } from "./apiClient";

let protectedCalls = 0;
let refreshCalls = 0;
let mutationCsrfHeader: string | null = null;

const server = setupServer(
  http.get("http://localhost:3000/api/v1/auth/csrf", () => HttpResponse.json({ csrfToken: "csrf-token" })),
  http.post("http://localhost:3000/api/v1/mutation", ({ request }) => {
    mutationCsrfHeader = request.headers.get("x-csrf-token");
    return HttpResponse.json({ ok: true });
  }),
  http.get("http://localhost:3000/api/v1/protected", () => {
    protectedCalls += 1;
    return protectedCalls === 1 ? HttpResponse.json({}, { status: 401 }) : HttpResponse.json({ ok: true });
  }),
  http.post("http://localhost:3000/api/v1/auth/refresh", ({ request }) => {
    expect(request.headers.get("x-csrf-token")).toBe("csrf-token");
    refreshCalls += 1;
    return new HttpResponse(null, { status: 204 });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

describe("apiClient", () => {
  it("adds CSRF to mutations and retries once after refreshing a 401", async () => {
    await expect(apiClient.post("/mutation")).resolves.toMatchObject({ data: { ok: true } });
    expect(mutationCsrfHeader).toBe("csrf-token");

    await expect(apiClient.get("/protected")).resolves.toMatchObject({ data: { ok: true } });
    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(2);
  });
});
