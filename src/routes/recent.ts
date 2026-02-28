import { Hono } from 'hono';
import { z } from 'zod';
import { getRecentAnime } from '../services/aniwatch';
import { withCache, cacheKeys } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const recentSchema = z.object({
  page: z.coerce.number()
    .int('Page must be an integer')
    .positive('Page must be positive')
    .max(100, 'Page too high')
    .default(1),
});

const recentRoute = new Hono();

recentRoute.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');

    const result = recentSchema.safeParse({ page });
    
    if (!result.success) {
      return c.json({
        success: false,
        error: { 
          code: 'INVALID_PARAMS', 
          message: result.error.errors[0].message
        }
      }, 400);
    }

    const { page: validatedPage } = result.data;

    const cacheKey = cacheKeys.recent(validatedPage);
    const recentData = await withCache(cacheKey, () => getRecentAnime(validatedPage), config.cache.recent || 1800);

    return c.json({
      success: true,
      data: {
        results: recentData.animes,
        pagination: recentData.pagination
      }
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default recentRoute;
