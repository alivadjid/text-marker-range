import path from "node:path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "vue3-highlight-text-color": path.resolve(__dirname, "src/index.ts"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "playground/**/*.test.ts"],
  },
});
