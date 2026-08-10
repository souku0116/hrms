import React from "react";
import ReactDOM from "react-dom/client";
import ConfigError from "@/components/common/ConfigError";
import "@/styles/index.css";

const hasSupabaseConfig =
  Boolean(import.meta.env.VITE_SUPABASE_URL?.trim()) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY?.trim());

async function bootstrap() {
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement);

  if (!hasSupabaseConfig) {
    root.render(<ConfigError />);
    return;
  }

  const [{ default: App }, { ThemeProvider }] = await Promise.all([
    import("@/App"),
    import("@/config/ThemeProvider"),
  ]);

  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
}

bootstrap();
