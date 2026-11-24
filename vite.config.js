import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function validateClientEnv(mode) {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const hasValue = (name) => Boolean((process.env[name] ?? fileEnv[name])?.trim());
  const missing = [];
  if (!hasValue("VITE_SUPABASE_URL")) missing.push("VITE_SUPABASE_URL");
  if (!hasValue("VITE_SUPABASE_PUBLISHABLE_KEY") && !hasValue("VITE_SUPABASE_ANON_KEY")) {
    missing.push("VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY");
  }

  if (missing.length === 0) {
    return;
  }

  const target = process.env.VERCEL ? "Vercel project settings" : ".env.local";
  const message =
    `Missing required environment variables: ${missing.join(", ")}. ` +
    `Add them in ${target} and redeploy.`;

  // Fail fast in local dev; allow production builds so Vercel previews can deploy
  // and the runtime ConfigError screen can guide setup.
  if (mode === "development") {
    throw new Error(message);
  }

  console.warn(`[vite] ${message}`);
}

function localApiPlugin(mode) {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const serverEnvNames = [
    "SUPABASE_URL",
    "VITE_SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GROQ_API_KEY",
    "GROQ_MODEL",
    "GROQ_VISION_MODEL",
  ];
  for (const name of serverEnvNames) {
    if (!process.env[name] && fileEnv[name]) process.env[name] = fileEnv[name];
  }

  return {
    name: "worksync-local-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || "/", "http://localhost").pathname;
        if (!pathname.startsWith("/api/")) return next();

        const modulePath = `${pathname}.js`;
        try {
          if (!/^\/api\/[a-zA-Z0-9_/-]+\.js$/.test(modulePath) || modulePath.includes("..")) {
            response.statusCode = 404;
            response.end("Not found");
            return;
          }

          const { default: handler } = await server.ssrLoadModule(modulePath);
          const chunks = [];
          let bodySize = 0;
          for await (const chunk of request) {
            bodySize += chunk.length;
            if (bodySize > 1024 * 1024) {
              response.statusCode = 413;
              response.setHeader("Content-Type", "application/json; charset=utf-8");
              response.end(JSON.stringify({ error: "Request body is too large." }));
              return;
            }
            chunks.push(chunk);
          }

          if (bodySize > 0) {
            const rawBody = Buffer.concat(chunks).toString("utf8");
            request.body = request.headers["content-type"]?.includes("application/json")
              ? JSON.parse(rawBody)
              : rawBody;
          }

          const apiResponse = {
            status(code) {
              response.statusCode = code;
              return this;
            },
            setHeader(name, value) {
              response.setHeader(name, value);
              return this;
            },
            json(payload) {
              response.setHeader("Content-Type", "application/json; charset=utf-8");
              response.end(JSON.stringify(payload));
              return this;
            },
          };

          await handler(request, apiResponse);
          if (!response.writableEnded) response.end();
        } catch (error) {
          response.statusCode = error instanceof SyntaxError ? 400 : 500;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: error instanceof SyntaxError ? "Invalid JSON request body." : "Local API route failed to load." }));
          if (!(error instanceof SyntaxError)) {
            // eslint-disable-next-line no-console
            console.error(`[vite local api] ${pathname}`, error);
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  validateClientEnv(mode);

  return {
    plugins: [react(), tailwindcss(), localApiPlugin(mode)],
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
