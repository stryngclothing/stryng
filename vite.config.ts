import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Read env vars without pulling in @types/node.
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const tauriDevHost = env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Don't let Vite wipe Rust compiler errors out of the terminal.
  clearScreen: false,

  server: {
    // Tauri expects a fixed port; fail loudly instead of silently picking another.
    port: 1420,
    strictPort: true,
    host: tauriDevHost || false,
    hmr: tauriDevHost
      ? { protocol: "ws", host: tauriDevHost, port: 1421 }
      : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },

  build: {
    // WebView2 on current Windows 10/11 is Chromium 105+.
    target: "chrome105",
    sourcemap: false,
  },
});
