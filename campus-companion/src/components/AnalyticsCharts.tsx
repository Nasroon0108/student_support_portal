"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface Props {
  stats: {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    totalUsers: number;
    totalAppointments: number;
    ticketsByCategory: { category: string; count: number }[];
    ticketsByPriority: { priority: string; count: number }[];
  };
}

export default function AnalyticsCharts({ stats }: Props) {
  const categoryData = {
    labels: stats.ticketsByCategory.map((t) => t.category.replace(/_/g, " ")),
    datasets: [
      {
        label: "Tickets by Category",
        data: stats.ticketsByCategory.map((t) => t.count),
        backgroundColor: [
          "#4f46e5",
          "#0ea5e9",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#6b7280",
        ],
      },
    ],
  };

  const priorityData = {
    labels: stats.ticketsByPriority.map((t) => t.priority),
    datasets: [
      {
        label: "Tickets by Priority",
        data: stats.ticketsByPriority.map((t) => t.count),
        backgroundColor: ["#6b7280", "#0ea5e9", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const statusData = {
    labels: ["Open", "In Progress", "Resolved"],
    datasets: [
      {
        data: [stats.openTickets, stats.inProgressTickets, stats.resolvedTickets],
        backgroundColor: ["#f59e0b", "#0ea5e9", "#10b981"],
      },
    ],
  };

  return (
    <div>
      <div className="page-header">
        <h1>📈 Analytics Dashboard</h1>
        <p className="text-muted">System-wide statistics and reports</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card p-3 text-center">
            <h3 className="fw-bold mb-0">{stats.totalTickets}</h3>
            <small className="text-muted">Total Tickets</small>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 text-center">
            <h3 className="fw-bold text-warning mb-0">{stats.openTickets}</h3>
            <small className="text-muted">Open</small>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 text-center">
            <h3 className="fw-bold text-info mb-0">{stats.inProgressTickets}</h3>
            <small className="text-muted">In Progress</small>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 text-center">
            <h3 className="fw-bold text-success mb-0">{stats.resolvedTickets}</h3>
            <small className="text-muted">Resolved</small>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 text-center">
            <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
            <small className="text-muted">Users</small>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 text-center">
            <h3 className="fw-bold mb-0">{stats.totalAppointments}</h3>
            <small className="text-muted">Appointments</small>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-4">
            <h6 className="fw-bold mb-3">Tickets by Category</h6>
            <Bar data={categoryData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4">
            <h6 className="fw-bold mb-3">By Status</h6>
            <Doughnut data={statusData} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4">
            <h6 className="fw-bold mb-3">By Priority</h6>
            <Doughnut data={priorityData} />
          </div>
        </div>
      </div>
    </div>
  );
}
