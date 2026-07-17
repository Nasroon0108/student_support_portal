"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  author: { name: string; role: string };
}

interface Props {
  announcements: Announcement[];
  isStaff: boolean;
}

export default function AnnouncementsClient({ announcements, isStaff }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
        type: formData.get("type"),
      }),
    });

    setLoading(false);
    setShowForm(false);
    router.refresh();
  }

  const typeIcon: Record<string, string> = {
    GENERAL: "📋",
    ACADEMIC: "📚",
    SAFETY: "🛡️",
    EVENT: "🎉",
    EMERGENCY: "🚨",
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <div>
          <h1>📢 Announcements</h1>
          <p className="text-muted mb-0">Stay informed about campus updates</p>
        </div>
        {isStaff && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Announcement"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-4 mb-4">
          <h5 className="fw-bold mb-3">Create Announcement</h5>
          <form onSubmit={handleCreate}>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Type</label>
                <select className="form-select" name="type" required>
                  <option value="GENERAL">General</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="SAFETY">Safety</option>
                  <option value="EVENT">Event</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea className="form-control" name="content" rows={4} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Posting..." : "Post Announcement"}
            </button>
          </form>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="card p-5 text-center">
          <div className="fs-1 mb-3">📢</div>
          <h5>No announcements</h5>
          <p className="text-muted">Check back later for updates.</p>
        </div>
      ) : (
        <div className="row g-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="col-12">
              <div className="card p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold mb-1">
                      {typeIcon[ann.type] || "📋"} {ann.title}
                    </h5>
                    <p className="mb-2">{ann.content}</p>
                    <small className="text-muted">
                      By {ann.author.name} • {new Date(ann.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <span
                    className={`badge ${
                      ann.type === "EMERGENCY"
                        ? "bg-danger"
                        : ann.type === "SAFETY"
                        ? "bg-warning text-dark"
                        : ann.type === "ACADEMIC"
                        ? "bg-info"
                        : "bg-secondary"
                    }`}
                  >
                    {ann.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
