/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

interface ImportMeta {
  readonly env: {
    readonly VITE_TBA_API_KEY: string
  }
}

declare const APP_VERSION: string;
