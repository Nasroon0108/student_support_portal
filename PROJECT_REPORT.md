# Campus Companion – Project Summary Report
## Student Support, Campus Safety, and Welfare Management System

---

## 1. Project Overview

**Campus Companion** is a comprehensive web-based platform designed to manage student support services, campus safety, and welfare across educational institutions. It provides a unified interface for students to report issues, book appointments, access counseling, and stay informed about campus activities — while giving administrators and staff the tools to manage, track, and resolve cases efficiently.

### 1.1 Objectives
- Provide students with a single platform to report academic, safety, and welfare issues
- Enable anonymous reporting for sensitive matters (ragging, bullying)
- Streamline ticket routing to appropriate staff based on issue category
- Facilitate appointment booking between students and support staff
- Provide real-time notifications and status tracking
- Give administrators analytics and oversight of all campus support activities
- Ensure role-based access control for data security

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (React + TypeScript) | 16.2.10 |
| UI Framework | Bootstrap 5 | 5.3.8 |
| Backend | Next.js Route Handlers / Server Components | 16.2.10 |
| Database | SQLite (dev) / MySQL (production) | — |
| ORM | Prisma ORM | 7.8.0 |
| Authentication | Auth.js (NextAuth v5) | 5.0.0-beta.31 |
| Validation | Zod | 4.4.3 |
| Charts | Chart.js + react-chartjs-2 | 4.5.1 |
| File Storage | Cloudinary | 2.10.0 |
| Email | Nodemailer | 7.0.13 |
| AI (planned) | OpenAI API | 6.48.0 |
| Real-time (planned) | Socket.IO | 4.8.3 |
| Password Hashing | bcryptjs | 3.0.3 |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Landing  │  │  Login/  │  │Dashboard │  │  Admin Panel     │   │
│  │  Page    │  │ Register │  │ (Student)│  │  (Analytics/     │   │
│  │          │  │          │  │          │  │   Users/Tickets) │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP / HTTPS
┌────────────────────────────┼────────────────────────────────────────┐
│                     NEXT.JS SERVER                                   │
│  ┌─────────────────────────┼──────────────────────────────────┐     │
│  │              Route Handlers (API Layer)                     │     │
│  │  /api/auth  /api/tickets  /api/appointments  /api/profile  │     │
│  │  /api/register  /api/announcements  /api/notifications     │     │
│  │  /api/users                                                │     │
│  └─────────────────────────┬──────────────────────────────────┘     │
│                             │                                        │
│  ┌──────────────┐  ┌───────┴───────┐  ┌────────────────────┐       │
│  │  Auth.js     │  │  Prisma ORM   │  │  Middleware/Proxy  │       │
│  │  (JWT/       │  │  (Query       │  │  (Route Protection)│       │
│  │   Sessions)  │  │   Builder)    │  │                    │       │
│  └──────────────┘  └───────┬───────┘  └────────────────────┘       │
└────────────────────────────┼────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                      DATABASE (SQLite/MySQL)                         │
│  users │ tickets │ ticket_notes │ appointments │ announcements       │
│  accounts │ sessions │ notifications │ ticket_attachments            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Entity-Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ER DIAGRAM                                      │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌────────────────┐          ┌─────────────────────┐
    │    Account     │          │  VerificationToken  │
    │────────────────│          │─────────────────────│
    │ id (PK)        │          │ identifier          │
    │ userId (FK)    │──┐       │ token (UNIQUE)      │
    │ provider       │  │       │ expires             │
    │ providerAcctId │  │       └─────────────────────┘
    └────────────────┘  │
                        │
    ┌────────────────┐  │       ┌─────────────────────┐
    │    Session     │  │       │    Notification     │
    │────────────────│  │       │─────────────────────│
    │ id (PK)        │  │    ┌──│ id (PK)             │
    │ userId (FK)    │──┤    │  │ userId (FK)         │
    │ sessionToken   │  │    │  │ title               │
    │ expires        │  │    │  │ message             │
    └────────────────┘  │    │  │ isRead              │
                        │    │  │ link                │
                        ▼    │  └─────────────────────┘
              ┌──────────────────┐
              │      USER        │
              │──────────────────│
              │ id (PK)          │
              │ name             │
              │ email (UNIQUE)   │
              │ password         │
              │ role             │───── STUDENT | ACADEMIC_STAFF |
              │ phone            │      COUNSELOR | MAINTENANCE |
              │ department       │      CAMPUS_MARSHAL | ADMIN
              │ studentId (UNQ)  │
              │ image            │
              │ createdAt        │
              └────────┬─────────┘
                       │
         ┌─────────────┼──────────────────────────────┐
         │             │                              │
         ▼             ▼                              ▼
