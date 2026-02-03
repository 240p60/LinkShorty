import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import biomePlugin from "vite-plugin-biome";

export default defineConfig({
  root: ".",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  base: "/",
  plugins: [
    react(),
    biomePlugin({
      mode: "format",
      applyFixes: true,
      unsafe: false,
    }),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@components": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@context": path.resolve(__dirname, "src/context"),
      "@store": path.resolve(__dirname, "src/store"),
      "@routes": path.resolve(__dirname, "src/routes"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    allowedHosts: ["ungrowling-tenderly-lucian.ngrok-free.dev"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
