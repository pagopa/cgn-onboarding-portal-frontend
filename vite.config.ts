import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const env = loadEnv("all", process.cwd(), ["CGN_"]);

const PROXY_API_TARGET = `https://${env.CGN_API_DOMAIN}`;

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
    })
  ],
  resolve: {
    alias: {
      "@splidejs/splide/src/css/core/index": path.resolve(
        __dirname,
        "node_modules/@splidejs/splide/src/css/core/index.scss"
      ),
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
    sourcemap: true,
    assetsInlineLimit(file) {
      return !file.endsWith(".svg");
    }
  },
  server: {
    proxy: {
      "/public": {
        target: PROXY_API_TARGET,
        changeOrigin: true,
        secure: false
      },
      "/api": {
        target: PROXY_API_TARGET,
        changeOrigin: true,
        secure: false
      },
      "/backoffice": {
        target: PROXY_API_TARGET,
        changeOrigin: true,
        secure: false
      }
    }
  },
  envPrefix: "CGN_"
});