┌─────────────┐ ┌──────────────┐           ┌─────────────────┐
│   Ticket    │ │ Appointment  │           │  Announcement   │
│─────────────│ │──────────────│           │─────────────────│
│ id (PK)     │ │ id (PK)      │           │ id (PK)         │
│ title       │ │ title        │           │ title           │
│ description │ │ reason       │           │ content         │
│ category    │ │ date         │           │ type            │
│ status      │ │ time         │           │ isActive        │
│ priority    │ │ status       │           │ authorId (FK)   │
│ isAnonymous │ │ studentId(FK)│           └─────────────────┘
│ createdById │ │ staffId (FK) │
│ assignedToId│ └──────────────┘
└──────┬──────┘
       │
       ├───────────────────┐
       ▼                   ▼
┌──────────────┐    ┌────────────────┐
│  TicketNote  │    │TicketAttachment│
│──────────────│    │────────────────│
│ id (PK)      │    │ id (PK)        │
│ content      │    │ url            │
│ isPublic     │    │ filename       │
│ ticketId(FK) │    │ mimeType       │
│ authorId(FK) │    │ ticketId (FK)  │
│ createdAt    │    └────────────────┘
└──────────────┘
```

### 4.1 Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| User → Ticket (created) | 1:N | A user creates many tickets |
| User → Ticket (assigned) | 1:N | A staff member is assigned many tickets |
| User → TicketNote | 1:N | A user authors many notes |
| User → Appointment (student) | 1:N | A student has many appointments |
| User → Appointment (staff) | 1:N | A staff member has many appointments |
| User → Announcement | 1:N | A staff/admin creates many announcements |
| User → Notification | 1:N | A user receives many notifications |
| User → Account | 1:N | A user has many OAuth accounts |
| User → Session | 1:N | A user has many sessions |
| Ticket → TicketNote | 1:N | A ticket has many notes |
| Ticket → TicketAttachment | 1:N | A ticket has many attachments |

---

## 5. User Roles and Permissions

| Role | Capabilities |
|------|-------------|
| **STUDENT** | Create tickets, view own tickets, close own tickets, book appointments, view announcements, receive notifications, update profile |
| **ACADEMIC_STAFF** | View assigned/relevant tickets, update ticket status/priority, add notes, assign tickets, manage appointments, create announcements |
| **COUNSELOR** | Same as Academic Staff, handles COUNSELING category tickets |
| **MAINTENANCE** | Same as Academic Staff, handles MAINTENANCE and CAMPUS_ISSUE tickets |
| **CAMPUS_MARSHAL** | Same as Academic Staff, handles CAMPUS_SAFETY and RAGGING tickets |
| **ADMIN** | Full access: all tickets, user management (role changes), analytics dashboard, create announcements, manage all appointments, system-wide oversight |

---

## 6. Functional Modules

### 6.1 Authentication Module
- Email/password credential-based login
- JWT session strategy with secure cookies
- Role-based route protection via proxy middleware
- Registration with student ID, department, phone fields
- Password hashing with bcryptjs (12 salt rounds)

### 6.2 Ticket & Case Management Module
- **Create:** Students submit tickets with title, description, category, priority
- **Anonymous Reporting:** Students can hide their identity for sensitive reports
- **Auto-routing:** Staff sees unassigned tickets matching their expertise
- **Assignment:** Admin/staff assign tickets to appropriate personnel
- **Status Tracking:** OPEN → IN_PROGRESS → RESOLVED → CLOSED (or ESCALATED)
- **Priority Management:** LOW → MEDIUM → HIGH → URGENT
- **Notes/Conversation:** Two-way communication between student and staff
- **Notifications:** Auto-generated on status change, assignment, and new notes

### 6.3 Appointments Module
- Students book appointments with specific staff members
- Date/time selection with reason field
- Staff confirm or cancel pending appointments
- Status flow: PENDING → CONFIRMED → COMPLETED (or CANCELLED)
- Admin has full view of all appointments

### 6.4 Announcements Module
- Staff/admin create campus-wide announcements
- Types: GENERAL, ACADEMIC, SAFETY, EVENT, EMERGENCY
- Visible to all authenticated users
- Active/inactive toggle for content management

### 6.5 Notifications Module
- Auto-generated from system events (ticket updates, appointments, etc.)
- Unread count displayed on dashboard
- Mark all as read functionality
- Deep links to relevant pages

### 6.6 Analytics Module (Admin only)
- Total tickets, open, in-progress, resolved counts
- Tickets by category (bar chart)
- Tickets by status (doughnut chart)
- Tickets by priority (doughnut chart)
- Total users and appointments summary

### 6.7 User Management Module (Admin only)
- View all registered users
- Change user roles (promote student to staff, etc.)
- View department, student ID, join date

### 6.8 Profile Settings Module
- Edit name, phone, department
- Upload/remove profile photo (avatar)
- Change password with current password verification
- Theme preference (light/dark mode)

---

## 7. Data Flow Diagrams

### 7.1 Ticket Lifecycle (DFD Level 1)

```
┌──────────┐     Submit Ticket      ┌─────────────────┐
│  Student  │ ────────────────────▶ │  Ticket System   │
│           │ ◀──── Notification ── │  (Database)      │
└──────────┘                        └────────┬────────┘
                                             │
                                    View All Tickets
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │     Admin       │
                                    │                 │
                                    │ • Assign Staff  │
                                    │ • Change Status │
                                    │ • Change Priority│
                                    └────────┬────────┘
                                             │
                                      Assign Ticket
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Staff Member   │
                                    │                 │
                                    │ • Add Notes     │
                                    │ • Update Status │
                                    │ • Resolve       │
                                    └─────────────────┘
                                             │
                                   Notification to Student
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Student Views  │
                                    │  Updated Status │
                                    │  + Staff Notes  │
                                    └─────────────────┘
