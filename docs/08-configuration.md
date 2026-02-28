# Configuration

This guide explains how to configure your self-hosted Cosmos API deployment.

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

```bash
cp .env.example .env
```

## Rate Limiting

### RATE_LIMIT

```bash
RATE_LIMIT=60
```

- **Default**: 60
- **Description**: Maximum requests allowed per IP within the time window

### RATE_WINDOW

```bash
RATE_WINDOW=60000
```

- **Default**: 60000 (1 minute in milliseconds)
- **Description**: Time window for rate limiting

## Cache TTL (Time To Live)

How long to cache responses from the upstream scraper (in seconds).

### CACHE_TTL_SEARCH

```bash
CACHE_TTL_SEARCH=3600
```

- **Default**: 3600 (1 hour)
- **Description**: Search results cache duration

### CACHE_TTL_ANIME

```bash
CACHE_TTL_ANIME=86400
```

- **Default**: 86400 (24 hours)
- **Description**: Anime details cache duration

### CACHE_TTL_EPISODES

```bash
CACHE_TTL_EPISODES=86400
```

- **Default**: 86400 (24 hours)
- **Description**: Episode list cache duration

### CACHE_TTL_SERVERS

```bash
CACHE_TTL_SERVERS=3600
```

- **Default**: 3600 (1 hour)
- **Description**: Server list cache duration

### CACHE_TTL_STREAM

```bash
CACHE_TTL_STREAM=1800
```

- **Default**: 1800 (30 minutes)
- **Description**: Stream URL cache duration

## Timeouts

### REQUEST_TIMEOUT

```bash
REQUEST_TIMEOUT=10000
```

- **Default**: 10000 (10 seconds)
- **Description**: General API request timeout in milliseconds

### STREAM_TIMEOUT

```bash
STREAM_TIMEOUT=30000
```

- **Default**: 30000 (30 seconds)
- **Description**: Stream request timeout in milliseconds

## Retry Configuration

### RETRY_ATTEMPTS

```bash
RETRY_ATTEMPTS=3
```

- **Default**: 3
- **Description**: Number of retry attempts for failed upstream requests

### RETRY_DELAY

```bash
RETRY_DELAY=1000
```

- **Default**: 1000 (1 second)
- **Description**: Base delay between retries in milliseconds

The API uses exponential backoff - each retry waits twice as long as the previous one.

## CORS Configuration

### CORS_ORIGIN

```bash
CORS_ORIGIN=*
```

- **Default**: `*` (allow all origins)
- **Description**: Allowed origins for CORS

### Examples

```bash
# Allow all origins (default)
CORS_ORIGIN=*

# Allow specific domains
CORS_ORIGIN=https://example.com,https://app.example.com

# Allow localhost only (development)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Complete Example .env File

```bash
# =============================================================================
# Cosmos API Configuration
# =============================================================================

# Rate Limiting
RATE_LIMIT=60
RATE_WINDOW=60000

# Cache TTL (in seconds)
CACHE_TTL_SEARCH=3600
CACHE_TTL_ANIME=86400
CACHE_TTL_EPISODES=86400
CACHE_TTL_SERVERS=3600
CACHE_TTL_STREAM=1800

# Timeouts (in milliseconds)
REQUEST_TIMEOUT=10000
STREAM_TIMEOUT=30000

# Retry Configuration
RETRY_ATTEMPTS=3
RETRY_DELAY=1000

# CORS
CORS_ORIGIN=*
```

## Production Recommendations

### High Traffic

```bash
# More lenient rate limits
RATE_LIMIT=200
RATE_WINDOW=60000

# Longer cache for static content
CACHE_TTL_ANIME=172800  # 48 hours
CACHE_TTL_EPISODES=172800
```

### Low Memory Environment

```bash
# Shorter cache TTL to reduce memory usage
CACHE_TTL_SEARCH=600     # 10 minutes
CACHE_TTL_ANIME=3600     # 1 hour
CACHE_TTL_EPISODES=3600  # 1 hour
CACHE_TTL_SERVERS=300    # 5 minutes
CACHE_TTL_STREAM=600     # 10 minutes
```

### Development

```bash
# Disable rate limiting for testing
RATE_LIMIT=10000

# Short cache for faster development
CACHE_TTL_SEARCH=60
CACHE_TTL_ANIME=300
CACHE_TTL_EPISODES=300
CACHE_TTL_SERVERS=60
CACHE_TTL_STREAM=60

# Allow localhost
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Verifying Configuration

Check the health endpoint to verify your API is running:

```bash
curl http://localhost:3000/health
```

Response:

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

## Docker Environment Variables

If using Docker, set variables in your `docker-compose.yml`:

```yaml
services:
  cosmos-api:
    image: cosmos-api
    environment:
      - RATE_LIMIT=60
      - CACHE_TTL_SEARCH=3600
      - CORS_ORIGIN=*
    ports:
      - "3000:3000"
```

## Vercel Environment Variables

If deploying to Vercel, add variables in the Vercel Dashboard:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable from `.env.example`

Or use Vercel CLI:

```bash
vercel env add RATE_LIMIT
vercel env add CACHE_TTL_SEARCH
# ... etc
```
