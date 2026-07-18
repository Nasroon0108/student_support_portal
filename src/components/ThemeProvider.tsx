"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read initial theme set by the inline script in <head>
    const attr = document.documentElement.getAttribute("data-theme");
    setThemeState((attr === "dark" ? "dark" : "light") as Theme);
    setMounted(true);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore write errors (e.g. private mode) */
    }
  };

  const toggle = () => setTheme(theme === "light" ? "dark" : "light");

  // `mounted` is intentionally read only so the effect above triggers a re-render
  // after hydration, syncing the client state with the value set by the pre-paint script.
  void mounted;

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
