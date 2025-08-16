# Rate Limiting Implementation

## Overview

The public API has been rate-limited to 100 requests per hour per client/user to prevent abuse and ensure fair usage.

## Implementation Details

### Rate Limiter (`lib/rate-limit.ts`)

- **Limit**: 100 requests per hour per client
- **Window**: 1 hour (3,600,000 milliseconds)
- **Storage**: In-memory Map with automatic cleanup of expired entries
- **Client Identification**: Uses IP address from various headers:
  - `x-forwarded-for` (primary)
  - `x-real-ip` (fallback)
  - `cf-connecting-ip` (Cloudflare fallback)
  - `unknown` (when no headers are available)

### Middleware (`lib/rate-limit-middleware.ts`)

The `withRateLimit` function wraps API route handlers to apply rate limiting:

```typescript
export const GET = withRateLimit(getOfficesHandler);
```

## Protected Routes

The following public API routes are rate-limited:

- `GET /api/offices` - List offices
- `GET /api/offices/[slug]` - Get office details
- `GET /api/offices/[slug]/suggestions` - Get office suggestions
- `POST /api/lead` - Submit lead form
- `GET /api/services` - List services
- `POST /api/services` - Create service

## Response Headers

All API responses include rate limiting headers:

- `X-RateLimit-Limit`: Maximum requests allowed (100)
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: ISO timestamp when the limit resets

## Error Response

When rate limit is exceeded (HTTP 429):

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 3600
}
```

Additional headers:

- `Retry-After`: Seconds until the limit resets

## Testing

Comprehensive tests are available in:

- `lib/__tests__/rate-limit.test.ts` - Core rate limiter functionality
- `lib/__tests__/rate-limit-middleware.test.ts` - Middleware wrapper tests

Run tests with:

```bash
yarn test lib/__tests__/rate-limit
```

## Notes

- Rate limiting is per IP address, so users behind NAT may share limits
- The in-memory storage means limits reset on server restart
- For production, consider using Redis or a persistent store for distributed deployments
