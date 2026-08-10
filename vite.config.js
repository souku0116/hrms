import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const REQUIRED_CLIENT_ENV = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

function validateClientEnv(mode) {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const missing = REQUIRED_CLIENT_ENV.filter((name) => {
    const value = process.env[name] ?? fileEnv[name];
    return !value?.trim();
  });

  if (missing.length === 0) {
    return;
  }

  const target = process.env.VERCEL ? "Vercel project settings" : ".env.local";
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
      `Add them in ${target} and redeploy.`,
  );
}

export default defineConfig(({ mode }) => {
  validateClientEnv(mode);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    envPrefix: ["VITE_"],
    server: {
      port: 3000,
      open: true,
    },
  };
});
