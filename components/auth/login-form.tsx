"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import { formatAuthErrorCode } from "@/lib/errors/format-app-error";

export function LoginForm({ googleAuthEnabled = false }: { googleAuthEnabled?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const authErrorFromUrl =
    formatAuthErrorCode(searchParams.get("error")) ??
    (searchParams.get("error_description")?.trim() || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(authErrorFromUrl);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn.email({
      email: email.trim(),
      password,
      callbackURL: callbackUrl,
    });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Gagal masuk. Cek email dan password.");
      return;
    }

    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <AuthCard
      title="Masuk"
      description="Lanjutkan pencatatan keuangan kamu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            minLength={5}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
          />
        </div>

        {error ? <AuthErrorAlert message={error} /> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      {googleAuthEnabled ? (
        <GoogleSignInButton
          callbackUrl={callbackUrl}
          onError={setError}
        />
      ) : null}
    </AuthCard>
  );
}
