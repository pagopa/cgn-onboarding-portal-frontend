/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly CGN_API_URL: string;
  readonly CGN_ONE_IDENTITY_CLIENT_ID: string;
  readonly CGN_ONE_IDENTITY_LOGIN_URI: string;
  readonly CGN_ONE_IDENTITY_REDIRECT_URI: string;
  readonly CGN_MSAL_CLIENT_ID: string;
  readonly CGN_MSAL_AUTHORITY: string;
  readonly CGN_MSAL_REDIRECT_URI: string;
  readonly CGN_IMAGE_BASE_URL: string;
  readonly CGN_RECAPTCHA_API_KEY: string;
  readonly CGN_ALLOW_MULTIPLE_LOGIN?: string;
  readonly CGN_FRONTEND_URL?: string;
  readonly CGN_API_PROXY_TARGET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare var __APP_VERSION__: string;
declare var __COMMIT_HASH__: string;