```

### 7.2 Appointment Lifecycle

```
┌──────────┐   Book Appointment    ┌─────────────────┐
│  Student  │ ───────────────────▶ │   Appointment    │
│           │                      │   (PENDING)      │
└──────────┘                       └────────┬────────┘
                                            │
                                   Notify Staff Member
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  Staff Member   │
                                   │                 │
                                   │  ✓ Confirm      │
                                   │  ✕ Cancel       │
                                   └────────┬────────┘
                                            │
                                   Notify Student
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │   CONFIRMED     │
                                   │   or CANCELLED  │
                                   └─────────────────┘
```

---

## 8. Use Case Diagram

```
                    ┌─────────────────────────────────────────┐
                    │         Campus Companion System          │
                    │                                         │
    ┌────────┐     │  ┌─────────────────────────────────┐   │
    │Student │─────┼─▶│ Register / Login                 │   │
    │        │─────┼─▶│ Submit Ticket (+ Anonymous)      │   │
    │        │─────┼─▶│ View My Tickets                  │   │
    │        │─────┼─▶│ Close Own Ticket                 │   │
    │        │─────┼─▶│ Book Appointment                 │   │
    │        │─────┼─▶│ View Announcements               │   │
    │        │─────┼─▶│ View Notifications               │   │
    │        │─────┼─▶│ Update Profile / Upload Photo    │   │
    └────────┘     │  └─────────────────────────────────┘   │
                    │                                         │
    ┌────────┐     │  ┌─────────────────────────────────┐   │
    │ Staff  │─────┼─▶│ View Assigned Tickets            │   │
    │        │─────┼─▶│ View Unassigned (own category)   │   │
    │        │─────┼─▶│ Update Status / Priority         │   │
    │        │─────┼─▶│ Assign Ticket                    │   │
    │        │─────┼─▶│ Add Notes / Reply                │   │
    │        │─────┼─▶│ Confirm/Cancel Appointments      │   │
    │        │─────┼─▶│ Create Announcements             │   │
    └────────┘     │  └─────────────────────────────────┘   │
                    │                                         │
    ┌────────┐     │  ┌─────────────────────────────────┐   │
    │ Admin  │─────┼─▶│ View ALL Tickets                 │   │
    │        │─────┼─▶│ Assign Tickets to Staff          │   │
    │        │─────┼─▶│ Manage Users (Change Roles)      │   │
    │        │─────┼─▶│ View Analytics Dashboard         │   │
    │        │─────┼─▶│ Create Announcements             │   │
    │        │─────┼─▶│ Manage All Appointments          │   │
    └────────┘     │  └─────────────────────────────────┘   │
                    │                                         │
                    └─────────────────────────────────────────┘
