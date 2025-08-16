import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimiter } from "../rate-limit";
import { getClientIdentifier } from "../rate-limit";

describe("Rate Limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getClientIdentifier", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost:3000/api/test", {
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("192.168.1.1");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = new Request("http://localhost:3000/api/test", {
        headers: {
          "x-real-ip": "203.0.113.1",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("203.0.113.1");
    });

    it("should extract IP from cf-connecting-ip header", () => {
      const request = new Request("http://localhost:3000/api/test", {
        headers: {
          "cf-connecting-ip": "198.51.100.1",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("198.51.100.1");
    });

    it("should return unknown when no IP headers are present", () => {
      const request = new Request("http://localhost:3000/api/test");

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("unknown");
    });
  });

  describe("RateLimiter", () => {
    it("should allow requests within the limit", () => {
      const identifier = "test-client";

      for (let i = 0; i < 100; i++) {
        const result = rateLimiter.isRateLimited(identifier);
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(99 - i);
      }
    });

    it("should block requests after reaching the limit", () => {
      const identifier = "test-client-2";

      for (let i = 0; i < 100; i++) {
        rateLimiter.isRateLimited(identifier);
      }

      const result = rateLimiter.isRateLimited(identifier);
      expect(result.limited).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it("should reset after the time window expires", () => {
      const identifier = "test-client-3";

      for (let i = 0; i < 50; i++) {
        rateLimiter.isRateLimited(identifier);
      }

      const result1 = rateLimiter.isRateLimited(identifier);
      expect(result1.limited).toBe(false);
      expect(result1.remaining).toBe(49);

      vi.advanceTimersByTime(60 * 60 * 1000 + 1000);

      const result2 = rateLimiter.isRateLimited(identifier);
      expect(result2.limited).toBe(false);
      expect(result2.remaining).toBe(99);
    });

    it("should handle multiple clients independently", () => {
      const client1 = "client-1";
      const client2 = "client-2";

      for (let i = 0; i < 50; i++) {
        rateLimiter.isRateLimited(client1);
        rateLimiter.isRateLimited(client2);
      }

      const result1 = rateLimiter.isRateLimited(client1);
      const result2 = rateLimiter.isRateLimited(client2);

      expect(result1.limited).toBe(false);
      expect(result1.remaining).toBe(49);
      expect(result2.limited).toBe(false);
      expect(result2.remaining).toBe(49);
    });

    it("should clean up expired entries", () => {
      const identifier = "test-cleanup";

      rateLimiter.isRateLimited(identifier);

      vi.advanceTimersByTime(60 * 60 * 1000 + 1000);

      const result = rateLimiter.isRateLimited(identifier);
      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(99);
    });
  });
});
