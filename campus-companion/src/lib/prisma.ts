import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
// PrismaBetterSqlite3 expects a plain file path, so strip the `file:` prefix if present.
const dbFile = dbUrl.startsWith("file:") ? dbUrl.slice(5) : dbUrl;
const absoluteDbFile = path.isAbsolute(dbFile)
  ? dbFile
  : path.resolve(process.cwd(), dbFile);

const adapter = new PrismaBetterSqlite3({ url: absoluteDbFile });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
