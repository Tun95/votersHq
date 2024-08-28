/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_BASE_URL: string;
  readonly VITE_REACT_APP_FRONTEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
