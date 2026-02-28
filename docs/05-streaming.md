# Streaming

The streaming endpoint provides video source URLs for playback. It includes automatic server fallback logic - if the primary server fails, it tries alternative servers.

## Endpoint

```
GET /api/v1/stream
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `episodeId` | string | Yes | Episode ID from episodes endpoint |
| `server` | string | No | Server identifier (default: hd-1) |
| `type` | string | No | Stream type: "sub" (subbed) or "dub" (dubbed), default: sub |

## Available Servers

| Server ID | Description |
|-----------|-------------|
| `hd-1` | Primary HD server |
| `hd-2` | Secondary HD server |
| `hd-3` | Third HD server |
| `hd-4` | Fourth HD server |
| `hd-5` | Fifth HD server |

## Request Examples

### cURL

```bash
# Basic stream request
curl "http://localhost:3000/api/v1/stream?episodeId=128841"

# Specify server and type
curl "http://localhost:3000/api/v1/stream?episodeId=128841&server=hd-1&type=sub"
```

### JavaScript (fetch)

```javascript
async function getStreamUrl(episodeId, server = 'hd-1', type = 'sub') {
  const params = new URLSearchParams({
    episodeId,
    server,
    type
  });

  const response = await fetch(`/api/v1/stream?${params}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

// Usage
const stream = await getStreamUrl('128841');
console.log(stream.sources);    // Array of video sources
console.log(stream.sources[0].url); // Video URL
```

### React Video Player Example

```jsx
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

function VideoPlayer({ episodeId }) {
  const videoRef = useRef(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentServer, setCurrentServer] = useState('hd-1');
  const [streamType, setStreamType] = useState('sub');

  useEffect(() => {
    const loadStream = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          episodeId,
          server: currentServer,
          type: streamType
        });

        const response = await fetch(`/api/v1/stream?${params}`);
        const data = await response.json();

        if (data.success) {
          setStreamUrl(data.data.sources[0].url);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('Failed to load stream');
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [episodeId, currentServer, streamType]);

  // Initialize HLS player
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = streamUrl;
    }
  }, [streamUrl]);

  const handleServerChange = (server) => {
    setCurrentServer(server);
  };

  const handleTypeChange = (type) => {
    setStreamType(type);
  };

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        controls
        autoPlay
        className="video-element"
      />

      <div className="player-controls">
        <div className="server-selector">
          <label>Server:</label>
          {['hd-1', 'hd-2', 'hd-3'].map(server => (
            <button
              key={server}
              onClick={() => handleServerChange(server)}
              className={currentServer === server ? 'active' : ''}
            >
              {server.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="type-selector">
          <label>Type:</label>
          <button
            onClick={() => handleTypeChange('sub')}
            className={streamType === 'sub' ? 'active' : ''}
          >
            Sub
          </button>
          <button
            onClick={() => handleTypeChange('dub')}
            className={streamType === 'dub' ? 'active' : ''}
          >
            Dub
          </button>
        </div>
      </div>

      {loading && <div className="loading-overlay">Loading stream...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
```

### Vue 3 Video Player Example

```vue
<template>
  <div class="video-player-container">
    <video
      ref="videoRef"
      controls
      autoplay
      class="video-element"
    />

    <div class="player-controls">
      <div class="server-selector">
        <label>Server:</label>
        <button
          v-for="server in servers"
          :key="server"
          @click="currentServer = server"
          :class="{ active: currentServer === server }"
        >
          {{ server.toUpperCase() }}
        </button>
      </div>

      <div class="type-selector">
        <label>Type:</label>
        <button
          @click="streamType = 'sub'"
          :class="{ active: streamType === 'sub' }"
        >
          Sub
        </button>
        <button
          @click="streamType = 'dub'"
          :class="{ active: streamType === 'dub' }"
        >
          Dub
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">Loading stream...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Hls from 'hls.js';

const props = defineProps({
  episodeId: { type: String, required: true }
});

const videoRef = ref(null);
const streamUrl = ref(null);
const loading = ref(true);
const error = ref(null);
const currentServer = ref('hd-1');
const streamType = ref('sub');
const servers = ['hd-1', 'hd-2', 'hd-3'];

let hls = null;

const loadStream = async () => {
  loading.value = true;
  error.value = null;

  try {
    const params = new URLSearchParams({
      episodeId: props.episodeId,
      server: currentServer.value,
      type: streamType.value
    });

    const response = await fetch(`/api/v1/stream?${params}`);
    const data = await response.json();

    if (data.success) {
      streamUrl.value = data.data.sources[0].url;
    } else {
      error.value = data.error.message;
    }
  } catch (err) {
    error.value = 'Failed to load stream';
  } finally {
    loading.value = false;
  }
};

const initPlayer = () => {
  if (!streamUrl.value || !videoRef.value) return;

  const video = videoRef.value;

  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(streamUrl.value);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl.value;
  }
};

watch([currentServer, streamType], loadStream);

watch(streamUrl, () => {
  if (hls) {
    hls.destroy();
  }
  initPlayer();
});

onMounted(loadStream);

onUnmounted(() => {
  if (hls) hls.destroy();
});
</script>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "url": "https://example.com/stream.m3u8",
        "quality": "auto"
      }
    ],
    "subtitles": [
      {
        "url": "https://example.com/subtitles/eng.vtt",
        "lang": "English"
      },
      {
        "url": "https://example.com/subtitles/spa.vtt",
        "lang": "Spanish"
      }
    ],
    "headers": {
      "Referer": "https://example.com/"
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
    "code": "STREAM_ERROR",
    "message": "No working servers found"
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
    "message": "episodeId is required"
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
| `sources` | array | Array of video source objects |
| `sources[].url` | string | M3U8 playlist URL |
| `sources[].quality` | string | Quality setting (usually "auto") |
| `subtitles` | array | Available subtitle tracks |
| `subtitles[].url` | string | Subtitle file URL (VTT format) |
| `subtitles[].lang` | string | Language name |
| `headers` | object | Required headers for playback |

## Important Notes

1. **M3U8 Format**: The stream URL is in M3U8 format. You'll need an HLS player to play the video (see examples above).

2. **Server Fallback**: If the primary server fails, the API automatically tries other servers. The response may contain multiple servers in order of preference.

3. **CORS Issues**: The M3U8 URL may cause CORS issues when played directly in browsers. Use the [Proxy Endpoint](./06-m3u8-proxy.md) to resolve this.

4. **Caching**: Stream URLs are cached for 30 minutes.

5. **Quality**: The default quality is "auto" which adjusts based on bandwidth.

## Advanced: Manual Server Fallback

If you want to implement your own server fallback logic:

```javascript
async function getStreamWithFallback(episodeId, type = 'sub') {
  const servers = ['hd-1', 'hd-2', 'hd-3', 'hd-4', 'hd-5'];
  
  for (const server of servers) {
    try {
      const response = await fetch(
        `/api/v1/stream?episodeId=${episodeId}&server=${server}&type=${type}`
      );
      const data = await response.json();
      
      if (data.success) {
        return { server, ...data.data };
      }
    } catch (err) {
      console.log(`Server ${server} failed, trying next...`);
      continue;
    }
  }
  
  throw new Error('All servers failed');
}
```

## Subtitle Integration

For subtitle support in your video player:

```javascript
// With video.js
const player = videojs('my-video', {
  html5: {
    vhs: {
      overrideNative: true
    }
  }
});

player.src({
  src: streamUrl,
  type: 'application/x-mpegURL'
});

// Add subtitles
player.addRemoteTextTrack({
  kind: 'subtitles',
  src: subtitles[0].url,
  srclang: 'en',
  label: 'English',
  default: true
}, false);
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Video not playing | Use HLS.js for Chrome/Firefox, native player for Safari |
| CORS errors | Use the proxy endpoint to fetch M3U8 |
| Buffering issues | Try a different server or lower quality |
| No subtitles | Check if subtitles are available in response |
| Stream failed | Wait a moment and retry; source site may be busy |
