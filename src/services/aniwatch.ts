import Hianime from 'hianime';
import { logger } from '../utils/logger';
import { config } from '../config';

const scraper = new Hianime();

async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxAttempts: number = config.retry.attempts
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${attempt}/${maxAttempts} failed for ${operationName}: ${lastError.message}`);
      
      if (attempt < maxAttempts) {
        const delay = config.retry.delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`${operationName} failed after ${maxAttempts} attempts`);
}

export async function searchAnime(query: string, page: number = 1) {
  return withRetry(
    async () => {
      const result = await scraper.search(query, page);
      return {
        animes: result.results.map((anime: any) => ({
          id: anime.dataId,
          name: anime.title,
          poster: anime.image,
          status: null,
          episodes: anime.language
        })),
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPage,
          hasNextPage: result.hasNextPage
        }
      };
    },
    `searchAnime(${query}, ${page})`
  );
}

export async function getAnimeInfo(animeId: string) {
  return withRetry(
    async () => {
      const episodes = await scraper.getEpisodes(animeId);

      return {
        anime: {
          id: animeId,
          name: animeId,
          japaneseName: null,
          image: null,
          description: null,
          genres: [],
          status: null,
          releaseDate: null,
          totalEpisodes: episodes.length
        },
        episodes: episodes.map((ep: any) => ({
          episodeId: ep.id,
          number: parseInt(ep.number),
          title: ep.title,
          isFiller: false
        }))
      };
    },
    `getAnimeInfo(${animeId})`
  );
}

export async function getEpisodes(animeId: string) {
  return withRetry(
    async () => {
      const episodes = await scraper.getEpisodes(animeId);

      return {
        animeId: animeId,
        animeName: animeId,
        episodes: episodes.map((ep: any) => ({
          episodeId: ep.id,
          number: parseInt(ep.number),
          title: ep.title,
          isFiller: false
        }))
      };
    },
    `getEpisodes(${animeId})`
  );
}

export async function getEpisodeSources(
  episodeId: string,
  server: string = 'hd-1',
  type: 'sub' | 'dub' | 'raw' = 'sub'
) {
  return withRetry(
    async () => {
      const servers = await scraper.getEpisodeServers(episodeId);
      const serverList = type === 'sub' ? servers.sub : servers.dub;

      if (!serverList || serverList.length === 0) {
        throw new Error('No servers available');
      }

      const selectedServer = serverList.find((s: any) => s.serverId === server) || serverList[0];
      const sources = await scraper.getEpisodeSources(selectedServer.serverId);

      return {
        sources: (sources.sources || []).map((source: any) => ({
          url: source.file,
          quality: source.type
        })),
        headers: sources.headers,
        tracks: sources.tracks,
        intro: sources.intro,
        outro: sources.outro
      };
    },
    `getEpisodeSources(${episodeId}, ${server}, ${type})`
  );
}

export async function getEpisodeServers(episodeId: string) {
  return withRetry(
    async () => await scraper.getEpisodeServers(episodeId),
    `getEpisodeServers(${episodeId})`
  );
}

export async function getHomePage() {
  return withRetry(
    async () => {
      const [topAiring, mostPopular, subbed, dubbed] = await Promise.all([
        scraper.getTopAiring(1),
        scraper.getMostPopular(1),
        scraper.getSubbedAnime(1),
        scraper.getDubbedAnime(1)
      ]);

      return {
        spotlightAnimes: [],
        trendingAnimes: topAiring.results.map((anime: any) => ({
          id: anime.dataId,
          name: anime.title,
          poster: anime.image,
          rank: null
        })),
        latestEpisodeAnimes: subbed.results.map((anime: any) => ({
          id: anime.dataId,
          name: anime.title,
          poster: anime.image
        })),
        topUpcomingAnimes: [],
        topAiringAnimes: topAiring.results.map((anime: any) => ({
          id: anime.dataId,
          name: anime.title,
          poster: anime.image,
          episodes: anime.language
        })),
        mostPopularAnimes: mostPopular.results.map((anime: any) => ({
          id: anime.dataId,
          name: anime.title,
          poster: anime.image,
          episodes: anime.language
        })),
        mostFavoriteAnimes: [],
        latestCompletedAnimes: [],
        genres: [],
        top10Animes: { today: [], week: [], month: [] }
      };
    },
    'getHomePage()'
  );
}

export async function getGenreAnime(genreName: string, page: number = 1) {
  return {
    animes: [],
    genres: [],
    totalPages: 1,
    currentPage: page,
    hasNextPage: false,
    topAiringAnimes: []
  };
}
