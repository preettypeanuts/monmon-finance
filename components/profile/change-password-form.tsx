"use client";

import { useState } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/auth/auth-client";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
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
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setPending(true);

    const result = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Gagal mengganti password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password berhasil diperbarui.");
  }

  return (
    <section className="space-y-3">
      <div className="space-y-0.5">
        <h2 className="text-[13px] font-medium text-muted-foreground">
          Ganti password
        </h2>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Masukkan password lama dan password baru kamu.
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-900">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password saat ini</Label>
            <PasswordInput
              autoComplete="current-password"
              id="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Password baru</Label>
            <PasswordInput
              autoComplete="new-password"
              id="new-password"
              minLength={8}
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi password baru</Label>
            <PasswordInput
              autoComplete="new-password"
              id="confirm-password"
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
          {pending ? "Menyimpan..." : "Simpan password"}
        </Button>
      </form>
    </section>
  );
}
