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
export default defineConfig(({ mode }) => ({
  // base: "/eCommerce-group-project/", // gh-page
  base: "/", // for Netify
  // Production builds are linted by CI before deployment. Skipping the Vite
  // lint transform keeps standalone service builds independent of root config.
  plugins: [react(), ...(mode === "production" ? [] : [eslint()])],
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
}));
