import { Hono } from 'hono';
import { rewriteM3U8Urls, getRefererFromUrl } from '../services/proxy';

const proxyRoute = new Hono();

proxyRoute.get('/', async (c) => {
  const url = c.req.query('url');
  
  if (!url) {
    return c.json({ error: 'url parameter required' }, 400);
  }
  
  try {
    const decodedUrl = decodeURIComponent(url);
    const referer = getRefererFromUrl(decodedUrl);
    
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': referer
      }
    });
    
    if (!response.ok) {
      return c.json({ error: 'Failed to fetch resource' }, response.status);
    }
    
    const m3u8Content = await response.text();
    const rewrittenContent = rewriteM3U8Urls(m3u8Content, decodedUrl);
    
    return new Response(rewrittenContent, {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
      }
    });
    
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Handle OPTIONS for CORS preflight
proxyRoute.options('/', (c) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
  return c.text('', 204);
});

export default proxyRoute;
