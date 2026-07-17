import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-4 overflow-auto">{children}</main>
    </div>
  );
}
