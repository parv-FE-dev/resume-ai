interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limits = new Map<string, RateLimitEntry>();
const DAILY_LIMIT = 3;
const WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limits) {
    if (now >= entry.resetAt) {
      limits.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = limits.get(ip);

  if (!entry || now >= entry.resetAt) {
    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt: now + WINDOW,
    };
  }

  const remaining = Math.max(0, DAILY_LIMIT - entry.count);
  return {
    allowed: remaining > 0,
    remaining,
    resetAt: entry.resetAt,
  };
}

export function incrementUsage(ip: string): void {
  const now = Date.now();
  const entry = limits.get(ip);

  if (!entry || now >= entry.resetAt) {
    limits.set(ip, { count: 1, resetAt: now + WINDOW });
  } else {
    entry.count++;
  }
}
