import { HiAnime } from 'aniwatch';
import { logger } from '../utils/logger';
import { config } from '../config';

const scraper = new HiAnime.Scraper();

// Cache for resolved anime IDs
const idCache = new Map<string, string>();

/**
 * Resolves a numeric ID to a proper slug format ID.
 * The aniwatch scraper.getInfo() requires slug format like "one-piece-100"
 * instead of just "100".
 */
export async function resolveAnimeId(identifier: string): Promise<string> {
  // Check cache first
  const cached = idCache.get(identifier);
  if (cached) {
    return cached;
  }

  // If ID already contains "-", assume it's a slug format and return as-is
  if (identifier.includes('-')) {
    idCache.set(identifier, identifier);
    return identifier;
  }

  // If ID is numeric, try to find the anime to get the proper slug
  // Try search first
  try {
    const searchResult = await scraper.search(identifier, 1);
    const match = searchResult.animes.find((anime: any) =>
      anime.id === identifier || anime.id.endsWith(`-${identifier}`)
    );

    if (match) {
      idCache.set(identifier, match.id);
      logger.info(`Resolved numeric ID ${identifier} to slug ${match.id}`);
      return match.id;
    }
  } catch (error) {
    logger.warn(`Search failed for ID ${identifier}: ${(error as Error).message}`);
  }

  // Try searchSuggestions as fallback
  try {
    const suggestions = await scraper.searchSuggestions(identifier);
    const match = suggestions.suggestions.find((anime: any) =>
      anime.id === identifier || (anime.id && anime.id.endsWith(`-${identifier}`))
    );

    if (match) {
      idCache.set(identifier, match.id);
      logger.info(`Resolved numeric ID ${identifier} to slug ${match.id} via suggestions`);
      return match.id;
    }
  } catch (error) {
    logger.warn(`SearchSuggestions failed for ID ${identifier}: ${(error as Error).message}`);
  }

  // Return original ID if resolution fails - let the caller handle the error
  return identifier;
}

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
        animes: result.animes.map((anime: any) => ({
          id: anime.id,
          name: anime.name,
          jname: anime.jname,
          poster: anime.poster,
          type: anime.type || null,
          status: null,
          episodes: anime.episodes,
          rate: anime.rating
        })),
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
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
      // Resolve ID to proper slug format
      const resolvedId = await resolveAnimeId(animeId);

      const [info, episodesResult] = await Promise.all([
        scraper.getInfo(resolvedId),
        scraper.getEpisodes(resolvedId)
      ]);

      const animeInfo = info.anime.info;
      const moreInfo = info.anime.moreInfo;

      return {
        anime: {
          id: resolvedId,
          name: animeInfo.name,
          japaneseName: animeInfo.jname,
          synonyms: animeInfo.synonyms ? animeInfo.synonyms.split(',').map((s: string) => s.trim()) : [],
          image: animeInfo.poster,
          posterUrl: animeInfo.poster,
          description: animeInfo.description,
          type: animeInfo.type,
          rating: animeInfo.rating,
          duration: animeInfo.duration,
          genres: animeInfo.genres || [],
          studios: moreInfo?.Studio || [],
          producers: moreInfo?.Producer || [],
          status: animeInfo.status,
          releaseDate: moreInfo?.Released || null,
          totalEpisodes: episodesResult.totalEpisodes,
          aired: animeInfo.aired,
          premiered: moreInfo?.Premiered || null,
          is18Plus: false,
          episodes: episodesResult.episodes.map((ep: any) => ({
            episodeId: ep.episodeId,
            number: ep.number,
            title: ep.title,
            isFiller: ep.isFiller
          })),
          characters: (animeInfo.charactersVoiceActors || []).map((c: any) => ({
            id: c.character?.id,
            name: c.character?.name,
            image: c.character?.poster,
            role: c.character?.cast,
            voiceActor: {
              name: c.voiceActor?.name,
              image: c.voiceActor?.poster
            }
          })),
          moreSeasons: info.seasons || [],
          related: info.relatedAnimes || [],
          mostPopular: info.mostPopularAnimes || [],
          recommended: info.recommendedAnimes || []
        },
        episodes: episodesResult.episodes.map((ep: any) => ({
          episodeId: ep.episodeId,
          number: ep.number,
          title: ep.title,
          isFiller: ep.isFiller
        }))
      };
    },
    `getAnimeInfo(${animeId})`
  );
}

