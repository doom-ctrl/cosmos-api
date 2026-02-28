import { Hono } from 'hono';
import { z } from 'zod';
import { getEpisodeServers } from '../services/aniwatch';
import { withCache, cacheKeys, cacheTTL } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const serversSchema = z.object({
  episodeId: z.string()
    .min(1, 'episodeId is required')
    .max(20, 'Invalid episodeId format'),
});

const serversRoute = new Hono();

serversRoute.get('/', async (c) => {
  try {
    const episodeId = c.req.query('episodeId');

    const result = serversSchema.safeParse({ episodeId });
    
    if (!result.success) {
      return c.json({
        success: false,
        error: { 
          code: 'INVALID_PARAMS', 
          message: result.error.errors[0].message
        }
      }, 400);
    }

    const cacheKey = cacheKeys.servers(episodeId);
    const servers = await withCache(cacheKey, () => getEpisodeServers(episodeId), config.cache.servers);

    return c.json({
      success: true,
      data: servers
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default serversRoute;
