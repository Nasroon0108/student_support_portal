"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  studentId: string | null;
  role: string;
  image: string | null;
  createdAt: string;
}

export default function ProfileSettingsClient({ user }: { user: UserProfile }) {
  const router = useRouter();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [department, setDepartment] = useState(user.department ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.image);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const roleLabel = user.role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarMsg(null);
    setUploadingAvatar(true);

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadingAvatar(false);

    if (!res.ok) {
      setAvatarMsg({ type: "error", text: data.error || "Upload failed" });
    } else {
      setAvatarUrl(data.image);
      setAvatarMsg({ type: "success", text: "Photo updated!" });
      router.refresh();
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleRemoveAvatar() {
    setAvatarMsg(null);
    setUploadingAvatar(true);

    const res = await fetch("/api/profile/avatar", { method: "DELETE" });
    setUploadingAvatar(false);

    if (res.ok) {
      setAvatarUrl(null);
      setAvatarMsg({ type: "success", text: "Photo removed" });
      router.refresh();
    } else {
      setAvatarMsg({ type: "error", text: "Failed to remove photo" });
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, department }),
    });

    const data = await res.json();
    setSavingProfile(false);

    if (!res.ok) {
      setProfileMsg({ type: "error", text: data.error || "Something went wrong" });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
      await update({ name });
      router.refresh();
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" });
      return;
    }

    setSavingPassword(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setSavingPassword(false);

    if (!res.ok) {
      setPasswordMsg({ type: "error", text: data.error || "Something went wrong" });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p className="text-muted mb-0">
          Manage your account information, security, and preferences
        </p>
      </div>

      <div className="row g-4">
        {/* Left: identity card */}
        <div className="col-md-4">
          <div className="card p-4 text-center">
            {/* Avatar with upload */}
            <div className="position-relative mx-auto mb-3" style={{ width: 100, height: 100 }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="rounded-circle"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    border: "3px solid var(--border)",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center font-serif fw-bold rounded-circle"
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "var(--brand)",
                    color: "var(--brand-ink)",
                    fontSize: "2rem",
                    border: "3px solid var(--border)",
                  }}
                >
                  {initials}
                </div>
              )}

              {/* Camera overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "2px solid var(--bg-soft)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
                title="Upload photo"
                aria-label="Upload profile photo"
              >
                {uploadingAvatar ? (
                  <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />
                ) : (
                  "📷"
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />
            </div>

            {avatarMsg && (
              <small className={`d-block mb-2 ${avatarMsg.type === "success" ? "text-success" : "text-danger"}`}>
                {avatarMsg.text}
              </small>
            )}

            {avatarUrl && (
              <button
                type="button"
                className="btn btn-link btn-sm text-danger mb-2 p-0"
                onClick={handleRemoveAvatar}
                disabled={uploadingAvatar}
                style={{ fontSize: "0.8rem" }}
              >
                Remove photo
              </button>
            )}

            <h5 className="fw-bold mb-0">{user.name}</h5>
            <small className="text-muted d-block mb-2">{user.email}</small>
            <span className="badge bg-primary d-inline-block mb-3">{roleLabel}</span>

            <dl className="text-start mb-0" style={{ fontSize: "0.85rem" }}>
              {user.studentId && (
                <>
                  <dt className="text-muted">Student ID</dt>
                  <dd>{user.studentId}</dd>
                </>
              )}
              {user.department && (
                <>
                  <dt className="text-muted">Department</dt>
                  <dd>{user.department}</dd>
                </>
              )}
              <dt className="text-muted">Member since</dt>
              <dd className="mb-0">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </dd>
            </dl>
          </div>

          <div className="card p-4 mt-3">
            <h6 className="fw-bold mb-3">Appearance</h6>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                Theme
              </span>
              <ThemeToggle variant="block" />
            </div>
          </div>
        </div>

        {/* Right: forms */}
        <div className="col-md-8">
          <div className="card p-4 mb-4">
            <h6 className="fw-bold mb-3">Personal Information</h6>

            {profileMsg && (
              <div className={`alert alert-${profileMsg.type === "success" ? "success" : "danger"}`}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-navy" disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>

          <div className="card p-4">
            <h6 className="fw-bold mb-3">Change Password</h6>

            {passwordMsg && (
              <div className={`alert alert-${passwordMsg.type === "success" ? "success" : "danger"}`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-outline-navy" disabled={savingPassword}>
                {savingPassword ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
