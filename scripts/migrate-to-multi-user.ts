/**
 * Safe migration from single-tenant to multi-user.
 *
 * 1. Adds nullable userId columns + auth tables
 * 2. Creates a legacy user and backfills existing rows
 * 3. Sets userId NOT NULL
 *
 * Run: npx tsx scripts/migrate-to-multi-user.ts
 * Then: npx prisma db push
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const SCHEMA = "monmon_whethertie";
const LEGACY_USER_ID = "legacy-local-user";
const LEGACY_EMAIL = "legacy@monmon.local";
const LEGACY_NAME = "Legacy User";

const TENANT_TABLES = [
  "Transaction",
  "InboxMessage",
  "CategoryBudget",
  "PlannedItem",
  "Plan",
] as const;

async function columnExists(
  prisma: PrismaClient,
  table: string,
  column: string,
): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = $1
        AND table_name = $2
        AND column_name = $3
    ) AS exists`,
    SCHEMA,
    table,
    column,
  );

  return rows[0]?.exists ?? false;
}

async function tableExists(
  prisma: PrismaClient,
  table: string,
): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = $1
        AND table_name = $2
    ) AS exists`,
    SCHEMA,
    table,
  );

  return rows[0]?.exists ?? false;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  const hasUserTable = await tableExists(prisma, "user");
  if (!hasUserTable) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "${SCHEMA}"."user" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        "image" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "user_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(
      `CREATE UNIQUE INDEX "user_email_key" ON "${SCHEMA}"."user"("email")`,
    );
    console.log("Created user table");
  }

  for (const table of TENANT_TABLES) {
    const exists = await columnExists(prisma, table, "userId");
    if (!exists) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${SCHEMA}"."${table}" ADD COLUMN "userId" TEXT`,
      );
      console.log(`Added nullable userId to ${table}`);
    }
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO "${SCHEMA}"."user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, true, NOW(), NOW())
     ON CONFLICT ("email") DO NOTHING`,
    LEGACY_USER_ID,
    LEGACY_NAME,
    LEGACY_EMAIL,
  );
  console.log("Ensured legacy user");

  for (const table of TENANT_TABLES) {
    const updated = await prisma.$executeRawUnsafe(
      `UPDATE "${SCHEMA}"."${table}" SET "userId" = $1 WHERE "userId" IS NULL`,
      LEGACY_USER_ID,
    );
    console.log(`Backfilled ${table}: ${updated} rows`);
  }

  for (const table of TENANT_TABLES) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "${SCHEMA}"."${table}" ALTER COLUMN "userId" SET NOT NULL`,
    );
    console.log(`Set userId NOT NULL on ${table}`);
  }

  await prisma.$disconnect();
  console.log("\nDone. Run: npx prisma db push");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
