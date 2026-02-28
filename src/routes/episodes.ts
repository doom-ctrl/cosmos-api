import { Hono } from 'hono';
import { z } from 'zod';
import { getEpisodes } from '../services/aniwatch';
import { withCache, cacheKeys, cacheTTL } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const episodesIdSchema = z.string()
  .min(1, 'Anime ID is required')
  .max(20, 'Invalid anime ID format');

const episodesRoute = new Hono();

episodesRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const result = episodesIdSchema.safeParse(id);
    
    if (!result.success) {
      return c.json({
        success: false,
        error: { 
          code: 'INVALID_PARAMS', 
          message: result.error.errors[0].message
        }
      }, 400);
    }

    const cacheKey = cacheKeys.episodes(id);
    const episodes = await withCache(cacheKey, () => getEpisodes(id), config.cache.episodes);

    return c.json({
      success: true,
      data: {
        animeId: episodes.animeId,
        animeTitle: episodes.animeName,
        episodes: episodes.episodes.map((ep: any) => ({
          episodeId: ep.episodeId,
          number: ep.number,
          title: ep.title,
          isFiller: ep.isFiller
        }))
      }
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default episodesRoute;
