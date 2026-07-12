import type { PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export const DEFAULT_WALLET_NAME = "Dompet Utama";

/** Creates the default cash wallet when the user has none. Does not backfill walletId on old transactions. */
export async function ensureDefaultWalletForClient(
  client: PrismaClient,
  userId: string,
) {
  const existing = await client.wallet.findFirst({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  if (existing) {
    return existing;
  }

  return client.wallet.create({
    data: {
      userId,
      name: DEFAULT_WALLET_NAME,
      type: "cash",
      isDefault: true,
    },
  });
}

export async function ensureDefaultWallet(userId: string) {
  return ensureDefaultWalletForClient(prisma, userId);
}

export async function userHasWallet(userId: string): Promise<boolean> {
  const count = await prisma.wallet.count({
    where: { userId },
  });

  return count > 0;
}
