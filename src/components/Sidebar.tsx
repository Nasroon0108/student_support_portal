"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

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
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand d-flex align-items-center gap-2">
        <span className="sidebar-brand-mark">CC</span>
        <div>
          <div className="font-serif fw-bold" style={{ fontSize: "1.05rem" }}>
            Campus Companion
          </div>
          <small style={{ color: "var(--sidebar-text-muted)", fontSize: "0.75rem" }}>
            Student Portal
          </small>
        </div>
      </div>

      {/* Scrollable nav area */}
      <nav className="sidebar-nav">
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

      {/* Profile footer pinned to bottom */}
      <div className="sidebar-footer">
        <div className="px-3 mb-2">
          <div style={{ fontSize: "0.9rem", color: "var(--sidebar-text)", fontWeight: 500 }}>
            {session?.user?.name}
          </div>
          <small style={{ color: "var(--sidebar-text-muted)", fontSize: "0.75rem" }}>
            {roleLabel}
          </small>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn btn-outline-terracotta btn-sm w-100"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
