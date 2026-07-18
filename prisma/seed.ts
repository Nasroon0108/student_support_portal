import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbFile = dbUrl.startsWith("file:") ? dbUrl.slice(5) : dbUrl;
const absoluteDbFile = path.isAbsolute(dbFile)
  ? dbFile
  : path.resolve(process.cwd(), dbFile);

const adapter = new PrismaBetterSqlite3({ url: absoluteDbFile });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@campus.edu" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@campus.edu",
      password: adminPassword,
      role: "ADMIN",
      department: "Administration",
    },
  });

  // Create Staff
  const staffPassword = await bcrypt.hash("staff123", 12);

  const counselor = await prisma.user.upsert({
    where: { email: "counselor@campus.edu" },
    update: {},
    create: {
      name: "Dr. Sarah Wilson",
      email: "counselor@campus.edu",
      password: staffPassword,
      role: "COUNSELOR",
      department: "Student Welfare",
    },
  });

  const academicStaff = await prisma.user.upsert({
    where: { email: "academic@campus.edu" },
    update: {},
    create: {
      name: "Prof. James Smith",
      email: "academic@campus.edu",
      password: staffPassword,
      role: "ACADEMIC_STAFF",
      department: "Computer Science",
    },
  });

  const marshal = await prisma.user.upsert({
    where: { email: "marshal@campus.edu" },
    update: {},
    create: {
      name: "Officer Mike Johnson",
      email: "marshal@campus.edu",
      password: staffPassword,
      role: "CAMPUS_MARSHAL",
      department: "Campus Security",
    },
  });

  const maintenance = await prisma.user.upsert({
    where: { email: "maintenance@campus.edu" },
    update: {},
    create: {
      name: "Tom Roberts",
      email: "maintenance@campus.edu",
      password: staffPassword,
      role: "MAINTENANCE",
      department: "Facilities",
    },
  });

  // Create Students
  const studentPassword = await bcrypt.hash("student123", 12);

  const student1 = await prisma.user.upsert({
    where: { email: "student1@campus.edu" },
    update: {},
    create: {
      name: "Alex Kumar",
      email: "student1@campus.edu",
      password: studentPassword,
      role: "STUDENT",
      studentId: "STU-2024-001",
      department: "Computer Science",
      phone: "+91 9876543210",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "student2@campus.edu" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "student2@campus.edu",
      password: studentPassword,
      role: "STUDENT",
      studentId: "STU-2024-002",
      department: "Engineering",
      phone: "+91 9876543211",
    },
  });

  // Create Sample Tickets
  await prisma.ticket.createMany({
    data: [
      {
        title: "Unable to access course materials",
        description:
          "I cannot access the online course materials for CS301. The portal shows an error when I try to download lecture notes.",
        category: "ACADEMIC_SUPPORT",
        priority: "HIGH",
        status: "OPEN",
        createdById: student1.id,
        assignedToId: academicStaff.id,
      },
      {
        title: "Bullying incident in hostel Block B",
        description:
          "I want to report a bullying incident that occurred in the common area of Block B hostel on March 15th. Senior students were harassing freshers.",
        category: "RAGGING",
        priority: "URGENT",
        status: "IN_PROGRESS",
        isAnonymous: true,
        createdById: student2.id,
        assignedToId: marshal.id,
      },
      {
        title: "Broken water pipe in Lab 204",
        description:
          "There is a leaking water pipe in Computer Lab 204. Water is dripping near the electrical outlets which could be dangerous.",
        category: "MAINTENANCE",
        priority: "HIGH",
        status: "OPEN",
        createdById: student1.id,
        assignedToId: maintenance.id,
      },
      {
        title: "Need counseling for exam stress",
        description:
          "I have been feeling extremely anxious about the upcoming final exams. I would like to schedule a counseling session to discuss coping strategies.",
        category: "COUNSELING",
        priority: "MEDIUM",
        status: "OPEN",
        createdById: student2.id,
        assignedToId: counselor.id,
      },
    ],
  });

  // Create Sample Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Campus Safety Drill - March 25",
        content:
          "A mandatory campus safety drill will be conducted on March 25. All students are required to participate. Assembly points will be communicated via email.",
        type: "SAFETY",
        authorId: marshal.id,
      },
      {
        title: "Mid-semester Exam Schedule Published",
        content:
          "The mid-semester examination schedule has been published on the academic portal. Please check your individual timetables and report any conflicts.",
        type: "ACADEMIC",
        authorId: academicStaff.id,
      },
      {
        title: "Mental Health Awareness Week",
        content:
          "Join us for Mental Health Awareness Week from April 1-7. Free counseling sessions, workshops, and peer support groups will be available.",
        type: "EVENT",
        authorId: counselor.id,
      },
    ],
  });

  // Create Sample Appointments
  await prisma.appointment.createMany({
    data: [
      {
        title: "Academic guidance session",
        reason: "Need help choosing electives for next semester. Want to discuss career options in AI/ML vs full-stack development.",
        date: new Date("2026-07-22"),
        time: "10:00",
        status: "CONFIRMED",
        studentId: student1.id,
        staffId: academicStaff.id,
      },
      {
        title: "Counseling session - Exam anxiety",
        reason: "Feeling overwhelmed with upcoming finals. Would like to discuss stress management techniques.",
        date: new Date("2026-07-23"),
        time: "14:30",
        status: "PENDING",
        studentId: student2.id,
        staffId: counselor.id,
      },
      {
        title: "Ragging incident follow-up",
        reason: "Follow-up meeting regarding the reported incident in Block B hostel. Need to provide additional information.",
        date: new Date("2026-07-24"),
        time: "11:00",
        status: "PENDING",
        studentId: student2.id,
        staffId: marshal.id,
      },
      {
        title: "Lab equipment issue discussion",
        reason: "The computers in Lab 204 have been running very slowly. Need to discuss possible upgrades or maintenance schedule.",
        date: new Date("2026-07-25"),
        time: "09:00",
        status: "CONFIRMED",
        studentId: student1.id,
        staffId: maintenance.id,
      },
      {
        title: "Career counseling",
        reason: "Want to discuss internship opportunities and how to prepare for campus placements next year.",
        date: new Date("2026-07-20"),
        time: "15:00",
        status: "COMPLETED",
        studentId: student1.id,
        staffId: counselor.id,
      },
    ],
  });

  // Create Sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: "Ticket Assigned",
        message: 'Your ticket "Unable to access course materials" has been assigned to Prof. James Smith.',
        userId: student1.id,
        link: "/dashboard/tickets",
        isRead: false,
      },
      {
        title: "Appointment Confirmed",
        message: 'Your appointment "Academic guidance session" on July 22 has been confirmed.',
        userId: student1.id,
        link: "/dashboard/appointments",
        isRead: true,
      },
      {
        title: "New Announcement",
        message: "Mental Health Awareness Week starts April 1. Free counseling sessions available.",
        userId: student2.id,
        link: "/dashboard/announcements",
        isRead: false,
      },
      {
        title: "Ticket Updated",
        message: 'Your ticket "Bullying incident in hostel Block B" status changed to IN PROGRESS.',
        userId: student2.id,
        link: "/dashboard/tickets",
        isRead: false,
      },
      {
        title: "New Appointment Request",
        message: 'Priya Sharma has requested an appointment: "Counseling session - Exam anxiety"',
        userId: counselor.id,
        link: "/dashboard/appointments",
        isRead: false,
      },
      {
        title: "Ticket Assigned to You",
        message: 'You have been assigned ticket "Unable to access course materials".',
        userId: academicStaff.id,
        link: "/dashboard/tickets",
        isRead: false,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Test Accounts:");
  console.log("  Admin: admin@campus.edu / admin123");
  console.log("  Counselor: counselor@campus.edu / staff123");
  console.log("  Academic: academic@campus.edu / staff123");
  console.log("  Marshal: marshal@campus.edu / staff123");
  console.log("  Maintenance: maintenance@campus.edu / staff123");
  console.log("  Student 1: student1@campus.edu / student123");
  console.log("  Student 2: student2@campus.edu / student123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
