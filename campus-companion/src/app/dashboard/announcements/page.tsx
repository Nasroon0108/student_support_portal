import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AnnouncementsClient from "@/components/AnnouncementsClient";

export default async function AnnouncementsPage() {
  const session = await auth();
  const isStaff = session?.user?.role !== "STUDENT";

  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, role: true } },
    },
  });

  return (
    <AnnouncementsClient
      announcements={JSON.parse(JSON.stringify(announcements))}
      isStaff={isStaff}
    />
  );
}
