# Complete Integration Example

This guide walks through building a complete anime streaming application from search to playback. By the end, you'll have a functional understanding of how all the API endpoints work together.

## The Workflow

```
1. User searches for anime
        │
        ▼
2. Display search results
        │
        ▼
3. User clicks on anime
        │
        ▼
4. Get anime details & episodes
        │
        ▼
5. User selects episode
        │
        ▼
6. Get streaming URL
        │
        ▼
7. Play video (via proxy for CORS)
```

## Complete React Application Example

### Main Application Structure

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import AnimePage from './pages/AnimePage';
import WatchPage from './pages/WatchPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>AnimeStream</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/anime/:id" element={<AnimePage />} />
            <Route path="/watch/:episodeId" element={<WatchPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

### Search Page

```jsx
// pages/SearchPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.success) {
        setResults(data.data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="results-grid">
        {results.map((anime) => (
          <div
            key={anime.id}
            className="anime-card"
            onClick={() => navigate(`/anime/${anime.id}`)}
          >
            <img src={anime.image} alt={anime.title} />
            <h3>{anime.title}</h3>
            <p>{anime.episodes} episodes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Anime Details Page

```jsx
// pages/AnimePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AnimePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch(`/api/v1/anime/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setAnime(data.data);
        }
      } catch (error) {
        console.error('Failed to load anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!anime) return <div>Anime not found</div>;

  return (
    <div className="anime-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Search
      </button>

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
            {anime.genres.map((g) => (
              <span key={g} className="genre">{g}</span>
            ))}
          </div>

          <p className="description">{anime.description}</p>
        </div>
      </div>

      <h2>Episodes</h2>
      <div className="episodes-grid">
        {anime.episodes.map((ep) => (
          <button
            key={ep.episodeId}
            className="episode-button"
            onClick={() => navigate(`/watch/${ep.episodeId}`)}
          >
            <span className="ep-number">Ep {ep.number}</span>
            <span className="ep-title">{ep.title}</span>
            {ep.isFiller && <span className="filler">Filler</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Watch/Video Player Page

```jsx
// pages/WatchPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

export default function WatchPage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servers, setServers] = useState(['hd-1', 'hd-2', 'hd-3']);
  const [currentServer, setCurrentServer] = useState('hd-1');
  const [streamType, setStreamType] = useState('sub');

  useEffect(() => {
    const fetchStream = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/v1/stream?episodeId=${episodeId}&server=${currentServer}&type=${streamType}`
        );
        const data = await res.json();

        if (data.success) {
          const originalUrl = data.data.sources[0].url;
          const proxyUrl = `/api/v1/proxy?url=${encodeURIComponent(originalUrl)}`;
          setStreamUrl(proxyUrl);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('Failed to load stream');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [episodeId, currentServer, streamType]);

  // Initialize HLS player
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 30,
        maxMaxBufferLength: 60
      });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div className="watch-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Episodes
      </button>

      <div className="video-container">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="video-player"
        />
      </div>

      <div className="player-controls">
        <div className="server-select">
          <label>Server:</label>
          {servers.map((server) => (
            <button
              key={server}
              onClick={() => setCurrentServer(server)}
              className={currentServer === server ? 'active' : ''}
            >
              {server.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="type-select">
          <label>Type:</label>
          <button
            onClick={() => setStreamType('sub')}
            className={streamType === 'sub' ? 'active' : ''}
          >
            Sub
          </button>
          <button
            onClick={() => setStreamType('dub')}
            className={streamType === 'dub' ? 'active' : ''}
          >
            Dub
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading stream...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## State Management Example

For larger applications, consider using a state management solution:

```jsx
// context/AnimeContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const AnimeContext = createContext();

export function AnimeProvider({ children }) {
  const [watchHistory, setWatchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addToHistory = useCallback((animeId, episodeId) => {
    setWatchHistory(prev => {
      const existing = prev.find(
        h => h.animeId === animeId && h.episodeId === episodeId
      );
      if (existing) return prev;
      
      return [...prev, { animeId, episodeId, watchedAt: new Date() }];
    });
  }, []);

  const toggleFavorite = useCallback((animeId) => {
    setFavorites(prev => 
      prev.includes(animeId)
        ? prev.filter(id => id !== animeId)
        : [...prev, animeId]
    );
  }, []);

  return (
    <AnimeContext.Provider value={{
      watchHistory,
      favorites,
      addToHistory,
      toggleFavorite
    }}>
      {children}
    </AnimeContext.Provider>
  );
}

export const useAnime = () => useContext(AnimeContext);
```

## API Helper Functions

Create a centralized API service:

```javascript
// services/api.js
const BASE_URL = '/api/v1';

export const api = {
  search: async (query, page = 1) => {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`);
    return res.json();
  },

  getAnime: async (id) => {
    const res = await fetch(`${BASE_URL}/anime/${id}`);
    return res.json();
  },

  getEpisodes: async (id) => {
    const res = await fetch(`${BASE_URL}/episodes/${id}`);
    return res.json();
  },

  getServers: async (episodeId) => {
    const res = await fetch(`${BASE_URL}/servers?episodeId=${episodeId}`);
    return res.json();
  },

  getStream: async (episodeId, server = 'hd-1', type = 'sub') => {
    const res = await fetch(
      `${BASE_URL}/stream?episodeId=${episodeId}&server=${server}&type=${type}`
    );
    return res.json();
  },

  getProxyUrl: (streamUrl) => {
    return `${BASE_URL}/proxy?url=${encodeURIComponent(streamUrl)}`;
  }
};
```

## Error Handling Best Practices

```javascript
// Custom hook for API calls with error handling
function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(new Error(result.error.message));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

// Usage
function AnimeDetails({ id }) {
  const { data, loading, error, execute } = useApi(
    () => fetch(`/api/v1/anime/${id}`).then(r => r.json()),
    [id]
  );

  useEffect(() => { execute(); }, [execute]);

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay message={error.message} />;
  return <AnimeInfo data={data} />;
}
```

## Performance Optimizations

### 1. Debounce Search Input

```javascript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(async (query) => {
  const res = await fetch(`/api/v1/search?q=${query}`);
  const data = await res.json();
  setResults(data.data.results);
}, 300);
```

### 2. Lazy Load Episode Images

```jsx
<img 
  src={ep.image} 
  loading="lazy" 
  alt={`Episode ${ep.number}`} 
/>
```

### 3. Preload Next Episode

```javascript
function preloadNextEpisode(currentEpisodeId) {
  // Fetch stream URL in background
  fetch(`/api/v1/stream?episodeId=${currentEpisodeId + 1}`)
    .then(res => res.json())
    .then(data => {
      // Cache the URL for instant playback
      sessionStorage.setItem(`stream_${currentEpisodeId + 1}`, 
        JSON.stringify(data.data)
      );
    });
}
```

### 4. Cache API Responses

```javascript
const cache = new Map();

async function fetchWithCache(url, cacheKey, ttl = 60000) {
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const res = await fetch(url);
  const data = await res.json();
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
```

## Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  Home    │────▶│   Search     │────▶│   Results   │────▶│  Select  │
│  Page    │     │   (API #1)   │     │   (API #1)  │     │   Anime  │
└──────────┘     └──────────────┘     └─────────────┘     └────┬─────┘
                                                                │
                                                                ▼
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  Watch   │◀────│   Stream     │◀────│   Episode   │◀────│  Anime   │
│  Video   │     │   (API #5)   │     │   (API #4)  │     │ Details  │
│  (HLS)   │     │   + Proxy    │     │             │     │(API #2,3)│
└──────────┘     └──────────────┘     └─────────────┘     └──────────┘

API Endpoints Used:
#1: GET /api/v1/search?q=...
#2: GET /api/v1/anime/:id
#3: GET /api/v1/episodes/:id
#4: GET /api/v1/servers?episodeId=...
#5: GET /api/v1/stream?episodeId=...&server=...&type=...
#6: GET /api/v1/proxy?url=... (for video playback)
```

## Quick Reference

| Step | Action | Endpoint |
|------|--------|----------|
| 1 | Search anime | `GET /api/v1/search?q={query}` |
| 2 | Get anime details | `GET /api/v1/anime/{id}` |
| 3 | Get episode list | `GET /api/v1/episodes/{id}` |
| 4 | Get servers | `GET /api/v1/servers?episodeId={id}` |
| 5 | Get stream URL | `GET /api/v1/stream?episodeId={id}&server=hd-1&type=sub` |
| 6 | Play video | Use proxy: `/api/v1/proxy?url={encodedStreamUrl}` |

## Common Pitfalls to Avoid

1. **Don't skip the proxy** - Always use the proxy for M3U8 URLs in browsers
2. **Store episode IDs** - Never assume episode numbers stay the same
3. **Handle errors gracefully** - Network issues are common with streaming
4. **Implement loading states** - Video loading takes time
5. **Consider mobile** - Test on various devices and networks

## Next Steps

Now that you understand the complete workflow:

1. Add user authentication for favorites/watch history
2. Implement continue watching feature
3. Add search history
4. Consider offline playback (PWA)
5. Add video quality selection
6. Implement anime recommendations
