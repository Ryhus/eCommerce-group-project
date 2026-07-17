import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

const apiProxy = {
  "/api": {
    target: "http://localhost:3000",
    changeOrigin: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  // base: "/eCommerce-group-project/", // gh-page
  base: "/", // for Netify
  plugins: [react(), eslint()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
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
