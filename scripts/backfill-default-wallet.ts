/**
 * Backfill default wallet for users without any wallet.
 * Run once: npm run db:backfill-wallets
 *
 * Does NOT assign walletId to existing transactions — historical rows stay null.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";
import {
  DEFAULT_WALLET_NAME,
  ensureDefaultWalletForClient,
} from "../lib/db/wallets";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
      orderBy: { createdAt: "asc" },
    });

    let created = 0;
    let skipped = 0;

    for (const user of users) {
      const walletCount = await prisma.wallet.count({
        where: { userId: user.id },
      });

      if (walletCount > 0) {
        skipped += 1;
        continue;
      }

      await ensureDefaultWalletForClient(prisma, user.id);
      created += 1;
      console.log(`Created "${DEFAULT_WALLET_NAME}" for ${user.email}`);
    }

    console.log(
      `Done. ${created} wallet(s) created, ${skipped} user(s) already had wallet(s).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
