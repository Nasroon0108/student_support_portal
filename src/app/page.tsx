import Link from "next/link";

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-cream">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <Link
            href="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <span className="brand-mark" style={{ width: 42, height: 42, fontSize: "1rem" }}>
              CC
            </span>
            <span className="font-serif fs-4 fw-bold" style={{ color: "var(--navy)" }}>
              Campus Companion
            </span>
          </Link>
          <div className="d-flex gap-2">
            <Link href="/login" className="btn btn-outline-navy btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-navy btn-sm">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero flex-grow-1">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="auth-tagline">
                Student Support · Campus Safety · Welfare
              </span>
              <h1>Your Campus, Your Companion</h1>
              <p className="lead mb-4">
                A unified platform for student support, campus safety, and
                welfare management. Report issues, book appointments, access
                counseling, and stay informed — all in one place.
              </p>
              <div className="d-flex gap-3">
                <Link href="/register" className="btn btn-navy px-4">
                  Get Started
                </Link>
                <Link href="/login" className="btn btn-outline-navy px-4">
                  Sign In
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="feature-tile">
                    <div className="icon">📚</div>
                    <h6 className="fw-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Academic Support
                    </h6>
                    <small className="text-muted">Resources and help to excel.</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="feature-tile">
                    <div className="icon">🛡️</div>
                    <h6 className="fw-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Campus Safety
                    </h6>
                    <small className="text-muted">Report, respond, stay safe.</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="feature-tile">
                    <div className="icon">💬</div>
                    <h6 className="fw-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Counseling
                    </h6>
                    <small className="text-muted">Confidential well-being support.</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="feature-tile">
                    <div className="icon">📅</div>
                    <h6 className="fw-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Appointments
                    </h6>
                    <small className="text-muted">Book time with staff easily.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5" style={{ backgroundColor: "var(--cream-soft)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">How It Works</h2>
            <p className="text-muted">Three simple steps to get the support you need.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card p-4 h-100 text-center card-clean">
                <div style={{ fontSize: "2rem" }} className="mb-2">📝</div>
                <h5 className="fw-bold">Report an Issue</h5>
                <p className="text-muted mb-0">
                  Submit tickets for academic issues, safety concerns,
                  maintenance requests, or counseling needs.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 h-100 text-center card-clean">
                <div style={{ fontSize: "2rem" }} className="mb-2">👥</div>
                <h5 className="fw-bold">Get Assigned Help</h5>
                <p className="text-muted mb-0">
                  Your ticket is routed to the right staff — counselors,
                  advisors, marshals, or maintenance.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 h-100 text-center card-clean">
                <div style={{ fontSize: "2rem" }} className="mb-2">✅</div>
                <h5 className="fw-bold">Track & Resolve</h5>
                <p className="text-muted mb-0">
                  Follow your case, receive notifications, and communicate
                  until it&apos;s resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "var(--navy)", color: "var(--cream-soft)" }} className="py-4">
        <div className="container text-center">
          <p className="mb-0" style={{ opacity: 0.75 }}>
            © 2026 Campus Companion · Student welfare and campus safety.
          </p>
        </div>
      </footer>
    </div>
  );
}
