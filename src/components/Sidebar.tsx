"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/dashboard/tickets", label: "My Tickets", icon: "❑" },
  { href: "/dashboard/tickets/new", label: "New Ticket", icon: "+" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "◷" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "❋" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◉" },
];

const staffLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/dashboard/tickets", label: "Assigned Tickets", icon: "❑" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "◷" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "❋" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◉" },
];

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/dashboard/tickets", label: "All Tickets", icon: "❑" },
  { href: "/dashboard/users", label: "Users", icon: "◕" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "◷" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "❋" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "◭" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◉" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "STUDENT"
      ? studentLinks
      : staffLinks;

  const roleLabel = role
    ? role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <div className="sidebar d-flex flex-column p-3" style={{ width: "260px" }}>
      <div className="sidebar-brand d-flex align-items-center gap-2">
        <span className="sidebar-brand-mark">CC</span>
        <div>
          <div className="font-serif fw-bold" style={{ fontSize: "1.05rem" }}>
            Campus Companion
          </div>
          <small style={{ color: "rgba(246,239,227,0.6)", fontSize: "0.75rem" }}>
            Student Portal
          </small>
        </div>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link d-flex align-items-center gap-3 ${
              pathname === link.href ? "active" : ""
            }`}
          >
            <span style={{ fontSize: "1rem", width: 18, textAlign: "center" }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div
        className="pt-3 mt-3 d-flex flex-column gap-2"
        style={{ borderTop: "1px solid rgba(246,239,227,0.15)" }}
      >
        <div className="px-3">
          <div style={{ fontSize: "0.9rem", color: "var(--sidebar-text)" }}>
            {session?.user?.name}
          </div>
          <small style={{ color: "var(--sidebar-text-muted)", fontSize: "0.75rem" }}>
            {roleLabel}
          </small>
        </div>
        <ThemeToggle variant="sidebar" />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn btn-outline-terracotta btn-sm w-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
