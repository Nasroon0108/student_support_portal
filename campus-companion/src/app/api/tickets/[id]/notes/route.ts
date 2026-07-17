import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
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

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const note = await prisma.ticketNote.create({
      data: {
        content: body.content,
        isPublic: body.isPublic ?? true,
        ticketId: id,
        authorId: session.user.id,
      },
      include: {
        author: { select: { name: true, role: true } },
      },
    });

    // Notify relevant parties
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { createdById: true, assignedToId: true, title: true },
    });

    if (ticket) {
      const notifyUserId =
        session.user.id === ticket.createdById
          ? ticket.assignedToId
          : ticket.createdById;

      if (notifyUserId) {
        await prisma.notification.create({
          data: {
            title: "New Note on Ticket",
            message: `A new note was added to ticket "${ticket.title}".`,
            userId: notifyUserId,
            link: `/dashboard/tickets/${id}`,
          },
        });
      }
    }

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
