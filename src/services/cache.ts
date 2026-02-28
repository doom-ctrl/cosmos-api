// Simple in-memory cache for serverless
const cache = new Map<string, { data: string; expires: number }>();

export async function cacheGet(key: string): Promise<string | null> {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}

export async function cacheSet(
  key: string, 
  value: string, 
  ttlSeconds: number = 3600
): Promise<void> {
  cache.set(key, {
    data: value,
    expires: Date.now() + (ttlSeconds * 1000)
  });
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await cacheGet(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetcher();
  await cacheSet(key, JSON.stringify(data), ttl);
  
  return data;
}

// Cache key generators
export const cacheKeys = {
  search: (query: string, page: number) => `search:${query}:${page}`,
  anime: (id: string) => `anime:${id}`,
  episodes: (id: string) => `episodes:${id}`,
  servers: (episodeId: string) => `servers:${episodeId}`,
  stream: (episodeId: string, server: string, type: string) => 
    `stream:${episodeId}:${server}:${type}`
};
