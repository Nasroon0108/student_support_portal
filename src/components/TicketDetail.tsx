"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TicketNote {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  author: { name: string; role: string };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string; email: string; studentId: string | null; department: string | null };
  assignedTo: { name: string; email: string; role: string } | null;
  assignedToId: string | null;
  notes: TicketNote[];
}

interface Props {
  ticket: Ticket;
  currentUser: { id: string; role: string; name?: string | null };
  staff: { id: string; name: string; role: string }[];
}

export default function TicketDetail({ ticket, currentUser, staff }: Props) {
  const router = useRouter();
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(false);
  const isStaff = currentUser.role !== "STUDENT";

  // Local state for the actions panel (staff only)
  const [editStatus, setEditStatus] = useState(ticket.status);
  const [editPriority, setEditPriority] = useState(ticket.priority);
  const [editAssignee, setEditAssignee] = useState(ticket.assignedToId || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    editStatus !== ticket.status ||
    editPriority !== ticket.priority ||
    editAssignee !== (ticket.assignedToId || "");

  async function handleSaveActions() {
    setSaving(true);
    setSaved(false);

    const payload: Record<string, string> = {};
    if (editStatus !== ticket.status) payload.status = editStatus;
    if (editPriority !== ticket.priority) payload.priority = editPriority;
    if (editAssignee !== (ticket.assignedToId || "")) payload.assignedToId = editAssignee;

    await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function handleStatusChange(status: string) {
    await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setLoading(true);

    await fetch(`/api/tickets/${ticket.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent }),
    });

    setNoteContent("");
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start page-header">
        <div>
          <h1>{ticket.title}</h1>
          <div className="d-flex gap-2 align-items-center">
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
            <span className="badge bg-light text-dark">
              {ticket.category.replace(/_/g, " ")}
            </span>
            <span
              className={`badge ${
                ticket.priority === "URGENT"
                  ? "bg-danger"
                  : ticket.priority === "HIGH"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
              }`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => router.back()}
        >
          ← Back
        </button>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-md-8">
          <div className="card p-4 mb-4">
            <h6 className="fw-bold mb-3">Description</h6>
            <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {ticket.description}
            </p>
          </div>

          {/* Notes / Conversation */}
          <div className="card p-4">
            <h6 className="fw-bold mb-3">Notes & Updates</h6>

            {ticket.notes.length === 0 ? (
              <p className="text-muted">No notes yet.</p>
            ) : (
              <div className="mb-4">
                {ticket.notes.map((note) => (
                  <div key={note.id} className="border-start border-3 ps-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="small">
                        {note.author.name}{" "}
                        <span className="badge bg-light text-dark ms-1">
                          {note.author.role}
                        </span>
                      </strong>
                      <small className="text-muted">
                        {new Date(note.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <p className="mb-0 small">{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote}>
              <textarea
                className="form-control mb-2"
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a note or reply..."
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                {loading ? "Sending..." : "Add Note"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          <div className="card p-4 mb-3">
            <h6 className="fw-bold mb-3">Details</h6>
            <dl className="mb-0">
              <dt className="small text-muted">Submitted by</dt>
              <dd>{ticket.isAnonymous ? "Anonymous" : ticket.createdBy.name}</dd>

              {!ticket.isAnonymous && ticket.createdBy.department && (
                <>
                  <dt className="small text-muted">Department</dt>
                  <dd>{ticket.createdBy.department}</dd>
                </>
              )}

              <dt className="small text-muted">Assigned to</dt>
              <dd>{ticket.assignedTo?.name || "Unassigned"}</dd>

              <dt className="small text-muted">Created</dt>
              <dd>{new Date(ticket.createdAt).toLocaleString()}</dd>

              <dt className="small text-muted">Last Updated</dt>
              <dd>{new Date(ticket.updatedAt).toLocaleString()}</dd>
            </dl>
          </div>

          {/* Staff Actions */}
          {isStaff && (
            <div className="card p-4">
              <h6 className="fw-bold mb-3">Actions</h6>

              <div className="mb-3">
                <label className="form-label small">Update Status</label>
                <select
                  className="form-select form-select-sm"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ESCALATED">Escalated</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small">Update Priority</label>
                <select
                  className="form-select form-select-sm"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small">Assign to</label>
                <select
                  className="form-select form-select-sm"
                  value={editAssignee}
                  onChange={(e) => setEditAssignee(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role.replace(/_/g, " ")})
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-navy btn-sm w-100"
                onClick={handleSaveActions}
                disabled={!hasChanges || saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : saved ? (
                  "✓ Saved"
                ) : (
                  "Save Changes"
                )}
              </button>
              {!hasChanges && !saved && (
                <small className="text-muted d-block text-center mt-2">
                  No changes to save
                </small>
              )}
            </div>
          )}

          {/* Student can close their own ticket */}
          {!isStaff && ticket.status !== "CLOSED" && (
            <div className="card p-4">
              <h6 className="fw-bold mb-3">Actions</h6>
              <p className="text-muted small mb-3">
                If your issue has been resolved, you can close this ticket.
              </p>
              <button
                className="btn btn-outline-navy btn-sm w-100"
                onClick={() => handleStatusChange("CLOSED")}
              >
                ✓ Close Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
