# Home & Recent Endpoints

Get homepage data and recently added anime.

## Home - Get Homepage Data

Returns comprehensive homepage data including trending, popular, and latest anime.

### Endpoint

```
GET /api/v1/home
```

### Parameters

None required.

### Response

```json
{
  "success": true,
  "data": {
    "spotlightAnimes": [
      {
        "rank": 1,
        "id": "100",
        "name": "One Piece",
        "description": "...",
        "poster": "https://...",
        "jname": "One Piece",
        "episodes": { "sub": 1000, "dub": 1000 },
        "type": "TV",
        "otherInfo": ["PG-13", "Sub & Dub"]
      }
    ],
    "trendingAnimes": [
      {
        "rank": 1,
        "id": "100",
        "name": "One Piece",
        "jname": "One Piece",
        "poster": "https://..."
      }
    ],
    "latestEpisodeAnimes": [
      {
        "id": "20530",
        "title": "Terminator Zero",
        "image": "https://...",
        "episodeId": "12345",
        "episodeNumber": 8,
        "type": "ONA"
      }
    ],
    "topUpcomingAnimes": [
      {
        "id": "20401",
        "title": "Jujutsu Kaisen Season 3",
        "image": "https://...",
        "episodeId": "12345",
        "episodeNumber": 1,
        "type": "TV"
      }
    ],
    "topAiringAnimes": [
      {
        "id": "100",
        "name": "One Piece",
        "poster": "https://...",
        "episodes": { "sub": 1000, "dub": 1000 }
      }
    ],
    "mostPopularAnimes": [
      {
        "id": "100",
        "name": "One Piece",
        "poster": "https://...",
        "episodes": { "sub": 1000, "dub": 1000 }
      }
    ],
    "mostFavoriteAnimes": [...],
    "latestCompletedAnimes": [...],
    "genres": ["Action", "Adventure", "Comedy", ...],
    "top10Animes": {
      "today": [...],
      "week": [...],
      "month": [...]
    }
  }
}
```

### Example

```bash
curl http://localhost:3000/api/v1/home
```

---

## Recent - Get Recently Added Anime

Returns recently added anime from subbed and dubbed lists.

### Endpoint

```
GET /api/v1/recent
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-100) |

### Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "20530",
        "title": "Terminator Zero",
        "image": "https://...",
        "type": "ONA",
        "episodes": { "sub": "8", "dub": "8" },
        "isSubbed": true,
        "isDubbed": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "hasNextPage": true
    }
  }
}
```

### Example

```bash
# Get page 1 (default)
curl http://localhost:3000/api/v1/recent

# Get specific page
curl http://localhost:3000/api/v1/recent?page=2
```

---

## Use Cases

### Homepage Integration

```javascript
async function fetchHomePage() {
  const response = await fetch('http://localhost:3000/api/v1/home');
  const data = await response.json();
  
  if (data.success) {
    return {
      trending: data.data.trendingAnimes,
      popular: data.data.mostPopularAnimes,
      airing: data.data.topAiringAnimes,
      latest: data.data.latestEpisodeAnimes
    };
  }
  throw new Error(data.error.message);
}
```

### Recent Updates Integration

```javascript
async function fetchRecentAnime(page = 1) {
  const response = await fetch(`http://localhost:3000/api/v1/recent?page=${page}`);
  const data = await response.json();
  
  if (data.success) {
    return {
      anime: data.data.results,
      hasMore: data.data.pagination.hasNextPage
    };
  }
  throw new Error(data.error.message);
}
```
