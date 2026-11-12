/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the Mission Tree web app, for example https://tree.example.org */
  readonly VITE_MISSION_TREE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
