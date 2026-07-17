"use client";

import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  studentId: string | null;
  createdAt: string;
}

export default function UsersClient({ users }: { users: User[] }) {
  const router = useRouter();

  async function handleRoleChange(userId: string, role: string) {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="page-header">
        <h1>👥 User Management</h1>
        <p className="text-muted">Manage all registered users and their roles</p>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Student ID</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium">{user.name}</td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <span className="badge bg-primary">{user.role.replace(/_/g, " ")}</span>
                  </td>
                  <td>{user.department || "—"}</td>
                  <td>{user.studentId || "—"}</td>
                  <td className="text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "160px" }}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="ACADEMIC_STAFF">Academic Staff</option>
                      <option value="COUNSELOR">Counselor</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="CAMPUS_MARSHAL">Campus Marshal</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
