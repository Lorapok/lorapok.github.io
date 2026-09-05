import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          if (id.includes("node_modules/firebase")) {
            return "vendor-firebase";
          }
          if (id.includes("node_modules/react-router") || id.includes("node_modules/react-router-dom")) {
            return "vendor-router";
          }
        },
      },
    },
  },
});
