interface CacheEntry {
  data: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_SIZE = 100;

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCache(key: string, data: string): void {
  // Evict oldest entry if at capacity
  if (cache.size >= MAX_SIZE && !cache.has(key)) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }

  cache.set(key, { data, timestamp: Date.now() });
}

export function getCacheKey(resumeText: string, jobDescription: string): string {
  return simpleHash(resumeText + "|||" + jobDescription);
}
