/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import type { EnvVariables } from "./utils/env-variables";

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv extends EnvVariables {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
