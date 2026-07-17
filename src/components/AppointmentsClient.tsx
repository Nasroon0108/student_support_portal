"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  title: string;
  reason: string;
  date: string;
  time: string;
  status: string;
  student: { name: string; email: string; studentId: string | null };
  staff: { name: string; role: string };
}

interface Props {
  appointments: Appointment[];
  isStudent: boolean;
  staffList: { id: string; name: string; role: string }[];
}

export default function AppointmentsClient({ appointments, isStudent, staffList }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleBook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        reason: formData.get("reason"),
        date: formData.get("date"),
        time: formData.get("time"),
        staffId: formData.get("staffId"),
      }),
    });

    setLoading(false);
    setShowForm(false);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <div>
          <h1>📅 Appointments</h1>
          <p className="text-muted mb-0">
            {isStudent ? "Book and manage your appointments" : "View and manage appointment requests"}
          </p>
        </div>
        {isStudent && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Book Appointment"}
          </button>
        )}
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="card p-4 mb-4">
          <h5 className="fw-bold mb-3">Book New Appointment</h5>
          <form onSubmit={handleBook}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">With</label>
                <select className="form-select" name="staffId" required>
                  <option value="">Select Staff Member</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role.replace(/_/g, " ")})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" name="date" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Time</label>
                <input type="time" className="form-control" name="time" required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Reason</label>
              <textarea className="form-control" name="reason" rows={3} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="card p-5 text-center">
          <div className="fs-1 mb-3">📅</div>
          <h5>No appointments</h5>
          <p className="text-muted">
            {isStudent ? "You haven't booked any appointments yet." : "No appointment requests."}
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>{isStudent ? "With" : "Student"}</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  {!isStudent && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="fw-medium">{apt.title}</td>
                    <td>{isStudent ? apt.staff.name : apt.student.name}</td>
                    <td>{new Date(apt.date).toLocaleDateString()}</td>
                    <td>{apt.time}</td>
                    <td>
                      <span
                        className={`badge ${
                          apt.status === "PENDING"
                            ? "bg-warning text-dark"
                            : apt.status === "CONFIRMED"
                            ? "bg-success"
                            : apt.status === "CANCELLED"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    {!isStudent && (
                      <td>
                        {apt.status === "PENDING" && (
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusChange(apt.id, "CONFIRMED")}
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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
