/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_URL: string
  readonly VITE_ADMIN_SITE_URL: string
  readonly VITE_PUBLIC_SITE_URL: string
  readonly VITE_ENABLE_DEMO_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
