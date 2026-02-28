import { Hono } from 'hono';
import { getHomePage } from '../services/aniwatch';
import { withCache, cacheKeys } from '../services/cache';
import { handleError } from '../utils/errors';
import { config } from '../config';

const homeRoute = new Hono();

homeRoute.get('/', async (c) => {
  try {
    const cacheKey = cacheKeys.home();
    const homeData = await withCache(cacheKey, () => getHomePage(), config.cache.home || 3600);

    return c.json({
      success: true,
      data: {
        spotlightAnimes: homeData.spotlightAnimes,
        trendingAnimes: homeData.trendingAnimes,
        latestEpisodeAnimes: homeData.latestEpisodeAnimes,
        topUpcomingAnimes: homeData.topUpcomingAnimes,
        topAiringAnimes: homeData.topAiringAnimes,
        mostPopularAnimes: homeData.mostPopularAnimes,
        mostFavoriteAnimes: homeData.mostFavoriteAnimes,
        latestCompletedAnimes: homeData.latestCompletedAnimes,
        genres: homeData.genres,
        top10Animes: homeData.top10Animes
      }
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default homeRoute;
