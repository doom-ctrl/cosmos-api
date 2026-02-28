export interface SearchResult {
  id: string;
  title: string;
  image: string;
  status: string;
  episodes: {
    sub: number;
    dub: number;
  };
}

export interface AnimeInfo {
  id: string;
  title: string;
  japaneseTitle: string;
  image: string;
  description: string;
  genres: string[];
  status: string;
  releaseDate: string;
  totalEpisodes: number;
}

export interface Episode {
  episodeId: string;
  number: number;
  title: string;
  isFiller: boolean;
}

export interface Server {
  name: string;
  id: string;
  type: 'sub' | 'dub';
}

export interface Source {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface Track {
  file: string;
  label: string;
  kind: 'captions' | 'subtitles';
  default?: boolean;
}

export interface StreamData {
  sources: Source[];
  headers: Record<string, string>;
  tracks: Track[];
  intro?: {
    start: number;
    end: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
