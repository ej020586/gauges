import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./src", // so relative paths work offline
  build: {
    outDir: "dist",
    target: ["chrome89"],
    minify: false,
  },
});