export async function getEpisodes(animeId: string) {
  return withRetry(
    async () => {
      // Resolve ID to proper slug format
      const resolvedId = await resolveAnimeId(animeId);

      const result = await scraper.getEpisodes(resolvedId);

      return {
        animeId: resolvedId,
        animeName: resolvedId,
        episodes: result.episodes.map((ep: any) => ({
          episodeId: ep.episodeId,
          number: ep.number,
          title: ep.title,
          isFiller: ep.isFiller
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
      const serverList = type === 'sub' ? servers.sub : type === 'dub' ? servers.dub : servers.raw;

      if (!serverList || serverList.length === 0) {
        throw new Error('No servers available');
      }

      const selectedServer = serverList.find((s: any) => s.serverId.toString() === server) || serverList[0];
      const sources = await scraper.getEpisodeSources(episodeId, selectedServer.serverId as any, type);

      return {
        sources: (sources.sources || []).map((source: any) => ({
          url: source.file,
          quality: source.type
        })),
        headers: sources.headers,
        tracks: sources.subtitles,
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
      const homePage = await scraper.getHomePage();

      const mapAnime = (anime: any, rank?: number) => ({
        id: anime.id,
        title: anime.name,
        alternativeTitle: anime.jname,
        poster: anime.poster,
        rank: rank || 0,
        type: anime.type || null,
        quality: anime.stats?.quality || null,
        duration: anime.duration,
        aired: null,
        synopsis: anime.description,
        episodes: anime.episodes,
        rating: anime.rating
      });

      const mapTop10 = (anime: any, i: number) => ({
        id: anime.id,
        title: anime.name,
        poster: anime.poster,
        rank: i + 1
      });

      return {
        spotlightAnimes: homePage.spotlightAnimes.slice(0, 10).map((a: any, i: number) => mapAnime(a, i + 1)),
        trendingAnimes: homePage.trendingAnimes.slice(0, 10).map((a: any, i: number) => mapAnime(a, i + 1)),
        latestEpisodeAnimes: homePage.latestEpisodeAnimes.slice(0, 10).map((a: any) => mapAnime(a)),
        topUpcomingAnimes: homePage.topUpcomingAnimes.slice(0, 10).map((a: any) => mapAnime(a)),
        topAiringAnimes: homePage.topAiringAnimes.slice(0, 10).map((a: any) => mapAnime(a)),
        mostPopularAnimes: homePage.mostPopularAnimes.slice(0, 10).map((a: any) => mapAnime(a)),
        mostFavoriteAnimes: homePage.mostFavoriteAnimes.slice(0, 10).map((a: any) => mapAnime(a)),
        latestCompletedAnimes: homePage.latestCompletedAnimes.slice(0, 10).map((a: any) => mapAnime(a)),
        genres: homePage.genres.map((g: any) => ({
          id: g,
          name: g.charAt(0).toUpperCase() + g.slice(1),
          slug: g
        })),
        top10Animes: {
          today: homePage.top10Animes.today.slice(0, 10).map(mapTop10),
          week: homePage.top10Animes.week.slice(0, 10).map(mapTop10),
          month: homePage.top10Animes.month.slice(0, 10).map(mapTop10)
        }
      };
    },
    'getHomePage()'
  );
}

export async function getGenreAnime(genreName: string, page: number = 1) {
  return withRetry(
    async () => {
      const result = await scraper.getGenreAnime(genreName, page);
      return {
        animes: result.animes.map((anime: any) => ({
          id: anime.id,
          name: anime.name,
          jname: anime.jname,
          poster: anime.poster,
          type: anime.type || null,
          status: null,
          episodes: anime.episodes,
          rate: anime.rating
        })),
        genres: result.genres,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        hasNextPage: result.hasNextPage,
        topAiringAnimes: []
      };
    },
    `getGenreAnime(${genreName}, ${page})`
  );
}

export async function getEstimatedSchedule() {
  return withRetry(
    async () => {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const tzOffset = today.getTimezoneOffset();

      const schedule = await scraper.getEstimatedSchedule(dateStr, tzOffset);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const scheduleMap: Record<string, any[]> = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      };

      schedule.scheduledAnimes.forEach((anime: any) => {
        const animeDate = new Date(anime.airingTimestamp * 1000);
        const day = days[animeDate.getDay()];
        scheduleMap[day].push({
          id: anime.id,
          title: anime.name,
          alternativeTitle: anime.jname,
          poster: null,
          episodeNumber: anime.episode,
          type: null
        });
      });

      return days.map(day => ({
        day,
        animes: scheduleMap[day]
      }));
    },
    'getEstimatedSchedule()'
  );
}

export async function getGenres() {
  return [
    { id: 'action', name: 'Action', slug: 'action' },
    { id: 'adventure', name: 'Adventure', slug: 'adventure' },
    { id: 'comedy', name: 'Comedy', slug: 'comedy' },
    { id: 'drama', name: 'Drama', slug: 'drama' },
    { id: 'fantasy', name: 'Fantasy', slug: 'fantasy' },
    { id: 'horror', name: 'Horror', slug: 'horror' },
    { id: 'romance', name: 'Romance', slug: 'romance' },
    { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' },
    { id: 'slice-of-life', name: 'Slice of Life', slug: 'slice-of-life' },
    { id: 'sports', name: 'Sports', slug: 'sports' },
    { id: 'supernatural', name: 'Supernatural', slug: 'supernatural' },
    { id: 'thriller', name: 'Thriller', slug: 'thriller' }
  ];
}

export async function getCharacters(animeId: string, page: number = 1) {
  return withRetry(
    async () => {
      // Resolve ID to proper slug format
      const resolvedId = await resolveAnimeId(animeId);

      const info = await scraper.getInfo(resolvedId);
      const characters = (info.anime.info.charactersVoiceActors || []).map((c: any) => ({
        id: c.character?.id,
        name: c.character?.name,
        image: c.character?.poster,
        role: c.character?.cast,
        voiceActor: {
          id: c.voiceActor?.id,
          name: c.voiceActor?.name,
          image: c.voiceActor?.poster
        }
      }));

      return {
        characters,
        pagination: {
          currentPage: page,
          totalPages: 1,
          hasNextPage: false
        }
      };
    },
    `getCharacters(${animeId}, ${page})`
  );
}

export async function getRandomAnime() {
  return withRetry(
    async () => {
      const pages = 10;
      const randomPage = Math.floor(Math.random() * pages) + 1;
      const result = await scraper.getCategoryAnime('most-popular', randomPage);

      if (!result.animes || result.animes.length === 0) {
        throw new Error('No anime found');
      }

      const randomIndex = Math.floor(Math.random() * result.animes.length);
      const anime = result.animes[randomIndex];

      return {
        id: anime.id,
        title: anime.name,
        alternativeTitle: anime.jname,
        poster: anime.poster,
        type: anime.type || null,
        status: null,
        episodes: anime.episodes,
        rating: anime.rating
      };
    },
    'getRandomAnime()'
  );
}

export async function getSearchSuggestion(query: string) {
  return withRetry(
    async () => {
      const result = await scraper.searchSuggestions(query);
      return result.suggestions.slice(0, 10).map((anime: any) => ({
        id: anime.id,
        title: anime.name,
        poster: anime.poster,
        type: anime.type || null
      }));
    },
    `getSearchSuggestion(${query})`
  );
}

export async function getNews(page: number = 1) {
  return {
    news: [],
    pagination: {
      currentPage: page,
      totalPages: 1,
      hasNextPage: false
    }
  };
}

export async function getCategoryAnime(category: string, page: number = 1) {
  return withRetry(
    async () => {
      const categoryMap: Record<string, string> = {
        'trending': 'top-airing',
        'top-airing': 'top-airing',
        'top-upcoming': 'top-upcoming',
        'most-popular': 'most-popular',
        'recently-added': 'recently-added',
        'latest-completed': 'completed',
        'subbed-anime': 'subbed-anime',
        'dubbed-anime': 'dubbed-anime',
        'movie': 'movie',
        'tv': 'tv',
        'special': 'special',
        'ona': 'ona',
        'ova': 'ova'
      };

      const mappedCategory = categoryMap[category.toLowerCase()] || 'most-popular';
      const result = await scraper.getCategoryAnime(mappedCategory as any, page);

      return {
        animes: result.animes.map((anime: any) => ({
          id: anime.id,
          title: anime.name,
          alternativeTitle: anime.jname,
          poster: anime.poster,
          type: anime.type || null,
          episodes: anime.episodes,
          rating: anime.rating,
          status: null
        })),
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage
        }
      };
    },
    `getCategoryAnime(${category}, ${page})`
  );
}

export async function getNextEpisodeSchedule(animeId: string) {
  return withRetry(
    async () => {
      // Resolve ID to proper slug format
      const resolvedId = await resolveAnimeId(animeId);

      const [episodes, nextEpSchedule] = await Promise.all([
        scraper.getEpisodes(resolvedId),
        scraper.getNextEpisodeSchedule(resolvedId)
      ]);

      return {
        nextEpisode: nextEpSchedule.airingTimestamp ? `Episode ${episodes.totalEpisodes + 1}` : null,
        episodeNumber: episodes.totalEpisodes + 1,
        releaseTime: nextEpSchedule.airingISOTimestamp,
        releaseDate: nextEpSchedule.airingTimestamp ? new Date(nextEpSchedule.airingTimestamp * 1000).toISOString() : null,
        animeId: resolvedId,
        animeTitle: resolvedId
      };
    },
    `getNextEpisodeSchedule(${animeId})`
  );
}
