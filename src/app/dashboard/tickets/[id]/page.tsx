import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TicketDetail from "@/components/TicketDetail";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true, studentId: true, department: true } },
      assignedTo: { select: { name: true, email: true, role: true } },
      notes: {
        include: { author: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      attachments: true,
    },
  });

  if (!ticket) {
    notFound();
  }

  // Fetch staff for assignment dropdown (only for non-students)
  let staff: { id: string; name: string; role: string }[] = [];
  if (session?.user?.role !== "STUDENT") {
    staff = await prisma.user.findMany({
      where: { role: { not: "STUDENT" } },
      select: { id: true, name: true, role: true },
    });
  }

  return (
    <TicketDetail
      ticket={JSON.parse(JSON.stringify(ticket))}
      currentUser={session?.user!}
      staff={staff}
    />
  );
}
