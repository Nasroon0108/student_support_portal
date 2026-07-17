# 🎓 Campus Companion – Student Support, Campus Safety & Welfare Management System

A comprehensive web-based platform for managing student support services, campus safety, and welfare across educational institutions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (React + TypeScript) |
| UI Framework | Bootstrap 5 |
| Backend | Next.js Route Handlers / Server Actions |
| Database | MySQL |
| ORM | Prisma ORM |
| Authentication | Auth.js (NextAuth v5) |
| AI Integration | OpenAI API + RAG |
| File Storage | Cloudinary |
| Email Service | Nodemailer |
| Charts & Analytics | Chart.js |
| Real-time Notifications | Socket.IO |

## Features

### Core Modules
- **Academic Support** – Submit and track academic-related issues
- **Counseling** – Request counseling sessions and mental health support
- **Campus Issues** – Report infrastructure and campus problems
- **Campus Safety (Anti-Ragging)** – Report bullying, ragging, and safety concerns (anonymous supported)
- **Appointments** – Book and manage appointments with staff
- **Announcements** – Campus-wide communication system
- **Notifications** – Real-time notification system

### User Roles
- **Student** – Submit tickets, book appointments, view announcements
- **Academic Staff** – Handle academic support tickets
- **Counselor** – Handle counseling tickets and appointments
- **Maintenance** – Handle campus infrastructure issues
- **Campus Marshal** – Handle safety and ragging complaints
- **Admin** – Full system access, user management, analytics

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd campus-companion
   npm install
   ```

2. **Configure environment variables:**
   Edit `.env` with your database URL and API keys.

3. **Set up the database:**
   ```bash
   npm run db:push       # Push schema to database
   npm run db:generate   # Generate Prisma client
   npm run db:seed       # Seed with sample data
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Counselor | counselor@campus.edu | staff123 |
| Academic Staff | academic@campus.edu | staff123 |
| Campus Marshal | marshal@campus.edu | staff123 |
| Maintenance | maintenance@campus.edu | staff123 |
| Student | student1@campus.edu | student123 |
| Student | student2@campus.edu | student123 |

## Project Structure

```
campus-companion/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Auth.js handlers
│   │   │   ├── register/   # Registration
│   │   │   ├── tickets/    # Ticket CRUD
│   │   │   ├── appointments/ # Appointment CRUD
│   │   │   ├── announcements/ # Announcements CRUD
│   │   │   ├── notifications/ # Notifications
│   │   │   └── users/      # User management
│   │   ├── dashboard/      # Protected dashboard pages
│   │   │   ├── tickets/    # Ticket pages
│   │   │   ├── appointments/ # Appointment pages
│   │   │   ├── announcements/ # Announcement pages
│   │   │   ├── notifications/ # Notification pages
│   │   │   ├── analytics/  # Admin analytics
│   │   │   └── users/      # Admin user management
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── components/         # Reusable components
│   ├── lib/                # Utilities (auth, prisma, email, cloudinary)
│   ├── types/              # TypeScript type definitions
│   └── middleware.ts       # Auth middleware
├── .env                    # Environment variables
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |
