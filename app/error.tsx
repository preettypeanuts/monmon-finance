"use client";

import { useEffect } from "react";

import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { Button } from "@/components/ui/button";
import { formatAppError } from "@/lib/errors/format-app-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = formatAppError(error);

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold tracking-tight">Gagal memuat halaman</h1>
          <AuthErrorAlert message={message} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" onClick={reset}>
            Coba lagi
          </Button>
          <Button type="button" variant="outline" onClick={() => window.location.assign("/login")}>
            Ke halaman login
          </Button>
        </div>
      </div>
    </div>
  );
}
