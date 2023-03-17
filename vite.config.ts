import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // Lance le serveur de development sur le port 3000
    server: {
        port: 3000
    },
    // Permet à Vite.JS de comprendre que on fait du react
    esbuild: {
        loader: "jsx",
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
                ".ts": "tsx",
            },
        },
    },
});