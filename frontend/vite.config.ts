import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  define: {
    global: {}, // Support for some npm packages that expect a global object
  },
  server: {
    // Optional: configuration for development server
    port: 3000,
    open: true,
  },
});
