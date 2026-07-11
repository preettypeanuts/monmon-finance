import "server-only";

import { prisma } from "@/lib/db/prisma";

/** True when the user can sign in with email + password (credential account exists). */
export async function userHasCredentialPassword(
  userId: string,
): Promise<boolean> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "credential",
      password: { not: null },
    },
    select: { id: true },
  });

  return Boolean(account);
}
