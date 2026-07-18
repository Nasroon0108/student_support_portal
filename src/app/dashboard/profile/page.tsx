import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfileSettingsClient from "@/components/ProfileSettingsClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
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
    redirect("/login");
  }

  return <ProfileSettingsClient user={JSON.parse(JSON.stringify(user))} />;
}
