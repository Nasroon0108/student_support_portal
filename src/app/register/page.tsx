"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        studentId: formData.get("studentId"),
        department: formData.get("department"),
        phone: formData.get("phone"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="auth-shell">
      {/* Hero side */}
      <aside className="auth-hero d-none d-lg-flex">
        <div>
          <span className="brand-mark">CC</span>
        </div>

        <div className="auth-hero-inner">
          <h1 className="auth-title">
            Join
            <br />
            Campus Companion
          </h1>
          <span className="auth-tagline">
            Student Support · Campus Safety · Welfare
          </span>
          <p className="auth-subtitle">
            One account gives you access to counseling, academic help, safety
            reporting, and campus appointments.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div style={{ fontSize: "1.5rem" }}>🎓</div>
              <h6>For Students</h6>
              <p>Get help, report issues, book appointments.</p>
            </div>
            <div className="auth-feature">
              <div style={{ fontSize: "1.5rem" }}>🔒</div>
              <h6>Private &amp; Secure</h6>
              <p>Anonymous reporting when you need it.</p>
            </div>
            <div className="auth-feature">
              <div style={{ fontSize: "1.5rem" }}>⚡</div>
              <h6>Fast Support</h6>
              <p>Routed automatically to the right team.</p>
            </div>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </aside>

      {/* Form side */}
      <main className="auth-panel">
        <div className="auth-panel-inner" style={{ maxWidth: 480 }}>
          <div className="auth-tabs">
            <Link href="/login" className="auth-tab" style={{ textDecoration: "none" }}>
              Sign in
            </Link>
            <button type="button" className="auth-tab active">
              Create account
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                  placeholder="Jane Doe"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="studentId" className="form-label">
                  Student ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="studentId"
                  name="studentId"
                  placeholder="STU-2024-001"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                University Email *
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                placeholder="name@university.edu"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <select className="form-select" id="department" name="department">
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                  <option value="Law">Law</option>
                  <option value="Medicine">Medicine</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              className="btn btn-navy w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <small className="text-muted">
              Already have an account? <Link href="/login">Sign in</Link>
            </small>
          </div>
        </div>
      </main>
    </div>
  );
}
