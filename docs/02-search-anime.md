# Search Anime

The search endpoint allows users to find anime by title. This is typically the first step in the user journey - searching for an anime to watch.

## Endpoint

```
GET /api/v1/search
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (anime title) |
| `page` | number | No | Page number for pagination (default: 1) |

## Request Examples

### cURL

```bash
curl "http://localhost:3000/api/v1/search?q=naruto"
```

### JavaScript (fetch)

```javascript
async function searchAnime(query, page = 1) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString()
  });

  const response = await fetch(`/api/v1/search?${params}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

// Usage
const searchResults = await searchAnime('naruto');
console.log(searchResults.results);
```

### React Example

```jsx
import { useState, useEffect } from 'react';

function AnimeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data.results);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to search anime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="results">
        {results.map((anime) => (
          <div key={anime.id} className="anime-card">
            <img src={anime.image} alt={anime.title} />
            <h3>{anime.title}</h3>
            <p>Status: {anime.status}</p>
            <p>Episodes: {anime.episodes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Vue 3 Example

```vue
<template>
  <div>
    <form @submit.prevent="searchAnime">
      <input v-model="query" placeholder="Search anime..." />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Searching...' : 'Search' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div class="results">
      <div v-for="anime in results" :key="anime.id" class="anime-card">
        <img :src="anime.image" :alt="anime.title" />
        <h3>{{ anime.title }}</h3>
        <p>Status: {{ anime.status }}</p>
        <p>Episodes: {{ anime.episodes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const query = ref('');
const results = ref([]);
const loading = ref(false);
const error = ref(null);

const searchAnime = async () => {
  if (!query.value.trim()) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `/api/v1/search?q=${encodeURIComponent(query.value)}`
    );
    const data = await response.json();

    if (data.success) {
      results.value = data.data.results;
    } else {
      error.value = data.error.message;
    }
  } catch (err) {
    error.value = 'Failed to search anime';
  } finally {
    loading.value = false;
  }
};
</script>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "18220",
        "title": "Naruto",
        "image": "https://cdn.site.com/poster.jpg",
        "status": "Completed",
        "episodes": 220
      },
      {
        "id": "18701",
        "title": "Naruto: Shippuden",
        "image": "https://cdn.site.com/poster.jpg",
        "status": "Completed",
        "episodes": 500
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "perPage": 20
    }
  },
  "error": null
}
```

### Validation Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "q parameter is required"
  }
}
```

### Rate Limited Response

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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `results[].id` | string | Unique anime identifier (numeric string) |
| `results[].title` | string | English title of the anime |
| `results[].image` | string | URL to the poster image |
| `results[].status` | string | Status (Ongoing, Completed, Hiatus) |
| `results[].episodes` | number | Total number of episodes |
| `pagination.total` | number | Total number of results |
| `pagination.page` | number | Current page number |
| `pagination.perPage` | number | Results per page |

## Important Notes

1. **Anime ID Format**: The `id` returned is a numeric string (e.g., "18220"). You'll need this ID for subsequent API calls.

2. **Debouncing**: Consider implementing debounce on the search input to avoid excessive API calls while the user is typing.

3. **Caching**: Search results are cached for 1 hour. Subsequent identical searches will return cached results.

4. **Empty Results**: If no anime matches the query, an empty results array is returned:

   ```json
   {
     "success": true,
     "data": {
       "results": [],
       "pagination": { "total": 0, "page": 1, "perPage": 20 }
     }
   }
   ```

## Pagination Example

```javascript
async function searchWithPagination(query, page = 1, perPage = 20) {
  const response = await fetch(
    `/api/v1/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  const { data } = await response.json();

  return {
    anime: data.results,
    currentPage: data.pagination.page,
    totalPages: Math.ceil(data.pagination.total / perPage),
    hasNext: data.pagination.page * perPage < data.pagination.total
  };
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| No results found | Try different keywords or check spelling |
| Slow search response | Use debouncing to reduce requests |
| Stale results | Results are cached; wait 1 hour for fresh data |
