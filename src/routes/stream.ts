import { Hono } from 'hono';
import { z } from 'zod';
import { getStream } from '../services/streaming';
import { withCache, cacheKeys } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const streamSchema = z.object({
  episodeId: z.string()
    .min(1, 'episodeId is required')
    .max(20, 'Invalid episodeId format'),
  server: z.enum(['hd-1', 'hd-2', 'hd-3', 'hd-4', 'hd-5'])
    .default('hd-1'),
  type: z.enum(['sub', 'dub'])
    .default('sub'),
});

const streamRoute = new Hono();

streamRoute.get('/', async (c) => {
  try {
    const episodeId = c.req.query('episodeId');
    const server = c.req.query('server') || 'hd-1';
    const type = c.req.query('type') || 'sub';

    const result = streamSchema.safeParse({ episodeId, server, type });
    
    if (!result.success) {
      return c.json({
        success: false,
        error: { 
          code: 'INVALID_PARAMS', 
          message: result.error.errors[0].message
        }
      }, 400);
    }

    const { episodeId: validEpisodeId, server: validServer, type: validType } = result.data;

    const cacheKey = cacheKeys.stream(validEpisodeId, validServer, validType);
    const streamResult = await withCache(
      cacheKey, 
      () => getStream(validEpisodeId, validServer, validType), 
      config.cache.stream
    );

    if (streamResult.success) {
      return c.json({
        success: true,
        data: streamResult.data
      });
    }

    return c.json({
      success: false,
      error: streamResult.error
    }, 404);
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default streamRoute;
