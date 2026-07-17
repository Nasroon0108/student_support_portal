import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default async function AnalyticsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    totalUsers,
    totalAppointments,
    ticketsByCategory,
    ticketsByPriority,
    recentTickets,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { status: "RESOLVED" } }),
    prisma.user.count(),
    prisma.appointment.count(),
    prisma.ticket.groupBy({ by: ["category"], _count: { id: true } }),
    prisma.ticket.groupBy({ by: ["priority"], _count: { id: true } }),
    prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { createdAt: true, status: true },
    }),
  ]);

  const stats = {
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    totalUsers,
    totalAppointments,
    ticketsByCategory: ticketsByCategory.map((t) => ({
      category: t.category,
      count: t._count.id,
    })),
    ticketsByPriority: ticketsByPriority.map((t) => ({
      priority: t.priority,
      count: t._count.id,
    })),
  };

  return <AnalyticsCharts stats={stats} />;
}
