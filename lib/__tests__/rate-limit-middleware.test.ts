import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "../rate-limit-middleware";
import { rateLimiter } from "../rate-limit";

describe("Rate Limit Middleware", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow requests within the limit", async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ success: true }));

    const wrappedHandler = withRateLimit(mockHandler);

    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    });

    const response = await wrappedHandler(request);

    expect(response.status).toBe(200);
    expect(mockHandler).toHaveBeenCalledTimes(1);

    const responseData = await response.json();
    expect(responseData).toEqual({ success: true });
  });

  it("should return 429 when rate limit is exceeded", async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ success: true }));

    const wrappedHandler = withRateLimit(mockHandler);

    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.2",
      },
    });

    for (let i = 0; i < 100; i++) {
      await wrappedHandler(request);
    }

    const response = await wrappedHandler(request);

    expect(response.status).toBe(429);
    expect(mockHandler).toHaveBeenCalledTimes(100);

    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
      retryAfter: expect.any(Number),
    });
  });

  it("should include rate limit headers in successful responses", async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ success: true }));

    const wrappedHandler = withRateLimit(mockHandler);

    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.3",
      },
    });

    const response = await wrappedHandler(request);

    expect(response.headers.get("X-RateLimit-Limit")).toBe("100");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("99");
    expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
  });

  it("should include rate limit headers in 429 responses", async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ success: true }));

    const wrappedHandler = withRateLimit(mockHandler);

    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.4",
      },
    });

    for (let i = 0; i < 100; i++) {
      await wrappedHandler(request);
    }

    const response = await wrappedHandler(request);

    expect(response.headers.get("X-RateLimit-Limit")).toBe("100");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
    expect(response.headers.get("Retry-After")).toBeDefined();
  });

  it("should handle different client identifiers independently", async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ success: true }));

    const wrappedHandler = withRateLimit(mockHandler);

    const request1 = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.5",
      },
    });

    const request2 = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.6",
      },
    });

    for (let i = 0; i < 50; i++) {
      await wrappedHandler(request1);
      await wrappedHandler(request2);
    }

    const response1 = await wrappedHandler(request1);
    const response2 = await wrappedHandler(request2);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(mockHandler).toHaveBeenCalledTimes(102);
  });

  it("should handle requests without IP headers", async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(NextResponse.json({ success: true }));

    const wrappedHandler = withRateLimit(mockHandler);

    const request = new NextRequest("http://localhost:3000/api/test");

    const response = await wrappedHandler(request);

    expect(response.status).toBe(200);
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
