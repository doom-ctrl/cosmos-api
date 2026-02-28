# Cosmos API Documentation

Welcome to the Cosmos API documentation. This API provides anime streaming functionality that you can integrate into your frontend applications.

## Quick Links

| Document | Description |
|----------|-------------|
| [Getting Started](./01-getting-started.md) | API basics, response format, rate limiting |
| [Search Anime](./02-search-anime.md) | How to search for anime |
| [Anime Details](./03-anime-details.md) | Get detailed anime information |
| [Episodes List](./04-episodes-list.md) | Fetch episode lists |
| [Streaming](./05-streaming.md) | Get video stream URLs |
| [M3U8 Proxy](./06-m3u8-proxy.md) | Handle CORS in browsers |
| [Complete Example](./07-complete-example.md) | Full integration workflow |
| [Configuration](./08-configuration.md) | Customize your deployment |

## Features

- **Search**: Find anime by title
- **Details**: Get anime info, descriptions, genres
- **Episodes**: List all episodes for an anime
- **Streaming**: Get HLS video stream URLs with server fallback
- **Proxy**: M3U8 proxy to bypass CORS restrictions
- **Rate Limiting**: 60 requests/minute per IP
- **Caching**: Built-in caching for better performance

## Self-Hosted

This API is designed to be self-hosted. Each user hosts their own instance:

```
# Run locally
bun run src/index.ts

# Deploy to Vercel
vercel deploy
```

## Quick Example

```javascript
// Search for anime
const search = await fetch('/api/v1/search?q=naruto');
const { data } = await search.json();

// Get anime details
const anime = await fetch(`/api/v1/anime/${data.results[0].id}`);
const details = await anime.json();

// Get stream URL
const stream = await fetch(`/api/v1/stream?episodeId=${episodeId}&server=hd-1`);
const { data: { sources } } = await stream.json();

// Play video
video.src = `/api/v1/proxy?url=${encodeURIComponent(sources[0].url)}`;
```

## Support

- Check [Getting Started](./01-getting-started.md) for API basics
- See [Configuration](./08-configuration.md) for customization options
- Review [Complete Example](./07-complete-example.md) for full integration

## License

MIT License
