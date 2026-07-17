import Link from "next/link";

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            🎓 Campus Companion
          </Link>
          <div className="d-flex gap-2">
            <Link href="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow-1 d-flex align-items-center bg-dark text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Your Campus, Your Companion
              </h1>
              <p className="lead mb-4 text-light opacity-75">
                A unified platform for student support, campus safety, and
                welfare management. Report issues, book appointments, access
                counseling, and stay informed — all in one place.
              </p>
              <div className="d-flex gap-3">
                <Link href="/register" className="btn btn-primary btn-lg px-4">
                  Get Started
                </Link>
                <Link href="/login" className="btn btn-outline-light btn-lg px-4">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="card bg-white bg-opacity-10 border-0 p-3 text-center">
                      <div className="fs-1">📚</div>
                      <small>Academic Support</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-white bg-opacity-10 border-0 p-3 text-center">
                      <div className="fs-1">🛡️</div>
                      <small>Campus Safety</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-white bg-opacity-10 border-0 p-3 text-center">
                      <div className="fs-1">💬</div>
                      <small>Counseling</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-white bg-opacity-10 border-0 p-3 text-center">
                      <div className="fs-1">📅</div>
                      <small>Appointments</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-4 text-center">
                <div className="fs-1 mb-3">📝</div>
                <h5 className="fw-bold">Report an Issue</h5>
                <p className="text-muted">
                  Submit tickets for academic issues, campus safety concerns,
                  maintenance requests, or counseling needs.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-4 text-center">
                <div className="fs-1 mb-3">👥</div>
                <h5 className="fw-bold">Get Assigned Help</h5>
                <p className="text-muted">
                  Your ticket is routed to the right staff — counselors, academic
                  advisors, marshals, or maintenance.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-4 text-center">
                <div className="fs-1 mb-3">✅</div>
                <h5 className="fw-bold">Track & Resolve</h5>
                <p className="text-muted">
                  Follow your case progress, receive notifications, and
                  communicate until it&apos;s resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0 opacity-75">
            © 2026 Campus Companion. Built for student welfare and campus safety.
          </p>
        </div>
      </footer>
    </div>
  );
}
