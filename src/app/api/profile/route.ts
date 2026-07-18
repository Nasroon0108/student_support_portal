import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      department: true,
      studentId: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Password change branch
    if (body.currentPassword || body.newPassword) {
      const data = passwordSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user?.password) {
        return NextResponse.json(
          { error: "No password set for this account" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashed = await bcrypt.hash(data.newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      });

      return NextResponse.json({ message: "Password updated successfully" });
    }

    // Profile info update branch
    const data = profileSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone || null,
        department: data.department || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        studentId: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
