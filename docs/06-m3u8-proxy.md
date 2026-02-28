# M3U8 Proxy

The M3U8 proxy endpoint solves Cross-Origin Resource Sharing (CORS) issues when playing HLS video streams directly in web browsers. When you fetch a video stream URL, the browser may block requests to the video server due to CORS policies. This proxy rewrites the stream URLs to route through your API server.

## Why Do You Need the Proxy?

When your frontend JavaScript attempts to load a video stream directly:

```javascript
// This may fail due to CORS!
const video = document.getElementById('video');
video.src = 'https://external-video-server.com/stream.m3u8';
```

The browser blocks this because:
1. The video server doesn't include CORS headers allowing your domain
2. The browser enforces the Same-Origin Policy for security

## Endpoint

```
GET /api/v1/proxy
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Encoded M3U8 URL from the stream endpoint |

## Request Examples

### Step 1: Get Stream URL

First, get the stream URL from the streaming endpoint:

```javascript
async function getStreamUrl(episodeId) {
  const response = await fetch(`/api/v1/stream?episodeId=${episodeId}`);
  const data = await response.json();
  
  // Get the first (usually best quality) source
  return data.data.sources[0].url;
}
```

### Step 2: Use Proxy URL

Then, encode the stream URL and use the proxy:

```javascript
// Get the actual stream URL
const streamUrl = await getStreamUrl('128841');

// Encode it for the proxy
const encodedUrl = encodeURIComponent(streamUrl);

// Use this URL in your video player
const proxyUrl = `/api/v1/proxy?url=${encodedUrl}`;

// In your video player:
video.src = proxyUrl;
```

### Complete Example with Video Player

```jsx
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

function VideoPlayerWithProxy({ episodeId }) {
  const videoRef = useRef(null);
  const [streamReady, setStreamReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStream = async () => {
      try {
        // Step 1: Get stream URL from API
        const streamResponse = await fetch(`/api/v1/stream?episodeId=${episodeId}`);
        const streamData = await streamResponse.json();

        if (!streamData.success) {
          throw new Error(streamData.error.message);
        }

        const originalUrl = streamData.data.sources[0].url;

        // Step 2: Create proxy URL
        const proxyUrl = `/api/v1/proxy?url=${encodeURIComponent(originalUrl)}`;

        // Step 3: Initialize video player
        const video = videoRef.current;
        
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          
          hls.loadSource(proxyUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setStreamReady(true);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError('Fatal error loading stream');
            }
          });
          
          return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari has native HLS support
          video.src = proxyUrl;
          video.addEventListener('loadedmetadata', () => setStreamReady(true));
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadStream();
  }, [episodeId]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{ width: '100%', maxWidth: '800px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

### Vue 3 Example with Proxy

```vue
<template>
  <div>
    <video
      ref="videoRef"
      controls
      autoplay
      style="width: 100%; max-width: 800px;"
    />
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Hls from 'hls.js';

const props = defineProps({
  episodeId: { type: String, required: true }
});

const videoRef = ref(null);
const error = ref(null);
let hls = null;

const loadStream = async () => {
  error.value = null;

  try {
    // Get stream URL
    const streamResponse = await fetch(`/api/v1/stream?episodeId=${props.episodeId}`);
    const streamData = await streamResponse.json();

    if (!streamData.success) {
      throw new Error(streamData.error.message);
    }

    const originalUrl = streamData.data.sources[0].url;

    // Create proxy URL
    const proxyUrl = `/api/v1/proxy?url=${encodeURIComponent(originalUrl)}`;

    // Clean up previous instance
    if (hls) {
      hls.destroy();
    }

    // Initialize player
    const video = videoRef.value;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(proxyUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxyUrl;
    }
  } catch (err) {
    error.value = err.message;
  }
};

watch(() => props.episodeId, loadStream);
onMounted(loadStream);
onUnmounted(() => { if (hls) hls.destroy(); });
</script>
```

## How the Proxy Works

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Your API   │────────▶│ Video Server│
│             │         │   (Proxy)   │         │             │
│             │◀────────│             │◀────────│             │
└─────────────┘         └─────────────┘         └─────────────┘

1. Browser requests: /api/v1/proxy?url=encoded_stream_url
2. API fetches:      https://video-server.com/stream.m3u8
3. API rewrites URLs inside the M3U8 file to go through proxy
4. API returns modified M3U8 to browser (with CORS headers)
5. Browser plays the stream without CORS errors!
```

## Response Format

The proxy returns the M3U8 content directly with appropriate CORS headers:

```
Content-Type: application/vnd.apple.mpegurl
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Range, Content-Type, Accept
Access-Control-Expose-Headers: Content-Length, Content-Range
```

### Sample M3U8 Content

```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1920x1080
https://your-api.com/api/v1/proxy?url=encoded_url_for_1080p
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=1280x720
https://your-api.com/api/v1/proxy?url=encoded_url_for_720p
#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=854x480
https://your-api.com/api/v1/proxy?url=encoded_url_for_480p
```

## Important Notes

1. **Always Encode the URL**: The stream URL must be URL-encoded:

   ```javascript
   const encoded = encodeURIComponent(originalStreamUrl);
   const proxyUrl = `/api/v1/proxy?url=${encoded}`;
   ```

2. **Headers**: Some video sources require specific headers (like Referer). The proxy automatically includes these.

3. **No Caching**: The proxy doesn't cache the video content - it proxies in real-time.

4. **Performance**: There's minimal overhead since it's just passing through the data.

5. **Quality Selection**: The proxy supports quality selection - the player can choose different variants from the master playlist.

## URL Encoding Example

```javascript
// Original stream URL
const originalUrl = 'https://vidplay.com/videos/naruto-episode-1?token=abc123';

// Encode it
const encoded = encodeURIComponent(originalUrl);
// Result: 'https%3A%2F%2Fvidplay.com%2Fvideos%2Fnaruto-episode-1%3Ftoken%3Dabc123'

// Proxy URL
const proxyUrl = `/api/v1/proxy?url=${encoded}`;
// Result: /api/v1/proxy?url=https%3A%2F%2Fvidplay.com%2Fvideos%2Fnaruto-episode-1%3Ftoken%3Dabc123
```

## Testing the Proxy Directly

```bash
# Get a stream URL first, then test proxy
curl "http://localhost:3000/api/v1/stream?episodeId=128841" | jq -r '.data.sources[0].url'

# Use that URL in the proxy (URL encoded)
curl "http://localhost:3000/api/v1/proxy?url=https%3A%2F%2Fexample.com%2Fstream.m3u8"
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Proxy returns 400 | Check that the URL parameter is properly encoded |
| Video not loading | Verify the original stream URL is valid |
| Slow playback | Proxy adds minimal overhead; check your network |
| Error in console | Check browser console for specific CORS errors |
| Proxy fails for some streams | Some servers may block proxy requests |
