import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AppointmentsClient from "@/components/AppointmentsClient";

export default async function AppointmentsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const isStudent = role === "STUDENT";
  const isAdmin = role === "ADMIN";

  const where = isStudent
    ? { studentId: userId }
    : isAdmin
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

  // Staff list for the booking form (students and admin can book)
  let staffList: { id: string; name: string; role: string }[] = [];
  if (isStudent || isAdmin) {
    staffList = await prisma.user.findMany({
      where: { role: { not: "STUDENT" } },
      select: { id: true, name: true, role: true },
    });
  }

  // Student list for admin to book on behalf of students
  let studentList: { id: string; name: string; email: string }[] = [];
  if (isAdmin) {
    studentList = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true },
    });
  }

  return (
    <AppointmentsClient
      appointments={JSON.parse(JSON.stringify(appointments))}
      isStudent={isStudent}
      isAdmin={isAdmin}
      staffList={staffList}
      studentList={studentList}
    />
  );
}
