import { z } from 'zod';

const configSchema = z.object({
  rateLimit: z.object({
    limit: z.coerce.number().default(60),
    window: z.coerce.number().default(60000),
  }),
  cache: z.object({
    search: z.coerce.number().default(3600),
    anime: z.coerce.number().default(86400),
    episodes: z.coerce.number().default(86400),
    servers: z.coerce.number().default(3600),
    stream: z.coerce.number().default(1800),
  }),
  timeout: z.object({
    request: z.coerce.number().default(10000),
    stream: z.coerce.number().default(30000),
  }),
  retry: z.object({
    attempts: z.coerce.number().default(3),
    delay: z.coerce.number().default(1000),
  }),
  cors: z.object({
    origin: z.string().default('*'),
  }),
});

type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  return {
    rateLimit: {
      limit: parseInt(process.env.RATE_LIMIT || '60'),
      window: parseInt(process.env.RATE_WINDOW || '60000'),
    },
    cache: {
      search: parseInt(process.env.CACHE_TTL_SEARCH || '3600'),
      anime: parseInt(process.env.CACHE_TTL_ANIME || '86400'),
      episodes: parseInt(process.env.CACHE_TTL_EPISODES || '86400'),
      servers: parseInt(process.env.CACHE_TTL_SERVERS || '3600'),
      stream: parseInt(process.env.CACHE_TTL_STREAM || '1800'),
    },
    timeout: {
      request: parseInt(process.env.REQUEST_TIMEOUT || '10000'),
      stream: parseInt(process.env.STREAM_TIMEOUT || '30000'),
    },
    retry: {
      attempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
      delay: parseInt(process.env.RETRY_DELAY || '1000'),
    },
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
    },
  };
}

export const config = loadConfig();
export type { Config };
