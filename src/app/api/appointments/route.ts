import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const appointmentSchema = z.object({
  title: z.string().min(3),
  reason: z.string().min(5),
  date: z.string(),
  time: z.string(),
  staffId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = appointmentSchema.parse(body);

    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        reason: data.reason,
        date: new Date(data.date),
        time: data.time,
        studentId: session.user.id,
        staffId: data.staffId,
      },
    });

    // Notify the staff member
    await prisma.notification.create({
      data: {
        title: "New Appointment Request",
        message: `${session.user.name} has requested an appointment: "${data.title}"`,
        userId: data.staffId,
        link: `/dashboard/appointments`,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    const userId = session.user.id;

    const where =
      role === "STUDENT"
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

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
