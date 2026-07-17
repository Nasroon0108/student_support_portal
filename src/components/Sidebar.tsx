"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/tickets", label: "My Tickets", icon: "🎫" },
  { href: "/dashboard/tickets/new", label: "New Ticket", icon: "➕" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "📅" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "📢" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
];

const staffLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/tickets", label: "Assigned Tickets", icon: "🎫" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "📅" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "📢" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
];

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/tickets", label: "All Tickets", icon: "🎫" },
  { href: "/dashboard/users", label: "Users", icon: "👥" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "📅" },
  { href: "/dashboard/announcements", label: "Announcements", icon: "📢" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
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

  return (
    <div className="sidebar d-flex flex-column p-3" style={{ width: "260px" }}>
      <div className="mb-4 px-2">
        <h5 className="text-white fw-bold mb-0">🎓 Campus Companion</h5>
        <small className="text-secondary">Student Support Portal</small>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link d-flex align-items-center gap-2 ${
              pathname === link.href ? "active" : ""
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-top border-secondary pt-3 mt-3">
        <div className="px-3 mb-2">
          <small className="text-white d-block">{session?.user?.name}</small>
          <small className="text-secondary">{role}</small>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn btn-outline-danger btn-sm w-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
