import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { imagetools } from "vite-imagetools";

const envPrefix = "CGN_";

const env = loadEnv("all", process.cwd(), [envPrefix]);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
  build: {
    sourcemap: true
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: Object.fromEntries(
      ["public", "api", "backoffice"].map(path => [
        `/${path}`,
        {
          target: env.CGN_API_URL,
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
  envPrefix
});
