import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // Change this to your deployed Vercel URL in production
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
