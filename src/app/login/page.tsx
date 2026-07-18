"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="auth-shell" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 20, right: 24, zIndex: 10 }}>
        <ThemeToggle />
      </div>

      {/* Hero side */}
      <aside className="auth-hero d-none d-lg-flex">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="brand-mark">CC</span>
          </div>
        </div>

        <div className="auth-hero-inner">
          <h1 className="auth-title">
            Campus
            <br />
            Companion
          </h1>
          <span className="auth-tagline">
            Student Support · Campus Safety · Welfare
          </span>
          <p className="auth-subtitle">
            Your trusted partner for a safe, supportive and thriving campus life.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div style={{ fontSize: "1.5rem" }}>📖</div>
              <h6>Academic Support</h6>
              <p>Resources and help to excel.</p>
            </div>
            <div className="auth-feature">
              <div style={{ fontSize: "1.5rem" }}>🤝</div>
              <h6>Counseling</h6>
              <p>Confidential support for your well-being.</p>
            </div>
            <div className="auth-feature">
              <div style={{ fontSize: "1.5rem" }}>🛡️</div>
              <h6>Safety &amp; Anti-Ragging</h6>
              <p>Report, respond and stay safe together.</p>
            </div>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </aside>

      {/* Form side */}
      <main className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-tabs">
            <button type="button" className="auth-tab active">
              Sign in
            </button>
            <Link href="/register" className="auth-tab" style={{ textDecoration: "none" }}>
              Create account
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                University Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                placeholder="name@university.edu"
                autoComplete="email"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-1"
                  style={{
                    color: "var(--muted)",
                    padding: "0.25rem 0.5rem",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                  }}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="remember"
                  style={{ fontSize: "0.9rem" }}
                >
                  Remember me
                </label>
              </div>
              <a href="#" style={{ fontSize: "0.9rem" }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-navy w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="divider-text">or continue with</div>

          <div className="row g-2 mb-4">
            <div className="col">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                disabled
                title="Coming soon"
              >
                Google
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                disabled
                title="Coming soon"
              >
                University SSO
              </button>
            </div>
          </div>

          <div className="text-center">
            <small className="text-muted">
              New student?{" "}
              <Link href="/register">Create an account</Link>
            </small>
          </div>
        </div>
      </main>
    </div>
  );
}
