import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

// https://vite.dev/config/
export default defineConfig({
  // base: "/eCommerce-group-project/", // gh-page
  base: "/", // for Netify
  plugins: [react(), eslint()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: { url: "http://localhost:3000" },
    },
    exclude: ["node_modules", "dist", ".git"],
    setupFiles: "./src/tests/setup.ts",
    coverage: {
      provider: "v8",
    },
  },
});
