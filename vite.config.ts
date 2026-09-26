import path from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const playgroundRoot = path.resolve(projectRoot, "playground");

export default defineConfig(({ command, mode }) => {
  const isPlayground = mode === "playground";

  return {
    base:
      mode === "playground" ? process.env.PAGES_BASE_PATH ?? "/" : "/",
    root: isPlayground ? playgroundRoot : projectRoot,
    plugins: [
      vue(),
      ...(command === "build" && !isPlayground
        ? [
            dts({
              exclude: ["src/**/*.test.ts", "src/composables/**"],
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "src"),
        "vue3-highlight-text-color": path.resolve(projectRoot, "src/index.ts"),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    build:
      command === "build" && !isPlayground
        ? {
            target: "es2022",
            cssCodeSplit: true,
            copyPublicDir: false,
            lib: {
              entry: path.resolve(projectRoot, "src/index.ts"),
              name: "VueTextHighlighter",
              fileName: "vue3-highlight-text-color",
            },
            rollupOptions: {
              external: ["vue"],
              output: {
                globals: {
                  vue: "Vue",
                },
              },
            },
          }
        : undefined,
  };
});
