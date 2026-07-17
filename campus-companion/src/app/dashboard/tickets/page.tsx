import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TicketsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const isStudent = role === "STUDENT";

  const ticketWhere = isStudent
    ? { createdById: userId }
    : role === "ADMIN"
    ? {}
    : { assignedToId: userId };

  const tickets = await prisma.ticket.findMany({
    where: ticketWhere,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { name: true, studentId: true } },
      assignedTo: { select: { name: true, role: true } },
    },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <div>
          <h1>{isStudent ? "My Tickets" : "Assigned Tickets"}</h1>
          <p className="text-muted mb-0">
            {isStudent
              ? "Track all your submitted issues and requests"
              : "Manage tickets assigned to you"}
          </p>
        </div>
        {isStudent && (
          <Link href="/dashboard/tickets/new" className="btn btn-primary">
            + New Ticket
          </Link>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="card p-5 text-center">
          <div className="fs-1 mb-3">🎫</div>
          <h5>No tickets found</h5>
          <p className="text-muted">
            {isStudent
              ? "You haven't submitted any tickets yet."
              : "No tickets have been assigned to you."}
          </p>
          {isStudent && (
            <Link href="/dashboard/tickets/new" className="btn btn-primary">
              Submit Your First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  {!isStudent && <th>Submitted By</th>}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="text-decoration-none fw-medium"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {ticket.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ticket.priority === "URGENT"
                            ? "bg-danger"
                            : ticket.priority === "HIGH"
                            ? "bg-warning text-dark"
                            : ticket.priority === "MEDIUM"
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ticket.status === "OPEN"
                            ? "bg-warning text-dark"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-info"
                            : ticket.status === "RESOLVED"
                            ? "bg-success"
                            : ticket.status === "ESCALATED"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    {!isStudent && (
                      <td className="text-muted">
                        {ticket.isAnonymous ? "Anonymous" : ticket.createdBy.name}
                      </td>
                    )}
                    <td className="text-muted">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
