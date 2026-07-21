# Campus Companion – Setup Guide
## Complete Installation & Configuration for New Developers

---

## Prerequisites (Install These First)

### 1. Node.js (Required)
- **Version:** 18 or above (recommended: 20 LTS or 22)
- **Download:** https://nodejs.org/
- **Verify:** Open terminal and run:
  ```bash
  node --version
  npm --version
  ```

### 2. Git (Required)
- **Download:** https://git-scm.com/downloads
- **Verify:**
  ```bash
  git --version
  ```

### 3. Code Editor (Recommended)
- **VS Code:** https://code.visualstudio.com/
- Recommended extensions: ES7+ React Snippets, Prisma, Tailwind CSS IntelliSense

### 4. Web Browser
- Chrome, Firefox, or Edge (with DevTools)

> **Note:** No MySQL or database server needed — this project uses SQLite which is file-based (zero setup).

---

## Step-by-Step Setup

### Step 1: Get the Project Files

**Option A — If shared via Git:**
```bash
git clone <repository-url>
cd student_support_portal
```

**Option B — If shared via ZIP/folder copy:**
1. Copy the `student_support_portal` folder to your machine
2. Open terminal in that folder:
   ```bash
   cd path/to/student_support_portal
   ```

> ⚠️ Do NOT copy `node_modules/` or `.next/` folders — they'll be regenerated.

---

### Step 2: Install Dependencies

Run this in the project root:

```bash
npm install
```

This installs all 30+ packages automatically from `package.json`. Takes 1-3 minutes depending on internet speed.

---

### Step 3: Set Up Environment File

The project needs a `.env` file in the root. If it's not included (for security), create one:

```bash
# On Windows:
copy NUL .env

# On Mac/Linux:
touch .env
```

Then paste this content into `.env`:

```env
# Database (SQLite - zero config, stored as dev.db file)
DATABASE_URL="file:./dev.db"

# Auth.js (change this to any random string)
AUTH_SECRET="my-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (optional - AI features won't work without this)
OPENAI_API_KEY="your-openai-api-key"

# Cloudinary (optional - photo upload uses base64 fallback without this)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (optional - notifications stay in-app without this)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Important:** Only `DATABASE_URL` and `AUTH_SECRET` are required to run the project. Everything else is optional.

---

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

This creates the database query library from the schema.

---

### Step 5: Create the Database & Tables

```bash
npm run db:push
```

This creates `dev.db` (SQLite file) with all the tables.

---

### Step 6: Seed with Test Data

```bash
npm run db:seed
```

This populates the database with sample users, tickets, appointments, announcements, and notifications.

---

### Step 7: Run the Project

```bash
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## Quick Start (TL;DR)

If you just want to run it fast, here are all commands in order:

```bash
cd student_support_portal
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Then open http://localhost:3000.

---

## Test Accounts (After Seeding)

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

## Packages Installed (Full List)

### Production Dependencies

| Package | Purpose |
|---------|---------|
| `next` (16.2.10) | React framework (frontend + backend) |
| `react` (19.2.4) | UI component library |
| `react-dom` (19.2.4) | React DOM rendering |
| `typescript` (5.x) | Type safety |
| `bootstrap` (5.3.8) | CSS framework for responsive design |
| `react-bootstrap` (2.10.10) | Bootstrap React components |
| `@popperjs/core` (2.11.8) | Positioning for Bootstrap dropdowns |
| `prisma` (7.8.0) | Database ORM CLI |
| `@prisma/client` (7.8.0) | Database query builder |
| `@prisma/adapter-better-sqlite3` (7.8.0) | SQLite driver adapter for Prisma 7 |
| `better-sqlite3` (12.11.1) | SQLite database driver |
| `next-auth` (5.0.0-beta.31) | Authentication (login/register/sessions) |
| `@auth/prisma-adapter` (2.11.2) | Connects Auth.js to Prisma |
| `bcryptjs` (3.0.3) | Password hashing |
| `zod` (4.4.3) | Input validation |
| `chart.js` (4.5.1) | Chart rendering engine |
| `react-chartjs-2` (5.3.1) | React wrapper for Chart.js |
| `cloudinary` (2.10.0) | Cloud image storage |
| `nodemailer` (7.0.13) | Email sending |
| `openai` (6.48.0) | AI integration (planned) |
| `socket.io` (4.8.3) | Real-time server (planned) |
| `socket.io-client` (4.8.3) | Real-time client (planned) |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@types/bcryptjs` | TypeScript types for bcryptjs |
| `@types/node` | TypeScript types for Node.js |
| `@types/nodemailer` | TypeScript types for nodemailer |
| `@types/react` | TypeScript types for React |
| `@types/react-dom` | TypeScript types for React DOM |
| `dotenv` (17.4.2) | Loads .env variables for Prisma config |
| `eslint` (9.x) | Code linting |
| `eslint-config-next` | Next.js-specific lint rules |
| `tsx` (4.23.1) | TypeScript execution (for seed script) |

---

## Useful Commands Reference

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Create production build |
| `npm run start` | Run production build |
| `npm run lint` | Check code for issues |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Populate database with test data |
| `npm run db:studio` | Open visual database browser (http://localhost:5555) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Create migration files (for version control) |

---

## Troubleshooting

### "Port 3000 already in use"
Another process is using port 3000. Kill it:
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <pid_number> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```
Or just run `npm run dev` and it'll auto-pick port 3001.

### "Module not found" errors after cloning
You forgot to install dependencies:
```bash
npm install
npx prisma generate
```

### "Table does not exist" error
Database isn't set up yet:
```bash
npm run db:push
npm run db:seed
```

### "Invalid email or password" when logging in
The database might be empty (no seeded users). Run:
```bash
npm run db:seed
```

### Want to reset everything from scratch?
```bash
# Windows:
del dev.db
npm run db:push
npm run db:seed

# Mac/Linux:
rm dev.db
npm run db:push
npm run db:seed
```

### Dev server hangs after PC sleep (Windows)
```bash
taskkill /IM node.exe /F
npm run dev
```

---

## Sharing the Project With Friends

### What to share:
- The entire project folder **excluding:**
  - `node_modules/` (800MB+ — they'll run `npm install` themselves)
  - `.next/` (build cache — regenerates automatically)
  - `dev.db` (database — they'll create their own with `db:push` + `db:seed`)

### Best way to share:
1. **GitHub (recommended):** Push to a private/public repo, friends clone it
2. **ZIP file:** Zip the folder (exclude `node_modules`, `.next`, `dev.db`), send via Google Drive/WhatsApp
3. **USB drive:** Same as ZIP, copy the folder minus the excluded items

### Their setup (after receiving the files):
```bash
cd student_support_portal
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

That's it. 5 commands and they're running.

---

## Environment-Specific Notes

### Windows
- Use PowerShell or Command Prompt
- If `npx` commands fail, try running terminal as Administrator
- If `better-sqlite3` fails to install, you may need Windows Build Tools:
  ```bash
  npm install --global windows-build-tools
  ```

### macOS
- If Xcode Command Line Tools are missing:
  ```bash
  xcode-select --install
  ```

### Linux
- You may need build essentials:
  ```bash
  sudo apt-get install build-essential python3
  ```

---

*Guide version: 1.0 | Last updated: July 2026*
