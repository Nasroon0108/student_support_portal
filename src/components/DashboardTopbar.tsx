"use client";

import { useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function DashboardTopbar() {
  const { data: session } = useSession();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <header className="dashboard-topbar">
      <div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {greeting}
        </div>
        <div
          className="font-serif"
          style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-strong)" }}
        >
          {session?.user?.name ?? "Welcome"}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
