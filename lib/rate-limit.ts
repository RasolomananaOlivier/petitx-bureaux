interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private readonly limit = 100;
  private readonly windowMs = 60 * 60 * 1000;

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  isRateLimited(identifier: string): {
    limited: boolean;
    remaining: number;
    resetTime: number;
  } {
    this.cleanup();

    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        limited: false,
        remaining: this.limit - 1,
        resetTime: now + this.windowMs,
      };
    }

    if (entry.count >= this.limit) {
      return {
        limited: true,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    return {
      limited: false,
      remaining: this.limit - entry.count,
      resetTime: entry.resetTime,
    };
  }
}

export const rateLimiter = new RateLimiter();

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  return ip.trim();
}
