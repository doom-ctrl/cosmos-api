# Getting Started with Cosmos API

Welcome to the Cosmos API documentation. This guide will help you integrate our anime streaming API into your frontend application.

## Base URL

```
Production:  https://your-api-domain.com (when deployed)
Development: http://localhost:3000 (local development)
```

## Authentication

No authentication is required. Each self-hosted instance is its own API - users host their own and use their deployment URL.

## Response Format

All API responses follow a consistent JSON structure:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "18220",
        "title": "Naruto",
        "image": "https://example.com/image.jpg",
        "status": "Completed",
        "episodes": 220
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "perPage": 20
    }
  },
  "error": null
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "FETCH_ERROR",
    "message": "Failed to fetch data from source"
  }
}
```

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success - Request completed successfully |
| 400 | Bad Request - Missing or invalid parameters |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Server Error - Something went wrong on the server |
| 502 | Bad Gateway - Upstream service unavailable |
| 503 | Service Unavailable - API is temporarily unavailable |

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_PARAMS` | Required parameters are missing or invalid (validation error) |
| `FETCH_ERROR` | Failed to fetch data from the anime source |
| `NOT_FOUND` | The requested resource was not found |
| `STREAM_ERROR` | Failed to get streaming URL |
| `RATE_LIMITED` | Too many requests - wait before retrying |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 60 requests per minute per IP address
- **Headers**: Rate limit information is included in response headers

### Rate Limit Headers

Every response includes these headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed (60) |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Seconds until the rate limit resets |

### Example Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 30
```

### Rate Limited Response

When rate limit is exceeded:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again in 30 seconds."
  }
}
```

### Handling Rate Limits

```javascript
async function fetchWithRetry(url, retries = 3) {
  const response = await fetch(url);
  
  if (response.status === 429) {
    const resetSeconds = response.headers.get('X-RateLimit-Reset');
    console.log(`Rate limited. Waiting ${resetSeconds} seconds...`);
    
    await new Promise(resolve => setTimeout(resolve, resetSeconds * 1000));
    return fetchWithRetry(url, retries - 1);
  }
  
  return response;
}
```

## Caching

The API includes in-memory caching to reduce redundant requests to the upstream source:

| Endpoint | Cache TTL |
|----------|-----------|
| Search | 1 hour |
| Anime Details | 24 hours |
| Episodes | 24 hours |
| Servers | 1 hour |
| Stream | 30 minutes |
| Home | 1 hour |
| Recent | 30 minutes |

## Configuration

For self-hosted deployments, you can customize settings via environment variables. See [Configuration](./08-configuration.md) for full details.

### Quick Config

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT` | 60 | Requests per minute |
| `CACHE_TTL_SEARCH` | 3600 | Search cache (seconds) |
| `CORS_ORIGIN` | * | Allowed origins |

## Quick Test

You can verify the API is working with a simple health check:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

## Next Steps

Now that you understand the response format, proceed to:

- [Home & Recent](./02a-home-recent.md) - Get homepage and recently added anime
- [Search Anime](./02-search-anime.md) - Learn how to search for anime
- [Anime Details](./03-anime-details.md) - Get detailed anime information
- [Episodes List](./04-episodes-list.md) - Fetch episode lists
- [Streaming](./05-streaming.md) - Get video stream URLs
- [M3U8 Proxy](./06-m3u8-proxy.md) - Handle CORS in browsers
- [Complete Example](./07-complete-example.md) - Full integration workflow
- [Configuration](./08-configuration.md) - Customize your deployment
