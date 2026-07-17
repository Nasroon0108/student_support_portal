import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AppointmentsClient from "@/components/AppointmentsClient";

export default async function AppointmentsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const isStudent = role === "STUDENT";

  const where = isStudent
    ? { studentId: userId }
    : role === "ADMIN"
    ? {}
    : { staffId: userId };

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      student: { select: { name: true, email: true, studentId: true } },
      staff: { select: { name: true, role: true } },
    },
  });

  // Get staff list for booking form
  let staffList: { id: string; name: string; role: string }[] = [];
  if (isStudent) {
    staffList = await prisma.user.findMany({
      where: { role: { not: "STUDENT" } },
      select: { id: true, name: true, role: true },
    });
  }

  return (
    <AppointmentsClient
      appointments={JSON.parse(JSON.stringify(appointments))}
      isStudent={isStudent}
      staffList={staffList}
    />
  );
}
