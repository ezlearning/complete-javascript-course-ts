// @ts-ignore
import { defineConfig } from "vite";
import { resolve } from "path";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  plugins: [commonjs()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),

        // the-complete-javascript-course
        "15-mapty": resolve(__dirname, "15-mapty/index.html"),
        "16-asynchronous": resolve(__dirname, "16-asynchronous/index.html"),
        "18-forkify": resolve(__dirname, "18-forkify/index.html"),
      },
    },
    commonjsOptions: {
      include: ["node_modules/fractional/*.js"],
    },
  },
});
