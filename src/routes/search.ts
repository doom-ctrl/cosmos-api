import { Hono } from 'hono';
import { z } from 'zod';
import { searchAnime } from '../services/aniwatch';
import { withCache, cacheKeys, cacheTTL } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const searchSchema = z.object({
  q: z.string()
    .min(1, 'Query is required')
    .max(100, 'Query too long'),
  page: z.coerce.number()
    .int('Page must be an integer')
    .positive('Page must be positive')
    .max(100, 'Page too high')
    .default(1),
});

const searchRoute = new Hono();

searchRoute.get('/', async (c) => {
  try {
    const query = c.req.query('q');
    const page = parseInt(c.req.query('page') || '1');

    const result = searchSchema.safeParse({ q: query, page });
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      return c.json({
        success: false,
        error: { 
          code: 'INVALID_PARAMS', 
          message: firstError.message 
        }
      }, 400);
    }

    const { q, page: validatedPage } = result.data;

    const cacheKey = cacheKeys.search(q, validatedPage);
    
    const results = await withCache(
      cacheKey,
      () => searchAnime(q, validatedPage),
      config.cache.search
    );

    return c.json({
      success: true,
      data: {
        results: results.animes.map((anime: any) => ({
          id: anime.id,
          title: anime.name,
          image: anime.poster,
          status: anime.status,
          episodes: anime.episodes
        })),
        pagination: results.pagination
      }
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default searchRoute;
