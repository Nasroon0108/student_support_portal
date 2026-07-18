"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        priority: formData.get("priority"),
        isAnonymous: formData.get("isAnonymous") === "on",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create ticket");
    } else {
      router.push("/dashboard/tickets");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>📝 Report an Issue</h1>
        <p className="text-muted">
          Submit a new ticket for academic support, campus issues, safety concerns, or counseling.
        </p>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card p-4">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select className="form-select" id="category" name="category" required>
                    <option value="">Select Category</option>
                    <option value="ACADEMIC_SUPPORT">Academic Support</option>
                    <option value="COUNSELING">Counseling</option>
                    <option value="CAMPUS_ISSUE">Campus Issue</option>
                    <option value="CAMPUS_SAFETY">Campus Safety</option>
                    <option value="RAGGING">Ragging / Bullying</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="priority" className="form-label">
                    Priority *
                  </label>
                  <select className="form-select" id="priority" name="priority" required defaultValue="MEDIUM">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">
                      Medium
                    </option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows={6}
                  required
                  placeholder="Provide detailed information about your issue. Include relevant dates, locations, people involved, and any other context that can help resolve this."
                />
              </div>

              <div className="mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                  />
                  <label className="form-check-label" htmlFor="isAnonymous">
                    Submit anonymously
                  </label>
                  <small className="d-block text-muted">
                    Your identity will be hidden from staff handling this ticket.
                  </small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : null}
                  Submit Ticket
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => router.back()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4">
            <h6 className="fw-bold mb-3">💡 Tips for a Good Report</h6>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2">✓ Be specific about the issue</li>
              <li className="mb-2">✓ Include dates and locations</li>
              <li className="mb-2">✓ Mention people involved (if applicable)</li>
              <li className="mb-2">✓ Set the right priority level</li>
              <li className="mb-2">✓ Choose the correct category for faster routing</li>
            </ul>
          </div>

          <div className="card p-4 mt-3">
            <h6 className="fw-bold mb-3">🚨 Emergency?</h6>
            <p className="text-muted small">
              If you are in immediate danger, please contact campus security
              directly or call emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
