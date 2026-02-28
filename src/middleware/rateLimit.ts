import { Context, Next } from 'hono';
import { config } from '../config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    private limit: number = config.rateLimit.limit,
    private window: number = config.rateLimit.window
  ) {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  private getClientIp(c: Context): string {
    const forwardedFor = c.req.header('X-Forwarded-For');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    return c.req.header('CF-Connecting-IP') || 
           c.req.header('X-Real-IP') || 
           'unknown';
  }

  async check(c: Context, next: Next) {
    const ip = this.getClientIp(c);
    const now = Date.now();
    const key = `rate:${ip}`;

    let entry = this.store.get(key);

    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + this.window,
      };
      this.store.set(key, entry);
    }

    entry.count++;

    const remaining = Math.max(0, this.limit - entry.count);
    const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

    c.header('X-RateLimit-Limit', String(this.limit));
    c.header('X-RateLimit-Remaining', String(remaining));
    c.header('X-RateLimit-Reset', String(resetSeconds));

    if (entry.count > this.limit) {
      return c.json({
        success: false,
        data: null,
        error: {
          code: 'RATE_LIMITED',
          message: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`
        }
      }, 429);
    }

    await next();
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

export const rateLimiter = new RateLimiter();
