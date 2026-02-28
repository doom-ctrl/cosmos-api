import { getEpisodeSources } from './aniwatch';

interface StreamResult {
  success: boolean;
  data?: any;
  error?: any;
}

const FALLBACK_SERVERS = [
  { name: 'hd-1', type: 'sub' },
  { name: 'hd-2', type: 'sub' },
  { name: 'hd-1', type: 'dub' },
  { name: 'mega-cloud', type: 'sub' },
  { name: 'vidplay', type: 'sub' }
];

export async function getStream(
  episodeId: string,
  server: string = 'hd-1',
  type: string = 'sub'
): Promise<StreamResult> {
  
  const result = await tryServer(episodeId, server, type);
  
  if (result.success) {
    return result;
  }
  
  for (const fallback of FALLBACK_SERVERS) {
    if (fallback.name === server && fallback.type === type) continue;
    
    const fallbackResult = await tryServer(
      episodeId, 
      fallback.name, 
      fallback.type
    );
    
    if (fallbackResult.success) {
      return {
        ...fallbackResult,
        data: {
          ...fallbackResult.data,
          usedFallback: fallback.name
        }
      };
    }
  }
  
  return {
    success: false,
    error: {
      code: 'STREAM_NOT_FOUND',
      message: 'No playable stream found',
      details: {
        episodeId,
        tried: [server, ...FALLBACK_SERVERS.map(s => s.name)]
      }
    }
  };
}

async function tryServer(
  episodeId: string,
  server: string,
  type: string
): Promise<StreamResult> {
  try {
    const sources = await getEpisodeSources(
      episodeId,
      server,
      type as 'sub' | 'dub' | 'raw'
    );
    
    if (!sources || !sources.sources || sources.sources.length === 0) {
      return {
        success: false,
        error: { code: 'NO_SOURCES', message: 'No sources returned' }
      };
    }
    
    return {
      success: true,
      data: {
        sources: sources.sources.map((source: any) => ({
          ...source,
          url: source.url.startsWith('http') 
            ? `/api/v1/proxy?url=${encodeURIComponent(source.url)}`
            : source.url
        })),
        headers: sources.headers,
        tracks: sources.tracks,
        intro: sources.intro,
        outro: sources.outro
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: { 
        code: 'SERVER_ERROR', 
        message: error.message 
      }
    };
  }
}
