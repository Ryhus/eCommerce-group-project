import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

// https://vite.dev/config/
export default defineConfig({
  base: "/eCommerce-group-project/",
  plugins: [react(), eslint()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["node_modules", "dist", ".git"],
    setupFiles: "./src/tests/setup.ts",
    coverage: {
      provider: "v8",
    },
  },
});
