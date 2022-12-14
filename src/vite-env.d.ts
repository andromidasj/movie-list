/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TMDB_API_KEY: string;
  readonly TMDB_ACCESS_TOKEN: string;
  readonly TMDB_ACCOUNT_ID: string;
  readonly PLEX_ACCESS_TOKEN: string;
  readonly PLEX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
