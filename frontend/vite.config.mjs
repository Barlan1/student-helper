import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// backend sandbox URL
const backendURL = "https://3p8l34-3002.csb.app";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      // frontend host
      "3p8l34-5173.csb.app",
      // backend host
      "3p8l34-3002.csb.app",
    ],
    proxy: {
      "/api": {
        target: backendURL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
