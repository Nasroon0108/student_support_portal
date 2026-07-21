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
