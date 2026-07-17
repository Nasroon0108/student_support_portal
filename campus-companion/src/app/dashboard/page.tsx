import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const isStudent = role === "STUDENT";

  const ticketWhere = isStudent
    ? { createdById: userId }
    : role === "ADMIN"
    ? {}
    : { assignedToId: userId };

  const [totalTickets, openTickets, resolvedTickets, appointments, unreadNotifications] =
    await Promise.all([
      prisma.ticket.count({ where: ticketWhere }),
      prisma.ticket.count({ where: { ...ticketWhere, status: "OPEN" } }),
      prisma.ticket.count({ where: { ...ticketWhere, status: "RESOLVED" } }),
      prisma.appointment.count({
        where: isStudent
          ? { studentId: userId, status: "PENDING" }
          : { staffId: userId, status: "PENDING" },
      }),
      prisma.notification.count({ where: { userId: userId!, isRead: false } }),
    ]);

  const recentTickets = await prisma.ticket.findMany({
    where: ticketWhere,
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {session?.user?.name} 👋</h1>
        <p className="text-muted">Here&apos;s an overview of your campus activity</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card stat-card p-3" style={{ borderLeftColor: "var(--primary)" }}>
            <small className="text-muted">Total Tickets</small>
            <h3 className="fw-bold mb-0">{totalTickets}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-3" style={{ borderLeftColor: "var(--warning)" }}>
            <small className="text-muted">Open</small>
            <h3 className="fw-bold mb-0">{openTickets}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-3" style={{ borderLeftColor: "var(--success)" }}>
            <small className="text-muted">Resolved</small>
            <h3 className="fw-bold mb-0">{resolvedTickets}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-3" style={{ borderLeftColor: "var(--secondary)" }}>
            <small className="text-muted">Pending Appointments</small>
            <h3 className="fw-bold mb-0">{appointments}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Tickets</h5>
              <Link href="/dashboard/tickets" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            {recentTickets.length === 0 ? (
              <p className="text-muted mb-0">No tickets yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <Link
                            href={`/dashboard/tickets/${ticket.id}`}
                            className="text-decoration-none"
                          >
                            {ticket.title}
                          </Link>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {ticket.category.replace("_", " ")}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge badge-status ${
                              ticket.status === "OPEN"
                                ? "bg-warning"
                                : ticket.status === "IN_PROGRESS"
                                ? "bg-info"
                                : ticket.status === "RESOLVED"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {ticket.status.replace("_", " ")}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge badge-status ${
                              ticket.priority === "URGENT"
                                ? "bg-danger"
                                : ticket.priority === "HIGH"
                                ? "bg-warning"
                                : ticket.priority === "MEDIUM"
                                ? "bg-info"
                                : "bg-secondary"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 mb-3">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              {isStudent && (
                <Link href="/dashboard/tickets/new" className="btn btn-primary">
                  📝 Report an Issue
                </Link>
              )}
              <Link href="/dashboard/appointments" className="btn btn-outline-primary">
                📅 View Appointments
              </Link>
              <Link href="/dashboard/announcements" className="btn btn-outline-secondary">
                📢 Announcements
              </Link>
            </div>
          </div>

          <div className="card p-4">
            <h5 className="fw-bold mb-3">🔔 Notifications</h5>
            <p className="mb-0">
              You have <strong>{unreadNotifications}</strong> unread notification
              {unreadNotifications !== 1 ? "s" : ""}.
            </p>
            <Link
              href="/dashboard/notifications"
              className="btn btn-sm btn-link p-0 mt-2"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
