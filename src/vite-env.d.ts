/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_DOMAIN: string;
  readonly VITE_ONE_IDENTITY_CLIENT_ID: string;
  readonly VITE_ONE_IDENTITY_LOGIN_URI: string;
  readonly VITE_ONE_IDENTITY_REDIRECT_URI: string;
  readonly VITE_MSAL_CLIENT_ID: string;
  readonly VITE_MSAL_AUTHORITY: string;
  readonly VITE_MSAL_REDIRECT_URI: string;
  readonly VITE_IMAGE_BASE_URL: string;
  readonly VITE_RECAPTCHA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
