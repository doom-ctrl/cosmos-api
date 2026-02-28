# Episodes List

The episodes endpoint provides a dedicated way to fetch the episode list for an anime. While anime details already include episodes, this endpoint can be useful for refreshing the episode list or when you only need episodes without full anime details.

## Endpoint

```
GET /api/v1/episodes/:id
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Anime ID from search results |

## Request Examples

### cURL

```bash
curl "http://localhost:3000/api/v1/episodes/18220"
```

### JavaScript (fetch)

```javascript
async function getEpisodes(animeId) {
  const response = await fetch(`/api/v1/episodes/${animeId}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

// Usage
const episodesData = await getEpisodes('18220');
console.log(episodesData.animeTitle); // "Naruto"
console.log(episodesData.animeId);     // "18220"
console.log(episodesData.episodes);   // Array of episodes
```

### React Example

```jsx
import { useState, useEffect } from 'react';

function EpisodeList({ animeId, onSelectEpisode }) {
  const [episodes, setEpisodes] = useState([]);
  const [animeTitle, setAnimeTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'main', 'filler'

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/episodes/${animeId}`);
        const data = await response.json();

        if (data.success) {
          setEpisodes(data.data.episodes);
          setAnimeTitle(data.data.animeTitle);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('Failed to load episodes');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeId]);

  const filteredEpisodes = episodes.filter(ep => {
    if (filter === 'main') return !ep.isFiller;
    if (filter === 'filler') return ep.isFiller;
    return true;
  });

  if (loading) return <div>Loading episodes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="episode-list-container">
      <div className="episode-header">
        <h2>{animeTitle} - Episodes</h2>
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All ({episodes.length})
          </button>
          <button 
            onClick={() => setFilter('main')}
            className={filter === 'main' ? 'active' : ''}
          >
            Main ({episodes.filter(e => !e.isFiller).length})
          </button>
          <button 
            onClick={() => setFilter('filler')}
            className={filter === 'filler' ? 'active' : ''}
          >
            Filler ({episodes.filter(e => e.isFiller).length})
          </button>
        </div>
      </div>

      <div className="episode-grid">
        {filteredEpisodes.map((ep) => (
          <div
            key={ep.episodeId}
            className={`episode-card ${ep.isFiller ? 'filler' : ''}`}
            onClick={() => onSelectEpisode(ep)}
          >
            <span className="episode-number">Ep {ep.number}</span>
            <span className="episode-title">{ep.title}</span>
            {ep.isFiller && <span className="filler-badge">Filler</span>}
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
  <div class="episode-list-container">
    <div v-if="loading">Loading episodes...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h2>{{ animeTitle }} - Episodes</h2>
      
      <div class="filter-buttons">
        <button @click="filter = 'all'" :class="{ active: filter === 'all' }">
          All ({{ episodes.length }})
        </button>
        <button @click="filter = 'main'" :class="{ active: filter === 'main' }">
          Main ({{ mainCount }})
        </button>
        <button @click="filter = 'filler'" :class="{ active: filter === 'filler' }">
          Filler ({{ fillerCount }})
        </button>
      </div>

      <div class="episode-grid">
        <div
          v-for="ep in filteredEpisodes"
          :key="ep.episodeId"
          class="episode-card"
          :class="{ filler: ep.isFiller }"
          @click="$emit('select-episode', ep)"
        >
          <span class="episode-number">Ep {{ ep.number }}</span>
          <span class="episode-title">{{ ep.title }}</span>
          <span v-if="ep.isFiller" class="filler-badge">Filler</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  animeId: { type: String, required: true }
});

const emit = defineEmits(['select-episode']);

const episodes = ref([]);
const animeTitle = ref('');
const loading = ref(true);
const error = ref(null);
const filter = ref('all');

const fetchEpisodes = async () => {
  try {
    const response = await fetch(`/api/v1/episodes/${props.animeId}`);
    const data = await response.json();

    if (data.success) {
      episodes.value = data.data.episodes;
      animeTitle.value = data.data.animeTitle;
    } else {
      error.value = data.error.message;
    }
  } catch (err) {
    error.value = 'Failed to load episodes';
  } finally {
    loading.value = false;
  }
};

const filteredEpisodes = computed(() => {
  if (filter.value === 'main') return episodes.value.filter(e => !e.isFiller);
  if (filter.value === 'filler') return episodes.value.filter(e => e.isFiller);
  return episodes.value;
});

const mainCount = computed(() => episodes.value.filter(e => !e.isFiller).length);
const fillerCount = computed(() => episodes.value.filter(e => e.isFiller).length);

onMounted(fetchEpisodes);
</script>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "animeId": "18220",
    "animeTitle": "Naruto",
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
    "message": "Failed to fetch episodes"
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
| `animeId` | string | The anime ID used in the request |
| `animeTitle` | string | Name of the anime |
| `episodes` | array | Array of episode objects |
| `episodes[].episodeId` | string | Unique episode identifier (required for streaming) |
| `episodes[].number` | number | Episode number |
| `episodes[].title` | string | Episode title |
| `episodes[].isFiller` | boolean | Whether episode is filler |

## Important Notes

1. **Episode ID is Key**: The `episodeId` is essential for fetching stream URLs. Never use the anime ID for streaming - you must use the specific episode's ID.

2. **Caching**: Episode lists are cached for 24 hours. If new episodes were released, you might need to wait for cache expiration or implement a manual refresh.

3. **Episode ID Format**: Episode IDs are numeric strings (e.g., "128841"), different from anime IDs.

4. **Missing Titles**: Some episodes may have null titles if not available.

## Common Use Cases

### Latest Episode Detection

```javascript
function getLatestEpisode(episodes) {
  return episodes.reduce((latest, ep) => 
    ep.number > latest.number ? ep : latest
  );
}

const latest = getLatestEpisode(episodesData.episodes);
console.log(`Latest: Episode ${latest.number}`);
```

### Batch Episode Selection

```javascript
// For anime with many episodes, allow range selection
function getEpisodeRange(episodes, start, end) {
  return episodes.filter(ep => 
    ep.number >= start && ep.number <= end
  );
}

const season1 = getEpisodeRange(episodesData.episodes, 1, 50);
```

### Quick Continue Watching

```javascript
// Store last watched episode number in localStorage
const continueFrom = localStorage.getItem('lastWatchedNaruto') || 1;

const nextEpisode = episodes.find(ep => ep.number === continueFrom + 1);
if (nextEpisode) {
  // Auto-continue to next episode
  loadEpisode(nextEpisode.episodeId);
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Empty episode list | The anime might not have episodes available |
| Old episode data | Check if API cache needs refresh (24h TTL) |
| Wrong episode selected | Always use episodeId, not episode number |
| Can't find specific episode | Some episodes might be missing from the list |
