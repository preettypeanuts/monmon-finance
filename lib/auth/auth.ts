import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/db/prisma";
import { getGoogleAuthConfig } from "@/lib/auth/google";

function resolveTrustedOrigins(): string[] | undefined {
  const baseUrl = process.env.BETTER_AUTH_URL?.trim();

  if (!baseUrl) {
    return undefined;
  }

  const origins = new Set<string>([baseUrl]);

  try {
    const parsed = new URL(baseUrl);
    const alternateHost = parsed.hostname.startsWith("www.")
      ? parsed.hostname.slice(4)
      : `www.${parsed.hostname}`;
    origins.add(`${parsed.protocol}//${alternateHost}`);
  } catch {
    // Keep only the configured base URL.
  }

  return [...origins];
}

const googleAuth = getGoogleAuthConfig();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  ...(googleAuth
    ? {
        socialProviders: {
          google: googleAuth,
        },
      }
    : {}),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: resolveTrustedOrigins(),
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
