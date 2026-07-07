import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/db/prisma";
import { getGoogleAuthConfig } from "@/lib/auth/google";

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
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : undefined,
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
