"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { setPasswordAction } from "@/app/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PROFILE_CONFIRM_PASSWORD,
  PROFILE_NEW_PASSWORD,
  PROFILE_PASSWORD_MIN_LENGTH,
  PROFILE_PASSWORD_MISMATCH,
  PROFILE_PASSWORD_SET,
  PROFILE_PASSWORD_SET_FAILED,
  PROFILE_SAVE_PASSWORD,
  PROFILE_SAVING_PASSWORD,
  PROFILE_SET_PASSWORD,
  PROFILE_SET_PASSWORD_DESC,
} from "@/config/settings-labels";

export function SetPasswordForm() {
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
      setError(PROFILE_PASSWORD_MIN_LENGTH);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(PROFILE_PASSWORD_MISMATCH);
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
    setSuccess(PROFILE_PASSWORD_SET);
    router.refresh();
  }

  return (
    <section className="space-y-3">
      <div className="space-y-0.5">
        <h2 className="text-[13px] font-medium text-muted-foreground">
          {PROFILE_SET_PASSWORD}
        </h2>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {PROFILE_SET_PASSWORD_DESC}
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-900">
          <div className="space-y-2">
            <Label htmlFor="set-new-password">{PROFILE_NEW_PASSWORD}</Label>
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
            <Label htmlFor="set-confirm-password">{PROFILE_CONFIRM_PASSWORD}</Label>
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
          {pending ? PROFILE_SAVING_PASSWORD : PROFILE_SAVE_PASSWORD}
        </Button>
      </form>
    </section>
  );
}
