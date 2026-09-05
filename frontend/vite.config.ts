import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/semantic": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/sementic": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("victory-vendor") || id.includes("d3-")) {
              return "d3-vendor";
            }
            if (id.includes("framer-motion")) {
              return "motion";
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
          }
        },
      },
    },
  },
});
