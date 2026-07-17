import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: body.status },
    });

    // Notify student of status change
    await prisma.notification.create({
      data: {
        title: "Appointment Updated",
        message: `Your appointment "${appointment.title}" has been ${body.status.toLowerCase()}.`,
        userId: appointment.studentId,
        link: `/dashboard/appointments`,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
