import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  type: z.enum(["GENERAL", "ACADEMIC", "SAFETY", "EVENT", "EMERGENCY"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = announcementSchema.parse(body);

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Announcement creation error:", error);
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

    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
