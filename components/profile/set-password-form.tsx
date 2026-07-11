"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { setPasswordAction } from "@/app/actions/auth";
import { GoogleAccountNotice } from "@/components/profile/google-account-notice";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PROFILE_PASSWORD_MIN_LENGTH_ID,
  PROFILE_PASSWORD_MISMATCH_ID,
  PROFILE_PASSWORD_SET_FAILED,
  PROFILE_PASSWORD_SET_GOOGLE,
  PROFILE_SAVE_PASSWORD_GOOGLE,
  PROFILE_SAVING_PASSWORD,
  PROFILE_SET_PASSWORD,
  PROFILE_SET_PASSWORD_CONFIRM,
  PROFILE_SET_PASSWORD_DESC,
  PROFILE_SET_PASSWORD_NEW,
} from "@/config/settings-labels";

interface SetPasswordFormProps {
  usesGoogleSignIn?: boolean;
}

export function SetPasswordForm({
  usesGoogleSignIn = true,
}: SetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError(PROFILE_PASSWORD_MIN_LENGTH_ID);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(PROFILE_PASSWORD_MISMATCH_ID);
      return;
    }

    setPending(true);

    const result = await setPasswordAction(newPassword);

    setPending(false);

    if (!result.ok) {
      setError(result.error ?? PROFILE_PASSWORD_SET_FAILED);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setSuccess(PROFILE_PASSWORD_SET_GOOGLE);
    router.refresh();
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-[13px] font-medium text-muted-foreground">
          {PROFILE_SET_PASSWORD}
        </h2>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {PROFILE_SET_PASSWORD_DESC}
        </p>
      </div>

      {usesGoogleSignIn ? <GoogleAccountNotice /> : null}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-900">
          <div className="space-y-2">
            <Label htmlFor="set-new-password">{PROFILE_SET_PASSWORD_NEW}</Label>
            <PasswordInput
              autoComplete="new-password"
              id="set-new-password"
              minLength={8}
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-confirm-password">
              {PROFILE_SET_PASSWORD_CONFIRM}
            </Label>
            <PasswordInput
              autoComplete="new-password"
              id="set-confirm-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
              {success}
            </p>
          ) : null}
        </div>

        <Button className="w-full shrink-0" disabled={pending} type="submit">
          {pending ? PROFILE_SAVING_PASSWORD : PROFILE_SAVE_PASSWORD_GOOGLE}
        </Button>
      </form>
    </section>
  );
}
