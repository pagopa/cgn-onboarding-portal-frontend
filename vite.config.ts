import path from "path";
import * as child from "child_process";
import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { imagetools } from "vite-imagetools";
import packageJSON from "./package.json";

// eslint-disable-next-line sonarjs/no-os-command-from-path
const commitHash = child.execSync("git rev-parse HEAD").toString();

const envPrefix = "CGN_";

const env = loadEnv("all", process.cwd(), [envPrefix]);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        ref: true,
        svgo: true,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          floatPrecision: 2
        }
      }
    }),
    imagetools()
  ],
  resolve: {
    alias: {
      // fix for bootstrap
      "@splidejs/splide/src/css/core/index": path.resolve(
        __dirname,
        "node_modules/@splidejs/splide/src/css/core/index.scss"
      ),
      // fix for scss imports in node_modules
      "~": path.resolve(__dirname, "./node_modules")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          "slash-div",
          "global-builtin",
          "abs-percent",
          "mixed-decls",
          "color-functions",
          "function-units",
          "import"
        ]
      }
    }
  },
  build: {},
  ssr: {
    noExternal: ["@reduxjs/toolkit"]
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: Object.fromEntries(
      ["public", "api", "backoffice"].map(path => [
        `/${path}`,
        {
          target: env.CGN_API_PROXY_TARGET_URL,
          headers: {
            Origin: env.CGN_FRONTEND_URL,
            Referer: env.CGN_FRONTEND_URL + "/"
          },
          changeOrigin: true,
          secure: false
        }
      ])
    )
  },
  preview: {
    port: 3000
  },
  envPrefix,
  define: {
    __APP_VERSION__: JSON.stringify(packageJSON.version),
    __COMMIT_HASH__: JSON.stringify(commitHash)
  }
});
