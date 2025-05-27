/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly CGN_API_DOMAIN: string;
  readonly CGN_ONE_IDENTITY_CLIENT_ID: string;
  readonly CGN_ONE_IDENTITY_LOGIN_URI: string;
  readonly CGN_ONE_IDENTITY_REDIRECT_URI: string;
  readonly CGN_MSAL_CLIENT_ID: string;
  readonly CGN_MSAL_AUTHORITY: string;
  readonly CGN_MSAL_REDIRECT_URI: string;
  readonly CGN_IMAGE_BASE_URL: string;
  readonly CGN_RECAPTCHA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
