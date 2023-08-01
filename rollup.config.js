import vue from "rollup-plugin-vue";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import scss from "rollup-plugin-scss";

export default [
  {
    input: "src/index.js",
    output: [
      {
        format: "esm",
        file: "dist/library.mjs",
      },
      {
        format: "cjs",
        file: "dist/library.js",
      },
    ],
    plugins: [
      // vue(),
      // peerDepsExternal(),
      // resolve({ extensions: [".js", ".ts"] }),
      // sucrase({
      //   exclude: ["node_modules/**"],
      //   transforms: ["typescript"],
      // }),
      // scss(),
    ],
  },
];
