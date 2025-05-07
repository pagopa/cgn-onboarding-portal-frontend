import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@splidejs/splide/src/css/core/index":
        "node_modules/@splidejs/splide/src/css/core/index.scss"
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
  }
});
