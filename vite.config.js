import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // so relative paths work offline
  build: {
    outDir: "dist",
    minify: false,
    target: ["es2015"],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});