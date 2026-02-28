# Anime Details

The anime details endpoint provides comprehensive information about a specific anime, including description, genres, release date, and episode list.

## Endpoint

```
GET /api/v1/anime/:id
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Anime ID from search results |

## Request Examples

### cURL

```bash
curl "http://localhost:3000/api/v1/anime/18220"
```

### JavaScript (fetch)

```javascript
async function getAnimeDetails(animeId) {
  const response = await fetch(`/api/v1/anime/${animeId}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

// Usage
const anime = await getAnimeDetails('18220');
console.log(anime.title);        // "Naruto"
console.log(anime.description);  // Full description text
console.log(anime.genres);       // ["Action", "Adventure", "Martial Arts"]
```

### React Example

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/v1/anime/${id}`);
        const data = await response.json();

        if (data.success) {
          setAnime(data.data);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="anime-details">
      <div className="anime-header">
        <img src={anime.image} alt={anime.title} className="anime-poster" />
        <div className="anime-info">
          <h1>{anime.title}</h1>
          <p className="japanese-title">{anime.japaneseTitle}</p>
          
          <div className="meta">
            <span>Status: {anime.status}</span>
            <span>Episodes: {anime.totalEpisodes}</span>
            <span>Released: {anime.releaseDate}</span>
          </div>

          <div className="genres">
            {anime.genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>

          <p className="description">{anime.description}</p>
        </div>
      </div>

      <h2>Episodes</h2>
      <div className="episode-list">
        {anime.episodes.map(ep => (
          <button 
            key={ep.episodeId}
            onClick={() => handleEpisodeClick(ep)}
            className="episode-button"
          >
            Episode {ep.number}
            {ep.isFiller && <span className="filler-tag">Filler</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Vue 3 Example

```vue
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else class="anime-details">
    <div class="anime-header">
      <img :src="anime.image" :alt="anime.title" class="anime-poster" />
      <div class="anime-info">
        <h1>{{ anime.title }}</h1>
        <p class="japanese-title">{{ anime.japaneseTitle }}</p>
        
        <div class="meta">
          <span>Status: {{ anime.status }}</span>
          <span>Episodes: {{ anime.totalEpisodes }}</span>
          <span>Released: {{ anime.releaseDate }}</span>
        </div>

        <div class="genres">
          <span v-for="genre in anime.genres" :key="genre" class="genre-tag">
            {{ genre }}
          </span>
        </div>

        <p class="description">{{ anime.description }}</p>
      </div>
    </div>

    <h2>Episodes</h2>
    <div class="episode-list">
      <button
        v-for="ep in anime.episodes"
        :key="ep.episodeId"
        @click="handleEpisodeClick(ep)"
        class="episode-button"
      >
        Episode {{ ep.number }}
        <span v-if="ep.isFiller" class="filler-tag">Filler</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const anime = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchAnimeDetails = async () => {
  try {
    const response = await fetch(`/api/v1/anime/${route.params.id}`);
    const data = await response.json();

    if (data.success) {
      anime.value = data.data;
    } else {
      error.value = data.error.message;
    }
  } catch (err) {
    error.value = 'Failed to load anime details';
  } finally {
    loading.value = false;
  }
};

const handleEpisodeClick = (episode) => {
  // Navigate to episode player
  console.log('Selected episode:', episode.episodeId);
};

onMounted(fetchAnimeDetails);
</script>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "18220",
    "title": "Naruto",
    "japaneseTitle": "ナルト",
    "image": "https://cdn.site.com/image.jpg",
    "description": "Naruto Uzumaki, a young ninja with a demon fox sealed inside him...",
    "genres": ["Action", "Adventure", "Martial Arts"],
    "status": "Completed",
    "releaseDate": "2002-10-03",
    "totalEpisodes": 220,
    "episodes": [
      {
        "episodeId": "128841",
        "number": 1,
        "title": "Enter: Naruto Uzumaki!",
        "isFiller": false
      },
      {
        "episodeId": "128842",
        "number": 2,
        "title": "My Opponent Is A Konohamaru!",
        "isFiller": false
      }
    ]
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
    "message": "Failed to fetch anime details"
  }
}
```

### Validation Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Anime ID is required"
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
| `id` | string | Unique anime identifier |
| `title` | string | English title |
| `japaneseTitle` | string | Original Japanese title |
| `image` | string | URL to poster image |
| `description` | string | Full anime synopsis (HTML may be present) |
| `genres` | string[] | Array of genre names |
| `status` | string | Ongoing, Completed, or Hiatus |
| `releaseDate` | string | First air date (YYYY-MM-DD) |
| `totalEpisodes` | number | Total episode count |
| `episodes[]` | object | Array of episode objects |
| `episodes[].episodeId` | string | Unique episode identifier (use for streaming) |
| `episodes[].number` | number | Episode number |
| `episodes[].title` | string | Episode title |
| `episodes[].isFiller` | boolean | Whether episode is filler |

## Important Notes

1. **Episode ID**: The `episodeId` field is crucial - you'll need it to fetch streaming URLs. Store this value!

2. **Caching**: Anime details are cached for 24 hours. Changes to the anime on the source site won't be reflected immediately.

3. **Description**: The description may contain HTML tags. Sanitize it before rendering if security is a concern:

   ```javascript
   const cleanDescription = anime.description.replace(/<[^>]*>/g, '');
   ```

4. **Filler Episodes**: The `isFiller` flag indicates filler episodes. You might want to mark these visually or allow users to skip them.

5. **Missing Data**: Some fields may be null or empty if the information isn't available on the source.

## Working with Episodes

### Sorting Episodes

Episodes are typically returned in ascending order by episode number. If you need reverse order:

```javascript
const latestEpisodes = [...anime.episodes].reverse();
```

### Filtering Fillers

```javascript
const mainStoryEpisodes = anime.episodes.filter(ep => !ep.isFiller);
const fillerEpisodes = anime.episodes.filter(ep => ep.isFiller);
```

### Finding Specific Episode

```javascript
function findEpisode(anime, episodeNumber) {
  return anime.episodes.find(ep => ep.number === episodeNumber);
}

const episode5 = findEpisode(anime, 5);
console.log(episode5.episodeId); // Use this for streaming
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Description shows HTML tags | Sanitize the description before display |
| Missing episode data | Some anime may not have episode details |
| Stale data | Wait 24 hours for cache to expire |
| Invalid anime ID | Ensure ID comes from search results |