```

---

## 9. Database Schema (Table Definitions)

### 9.1 users
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| name | String | NOT NULL |
| email | String | UNIQUE, NOT NULL |
| emailVerified | DateTime | NULLABLE |
| password | String | NULLABLE (hashed) |
| image | String | NULLABLE |
| role | String | DEFAULT "STUDENT" |
| phone | String | NULLABLE |
| department | String | NULLABLE |
| studentId | String | UNIQUE, NULLABLE |
| createdAt | DateTime | DEFAULT now() |
| updatedAt | DateTime | Auto-updated |

### 9.2 tickets
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| title | String | NOT NULL |
| description | String | NOT NULL |
| category | String | NOT NULL |
| status | String | DEFAULT "OPEN" |
| priority | String | DEFAULT "MEDIUM" |
| isAnonymous | Boolean | DEFAULT false |
| createdById | String | FK → users.id |
| assignedToId | String | FK → users.id, NULLABLE |
| createdAt | DateTime | DEFAULT now() |
| updatedAt | DateTime | Auto-updated |

### 9.3 ticket_notes
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| content | String | NOT NULL |
| isPublic | Boolean | DEFAULT true |
| ticketId | String | FK → tickets.id, CASCADE |
| authorId | String | FK → users.id |
| createdAt | DateTime | DEFAULT now() |

### 9.4 ticket_attachments
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| url | String | NOT NULL |
| filename | String | NOT NULL |
| mimeType | String | NULLABLE |
| ticketId | String | FK → tickets.id, CASCADE |
| createdAt | DateTime | DEFAULT now() |

### 9.5 appointments
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| title | String | NOT NULL |
| reason | String | NOT NULL |
| date | DateTime | NOT NULL |
| time | String | NOT NULL |
| status | String | DEFAULT "PENDING" |
| studentId | String | FK → users.id |
| staffId | String | FK → users.id |
| createdAt | DateTime | DEFAULT now() |
| updatedAt | DateTime | Auto-updated |

### 9.6 announcements
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| title | String | NOT NULL |
| content | String | NOT NULL |
| type | String | DEFAULT "GENERAL" |
| isActive | Boolean | DEFAULT true |
| authorId | String | FK → users.id |
| createdAt | DateTime | DEFAULT now() |
| updatedAt | DateTime | Auto-updated |

### 9.7 notifications
| Column | Type | Constraints |
|--------|------|-------------|
| id | String | PK, CUID |
| title | String | NOT NULL |
| message | String | NOT NULL |
| isRead | Boolean | DEFAULT false |
| link | String | NULLABLE |
| userId | String | FK → users.id, CASCADE |
| createdAt | DateTime | DEFAULT now() |

---

## 10. API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | Public | Register new student |
| GET/POST | /api/auth/[...nextauth] | Public | Auth.js handlers (login/session) |
| GET | /api/tickets | Authenticated | List tickets (role-filtered) |
| POST | /api/tickets | Student | Create new ticket |
| GET | /api/tickets/[id] | Authenticated | Get ticket details |
| PATCH | /api/tickets/[id] | Staff/Admin | Update status, priority, assignment |
| POST | /api/tickets/[id]/notes | Authenticated | Add note to ticket |
| GET | /api/appointments | Authenticated | List appointments (role-filtered) |
| POST | /api/appointments | Student/Admin | Book new appointment |
| PATCH | /api/appointments/[id] | Staff/Admin | Confirm/cancel appointment |
| GET | /api/announcements | Authenticated | List active announcements |
| POST | /api/announcements | Staff/Admin | Create announcement |
| GET | /api/notifications | Authenticated | List user's notifications |
| PATCH | /api/notifications | Authenticated | Mark all as read |
| PATCH | /api/users/[id] | Admin | Change user role |
| GET | /api/profile | Authenticated | Get current user profile |
| PATCH | /api/profile | Authenticated | Update profile info or password |
| POST | /api/profile/avatar | Authenticated | Upload profile photo |
| DELETE | /api/profile/avatar | Authenticated | Remove profile photo |

---

## 11. Security Measures

| Measure | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs with 12 salt rounds |
| Session Strategy | JWT (stateless, signed tokens) |
| Route Protection | Proxy middleware redirects unauthenticated users |
| API Authorization | Role-based checks on every route handler |
| Input Validation | Zod schema validation on all POST/PATCH endpoints |
| Anonymous Reporting | Student identity hidden from staff when `isAnonymous=true` |
| CSRF Protection | Built-in Auth.js CSRF tokens |
| File Upload Validation | Type whitelist (JPEG/PNG/GIF/WebP) + 5MB size limit |

---

## 12. Non-Functional Requirements

| Requirement | Specification |
|-------------|--------------|
| Responsiveness | Bootstrap 5 grid, works on desktop and mobile |
| Theme Support | Light/dark mode with system preference detection |
| Performance | Server-side rendering, SQLite for fast local queries |
| Accessibility | Semantic HTML, ARIA labels, keyboard navigation |
| Scalability | Prisma ORM supports migration to MySQL/PostgreSQL |
| Maintainability | TypeScript strict mode, Zod validation, component architecture |

---

## 13. Project Structure

```
student_support_portal/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Test data seeder
├── src/
│   ├── app/
│   │   ├── api/               # REST API route handlers
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── register/      # User registration
│   │   │   ├── tickets/       # Ticket CRUD + notes
│   │   │   ├── appointments/  # Appointment CRUD
│   │   │   ├── announcements/ # Announcement CRUD
│   │   │   ├── notifications/ # Notification management
│   │   │   ├── users/         # Admin user management
│   │   │   └── profile/       # Profile + avatar upload
│   │   ├── dashboard/         # Protected pages
│   │   │   ├── tickets/       # Ticket list, detail, create
│   │   │   ├── appointments/  # Appointment management
│   │   │   ├── announcements/ # Announcement feed
│   │   │   ├── notifications/ # Notification center
│   │   │   ├── analytics/     # Admin charts/stats
│   │   │   ├── users/         # Admin user table
│   │   │   └── profile/       # Profile settings
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout (fonts, theme)
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Design system (tokens, components)
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities (auth, prisma, email, cloudinary)
│   ├── types/                 # TypeScript declarations
│   └── proxy.ts              # Next.js 16 route protection
├── .env                       # Environment configuration
├── package.json               # Dependencies and scripts
├── prisma.config.ts           # Prisma 7 config
├── next.config.ts             # Next.js config
└── tsconfig.json              # TypeScript config
```

---

## 14. Future Enhancements

| Feature | Status | Description |
|---------|--------|-------------|
| AI Chatbot (RAG) | Planned | OpenAI-powered Q&A for campus policies |
| Real-time Notifications | Planned | Socket.IO for instant push notifications |
| Email Notifications | Ready (needs SMTP config) | Nodemailer templates for ticket/appointment updates |
| File Attachments on Tickets | Schema ready, UI pending | Allow students to attach images/documents to tickets |
| Private Staff Notes | Schema ready, UI pending | Staff-only internal notes hidden from students |
| Pagination | Pending | For large ticket/user lists |
| Search & Filters | Pending | Search tickets by keyword, filter by status/category |
| Export Reports | Pending | CSV/PDF export of analytics data |

---

## 15. Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Counselor | counselor@campus.edu | staff123 |
| Academic Staff | academic@campus.edu | staff123 |
| Campus Marshal | marshal@campus.edu | staff123 |
| Maintenance | maintenance@campus.edu | staff123 |
| Student 1 | student1@campus.edu | student123 |
| Student 2 | student2@campus.edu | student123 |

---

*Report generated: July 2026*
*Project: Campus Companion v0.1.0*
