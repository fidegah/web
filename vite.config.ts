import basicSsl from "@vitejs/plugin-basic-ssl";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [basicSsl(), tailwindcss(), reactRouter()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    host: true,
    allowedHosts: [".lvh.me"],
    port: 5173,
  },
});
