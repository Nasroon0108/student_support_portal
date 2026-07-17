import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "ACADEMIC_SUPPORT",
    "COUNSELING",
    "CAMPUS_ISSUE",
    "CAMPUS_SAFETY",
    "RAGGING",
    "MAINTENANCE",
    "OTHER",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  isAnonymous: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = ticketSchema.parse(body);

    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        isAnonymous: data.isAnonymous,
        createdById: session.user.id,
      },
    });

    // Create notification for the student
    await prisma.notification.create({
      data: {
        title: "Ticket Created",
        message: `Your ticket "${ticket.title}" has been submitted successfully.`,
        userId: session.user.id,
        link: `/dashboard/tickets/${ticket.id}`,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Ticket creation error:", error);
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
        ? { createdById: userId }
        : role === "ADMIN"
        ? {}
        : { assignedToId: userId };

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { name: true, studentId: true } },
        assignedTo: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
