// /app/api/hello/route.test.ts
import { testApiHandler } from "next-test-api-route-handler"; // Must always be first
import * as appHandler from "../route";
import { describe, expect, it } from "vitest";

describe("GET /api/offices", () => {
  it("should return 200 for valid query params", async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(originalReq) {
        return new Request(originalReq.url + "?arr=1", {
          method: originalReq.method,
          headers: originalReq.headers,
          body: originalReq.body,
        });
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(200);
      },
    });
  });

  it("should return 400 for invalid query params", async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(originalReq) {
        return new Request(originalReq.url + "?arr=test", {
          method: originalReq.method,
          headers: originalReq.headers,
          body: originalReq.body,
        });
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(400);
      },
    });
  });
});
