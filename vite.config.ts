import path from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const playgroundRoot = path.resolve(projectRoot, "playground");

export default defineConfig(({ command, mode }) => {
  const isPlaygroundServer = command === "serve" && mode === "development";

  return {
    root: isPlaygroundServer ? playgroundRoot : projectRoot,
    plugins: [
      vue(),
      ...(command === "build"
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
        "vue-text-highlighter": path.resolve(projectRoot, "src/index.ts"),
      },
    },
    server: {
      port: 5000,
      strictPort: true,
    },
    build:
      command === "build"
        ? {
            target: "es2022",
            cssCodeSplit: true,
            copyPublicDir: false,
            lib: {
              entry: path.resolve(projectRoot, "src/index.ts"),
              name: "VueTextHighlighter",
              fileName: "vue-text-highlighter",
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
