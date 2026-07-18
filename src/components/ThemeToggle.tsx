"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface Props {
  variant?: "icon" | "sidebar" | "block";
}

export default function ThemeToggle({ variant = "icon" }: Props) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
        style={{
          background: "transparent",
          border: "1.5px solid rgba(246,239,227,0.2)",
          color: "var(--sidebar-text)",
          borderRadius: 10,
          padding: "0.5rem 0.75rem",
        }}
        suppressHydrationWarning
      >
        <span aria-hidden style={{ fontSize: "1rem" }}>
          {isDark ? "☀" : "☾"}
        </span>
        <span style={{ fontSize: "0.85rem" }}>
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      </button>
    );
  }

  // Neutral variant that adapts to whatever surface it's placed on
  // (uses semantic theme tokens instead of sidebar-specific colors).
  if (variant === "block") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className="btn btn-sm d-flex align-items-center justify-content-center gap-2"
        style={{
          background: "transparent",
          border: "1.5px solid var(--border)",
          color: "var(--text-strong)",
          borderRadius: 10,
          padding: "0.45rem 0.9rem",
        }}
        suppressHydrationWarning
      >
        <span aria-hidden style={{ fontSize: "1rem" }}>
          {isDark ? "☀" : "☾"}
        </span>
        <span style={{ fontSize: "0.85rem" }}>
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="btn-icon"
      suppressHydrationWarning
    >
      <span aria-hidden style={{ fontSize: "1.1rem", lineHeight: 1 }}>
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
