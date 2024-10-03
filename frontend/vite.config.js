import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying /api calls to your Render URL
      "/api": {
        target: "https://quizinator-4whc.onrender.com",
        changeOrigin: true,
        secure: false, // Set to true if your API is using HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove '/api' from the path when forwarding
      },
    },
  },
});
