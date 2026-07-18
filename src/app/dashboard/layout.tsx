import Sidebar from "@/components/Sidebar";
import DashboardTopbar from "@/components/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", alignItems: "stretch" }}>
      <Sidebar />
      <main className="dashboard-main">
        <DashboardTopbar />
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
