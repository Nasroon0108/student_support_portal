import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersClient from "@/components/UsersClient";

export default async function UsersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      studentId: true,
      createdAt: true,
    },
  });

  return <UsersClient users={JSON.parse(JSON.stringify(users))} />;
}
