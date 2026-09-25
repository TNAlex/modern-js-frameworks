import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],

  server: {
    port: 5180,
  },

  base: command === "build" ? "/proiect_frontend/" : "/",
}));
