import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true, email: true, studentId: true, department: true } },
        assignedTo: { select: { name: true, email: true, role: true } },
        notes: {
          include: { author: { select: { name: true, role: true } } },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Fetch ticket error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

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

    // Only staff/admin can update tickets (except students can close their own)
    if (session.user.role === "STUDENT") {
      // Students can only mark their own ticket as CLOSED
      if (body.status === "CLOSED") {
        const existingTicket = await prisma.ticket.findUnique({
          where: { id },
          select: { createdById: true },
        });
        if (!existingTicket || existingTicket.createdById !== session.user.id) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const ticket = await prisma.ticket.update({
          where: { id },
          data: { status: "CLOSED" },
        });
        return NextResponse.json(ticket);
      }
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: body.status,
        priority: body.priority,
        assignedToId: body.assignedToId,
      },
    });

    // Notify the ticket creator on status change
    if (body.status) {
      await prisma.notification.create({
        data: {
          title: "Ticket Updated",
          message: `Your ticket "${ticket.title}" status changed to ${body.status.replace(/_/g, " ")}.`,
          userId: ticket.createdById,
          link: `/dashboard/tickets/${ticket.id}`,
        },
      });
    }

    // Notify the newly assigned staff member
    if (body.assignedToId && body.assignedToId !== session.user.id) {
      await prisma.notification.create({
        data: {
          title: "Ticket Assigned to You",
          message: `You have been assigned ticket "${ticket.title}".`,
          userId: body.assignedToId,
          link: `/dashboard/tickets/${ticket.id}`,
        },
      });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
