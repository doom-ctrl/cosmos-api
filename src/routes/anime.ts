import { Hono } from 'hono';
import { z } from 'zod';
import { getAnimeInfo } from '../services/aniwatch';
import { withCache, cacheKeys, cacheTTL } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const animeIdSchema = z.string()
  .min(1, 'Anime ID is required')
  .max(20, 'Invalid anime ID format');

const animeRoute = new Hono();

animeRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const result = animeIdSchema.safeParse(id);
    
    if (!result.success) {
      return c.json({
        success: false,
        error: { 
          code: 'INVALID_PARAMS', 
          message: result.error.errors[0].message
        }
      }, 400);
    }

    const cacheKey = cacheKeys.anime(id);
    const info = await withCache(cacheKey, () => getAnimeInfo(id), config.cache.anime);

    return c.json({
      success: true,
      data: {
        id: info.anime.id,
        title: info.anime.name,
        japaneseTitle: info.anime.japaneseName,
        image: info.anime.image,
        description: info.anime.description,
        genres: info.anime.genres,
        status: info.anime.status,
        releaseDate: info.anime.releaseDate,
        totalEpisodes: info.anime.totalEpisodes,
        episodes: info.episodes.map((ep: any) => ({
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

export default animeRoute;
