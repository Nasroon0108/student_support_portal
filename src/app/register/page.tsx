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
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <div className="text-center mb-4">
                <h2 className="fw-bold">🎓 Create Account</h2>
                <p className="text-muted">Join Campus Companion</p>
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
                      placeholder="John Doe"
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                    placeholder="you@university.edu"
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
                      Phone Number
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

                <div className="mb-3">
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
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : null}
                  Create Account
                </button>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary">
                    Sign in
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
