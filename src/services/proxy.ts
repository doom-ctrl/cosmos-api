export function rewriteM3U8Urls(content: string, baseUrl: string): string {
  return content
    .split('\n')
    .map(line => {
      // Skip comments
      if (line.startsWith('#')) return line;
      
      // Skip empty lines
      if (!line.trim()) return line;
      
      // Skip absolute URLs (optional - can proxy them too)
      if (line.startsWith('http')) {
        // Uncomment below to also proxy absolute URLs
        // return `/api/v1/proxy?url=${encodeURIComponent(line)}`;
        return line;
      }
      
      // Rewrite relative URLs
      const absoluteUrl = new URL(line, baseUrl).href;
      return `/api/v1/proxy?url=${encodeURIComponent(absoluteUrl)}`;
    })
    .join('\n');
}

export function getRefererFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}/`;
  } catch {
    return 'https://hianime.to/';
  }
}
