"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  PROFILE_PASSWORD_ALREADY_SET,
  PROFILE_PASSWORD_MIN_LENGTH,
} from "@/config/settings-labels";
import { auth } from "@/lib/auth/auth";
import { userHasCredentialPassword } from "@/lib/auth/user-auth-providers";
import { requireUserId } from "@/lib/auth/session";
import { formatAppError } from "@/lib/errors/format-app-error";

interface ActionSuccess {
  ok: true;
}

interface ActionFailure {
  ok: false;
  error: string;
}

export type SetPasswordResult = ActionSuccess | ActionFailure;

export async function setPasswordAction(
  newPassword: string,
): Promise<SetPasswordResult> {
  if (newPassword.length < 8) {
    return { ok: false, error: PROFILE_PASSWORD_MIN_LENGTH };
  }

  const userId = await requireUserId();

  if (await userHasCredentialPassword(userId)) {
    return { ok: false, error: PROFILE_PASSWORD_ALREADY_SET };
  }

  try {
    await auth.api.setPassword({
      body: { newPassword },
      headers: await headers(),
    });
  } catch (error) {
    return { ok: false, error: formatAppError(error) };
  }

  revalidatePath("/profile");

  return { ok: true };
}
