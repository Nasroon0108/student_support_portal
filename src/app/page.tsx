export default function HomePage() {
  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-3">
                Campus Companion
              </h1>
              <p className="lead mb-4">
                Student Support, Campus Safety &amp; Welfare Management System
              </p>
              <p className="mb-4">
                A comprehensive platform designed to support student welfare,
                enhance campus safety, and streamline support services for
                educational institutions.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <a href="/auth/login" className="btn btn-light btn-lg">
                  Sign In
                </a>
                <a href="/auth/register" className="btn btn-outline-light btn-lg">
                  Register
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Key Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="fs-1 mb-3">🛡️</div>
                  <h5 className="card-title">Campus Safety</h5>
                  <p className="card-text text-muted">
                    Report incidents, access emergency resources, and stay
                    informed about campus safety updates in real-time.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="fs-1 mb-3">🤝</div>
                  <h5 className="card-title">Student Support</h5>
                  <p className="card-text text-muted">
                    Access counseling services, academic support, and wellness
                    resources all in one place.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="fs-1 mb-3">🤖</div>
                  <h5 className="card-title">AI Assistant</h5>
                  <p className="card-text text-muted">
                    Get instant answers to your questions with our AI-powered
                    campus companion chatbot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Campus Companion. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
