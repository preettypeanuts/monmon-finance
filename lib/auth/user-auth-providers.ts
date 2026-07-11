import "server-only";

import { prisma } from "@/lib/db/prisma";

export interface UserAuthProviders {
  hasCredentialPassword: boolean;
  usesGoogleSignIn: boolean;
}

export async function getUserAuthProviders(
  userId: string,
): Promise<UserAuthProviders> {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { providerId: true, password: true },
  });

  return {
    hasCredentialPassword: accounts.some(
      (account) => account.providerId === "credential" && account.password,
    ),
    usesGoogleSignIn: accounts.some((account) => account.providerId === "google"),
  };
}

/** @deprecated Use getUserAuthProviders().hasCredentialPassword */
export async function userHasCredentialPassword(
  userId: string,
): Promise<boolean> {
  const providers = await getUserAuthProviders(userId);
  return providers.hasCredentialPassword;
}
